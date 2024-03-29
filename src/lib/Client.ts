import { formDataToObject } from "./utils"
import type { InMessage, InMessageListener, OutMessageListener, Meta, OutMessage } from "./types"

export default class Client {
	#APIServerURI: URL
	#inMessageHandlers: InMessageListener[] = []
	#meta?: Meta
	#msgQueue: OutMessage[] = []
	#outMessageHandlers: OutMessageListener[] = []
	#reconnectDelay: number
	#reconnectInterval?: number
	#WSGate?: WebSocket

	constructor(uri: string, reconnectDelay: number = 0) {
		this.#APIServerURI = new URL(uri)
		this.#reconnectDelay = reconnectDelay

		// Automatically reconnect whenever metadata is received
		this.addInMessageListener(
			(msg: InMessage<any>) => "what" in msg && msg.data?.ws !== undefined,
			(msg: InMessage<Meta>) => {
				this.#meta = { ...this.#meta, ...msg.data }
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

	reconnect(uri?: string): void {
		if (undefined !== uri) {
			this.#meta = undefined
			this.#APIServerURI = new URL(uri)
		}

		if (this.#WSGate !== undefined) {
			this.#WSGate.close()
		}

		// If metadata is missing, request it instead of reconnecting
		// Reconnection will be called automatically once it's fetched
		if (undefined === this.#meta) {
			this.#requestMeta()
			return
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
			this.#handleInMessage(JSON.parse(message.data))
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

	#handleInMessage(data: InMessage<any>) {
		this.#inMessageHandlers.forEach(([filter, callback]) => {
			try {
				filter(data) && callback(data)
			} catch (error) {
				console.error(error)
			}
		})
	}

	#handleOutMessage(data: OutMessage) {
		this.#outMessageHandlers.forEach(([filter, callback]) => {
			try {
				filter(data) && callback(data)
			} catch (error) {
				console.error(error)
			}
		})
	}

	addInMessageListener(filter: (arg0: InMessage<any>) => boolean, callback: (arg0: InMessage<any>) => any) {
		this.#inMessageHandlers.push([filter, callback])
	}

	addOutMessageListener(filter: (arg0: OutMessage) => boolean, callback: (arg0: OutMessage) => any) {
		this.#outMessageHandlers.push([filter, callback])
	}

	removeInMessageListener(filter: (arg0: InMessage<any>) => boolean) {
		this.#inMessageHandlers = this.#inMessageHandlers.filter(h => h[0] !== filter)
	}

	removeOutMessageListener(filter: (arg0: OutMessage) => boolean) {
		this.#outMessageHandlers = this.#outMessageHandlers.filter(h => h[0] !== filter)
	}

	ws(req: OutMessage): void {
		// If the connection isn't ready, put the message into
		// a queue to be sent as soon as it becomes ready
		if (!this.ready) {
			this.#msgQueue.push(req)
			return
		}

		// Log outbound message
		this.#handleOutMessage(req)

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

		this.#handleOutMessage({
			request: path,
			data: body
				? isFormData
					? formDataToObject(body)
					: body
				: undefined,
		})

		return fetch(`${this.#APIServerURI.href}api/${path}`, options)
			.then(response => response.json())
			.then((data) => {
				const dataWithoutError = { ...data }
				delete dataWithoutError.error

				this.#handleInMessage({
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
