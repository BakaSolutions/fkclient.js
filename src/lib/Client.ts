import { formDataToObject } from "./utils"
import type { InMessage, Listener, Meta, OutMessage } from "./types"

export default class Client {
	#APIServerURI: URL
	#messageHandlers: Listener[] = []
	#meta?: Meta
	#msgQueue: OutMessage[] = []
	#reconnectDelay: number
	#reconnectInterval?: number
	#WSGate?: WebSocket

	constructor(uri: string, reconnectDelay: number = 0) {
		this.#APIServerURI = new URL(uri)
		this.#reconnectDelay = reconnectDelay

		// Automatically reconnect whenever metadata is received
		this.addListener(
			(message) => "what" in message && message.data?.ws !== undefined,
			(message) => {
				this.#meta = { ...this.#meta, ...message.data }
				this.reconnect()
			}
		)

		this.#requestMeta()
	}

	async #requestMeta(client: Client = this): Promise<void> {
		return client
			.http("GET", "meta", null)
			.then(() => {
				window.clearInterval(client.#reconnectInterval)
				client.#reconnectInterval = undefined
			})
			.catch((error) => {
				if (0 < client.#reconnectDelay && undefined === client.#reconnectInterval) {
					client.#reconnectInterval = window.setInterval(
						client.#requestMeta,
						client.#reconnectDelay,
						client
					)
				}

				throw new Error(
					`Couldn't fetch server metadata: request failed with status code ${error}`
				)
			})
	}

	reconnect(): void {
		// If metadata is missing, request it instead of reconnecting
		// Reconnection will be called automatically once it's fetched
		if (undefined === this.#meta) {
			this.#requestMeta()
			return
		}

		if (this.#WSGate !== undefined) {
			this.#WSGate.close()
		}

		this.#WSGate = new WebSocket(this.#meta.ws)

		this.#WSGate.onopen = () => {
			// Send all messages enqueued before the connection was open
			const q = [...this.#msgQueue]
			this.#msgQueue.length = 0
			q.forEach(req => this.ws(req))
		}

		this.#WSGate.onclose = (event) => {
			if (event.wasClean === false && this.#reconnectDelay > 0) {
				this.reconnect()
			}
		}

		window.onbeforeunload = () => this.#WSGate?.close()

		this.#WSGate.addEventListener("message", (message) => {
			this.#handleMessage(JSON.parse(message.data))
		})
	}

	get ready(): boolean {
		return 1 === this.#WSGate?.readyState
	}

	get meta(): Meta | undefined {
		return this.#meta
	}

	get APIServerURI(): URL {
		return this.#APIServerURI
	}

	#handleMessage(data: InMessage<any> | OutMessage) {
		this.#messageHandlers.forEach(([filter, callback]) => {
			if (filter(data) === true) {
				callback(data)
			}
		})
	}

	addListener(
		filter: (arg0: InMessage<any> | OutMessage) => boolean,
		callback: (arg0: InMessage<any> | OutMessage) => any
	) {
		this.#messageHandlers.push([filter, callback])
	}

	removeListener(filter: (arg0: InMessage<any> | OutMessage) => boolean) {
		this.#messageHandlers = this.#messageHandlers.filter(
			(handler) => handler[0] !== filter
		)
	}

	ws(req: OutMessage): void {
		// If the connection isn't ready, put the message into
		// a queue to be sent as soon as it becomes ready
		if (!this.ready) {
			this.#msgQueue.push(req)
			return
		}

		// Log outbound message
		this.#handleMessage(req)

		// Send the message
		this.#WSGate?.send(JSON.stringify(req))
	}

	async http(
		method: string,
		path: string,
		body: FormData | object | null
	): Promise<object> {
		const isFormData = body instanceof FormData

		const options: RequestInit = {
			method: method,
			mode: "cors",
			credentials: "include",
			headers: {
				"X-Requested-With": "XMLHttpRequest",
			},
			body: !/head|get/i.test(method)
				? isFormData
					? body
					: JSON.stringify(body)
				: null,
		}

		this.#handleMessage({
			request: path,
			data: body
				? isFormData
					? formDataToObject(body)
					: body
				: undefined,
		})

		return fetch(`${this.#APIServerURI.href}api/${path}`, options)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`${response.status}: ${response.statusText}`
					)
				}

				return response.json()
			})
			.then((data) => {
				const dataWithoutError = { ...data }
				delete dataWithoutError.error

				this.#handleMessage({
					what: {
						request: path,
						...(body
							? isFormData
								? formDataToObject(body)
								: body
							: {}),
					},
					data: dataWithoutError,
					error: data.error,
				})

				return data
			})
	}
}
