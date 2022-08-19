import { formDataToObject } from "./utils"
import type { InMessage, Listener, Meta, OutMessage } from "./types"

export default class Client {
	#APIServerURI: URL
	#WSGate?: WebSocket
	#ready: boolean = false
	#meta?: Meta
	#messageHandlers: Listener[] = []
	#reconnectDelay: number
	#reconnectInterval?: number

	constructor(uri: string, reconnectDelay: number = 0) {
		this.#APIServerURI = new URL(uri)
		this.#reconnectDelay = reconnectDelay

		this.addListener(
			(message) => "what" in message && message.data?.ws !== undefined,
			(message) => {
				this.#meta = { ...this.#meta, ...message.data }
				if (this.#WSGate !== undefined) {
					this.#WSGate.close()
				}
				this.#WSGate = new WebSocket(
					(message as InMessage<Meta>).data.ws
				)

				this.#WSGate.onopen = () => (this.#ready = true)
				this.#WSGate.onclose = (event) => {
					this.#ready = false

					if (event.wasClean === false && this.#reconnectDelay > 0) {
						this.reconnect()
					}
				}
				window.onbeforeunload = () => this.#WSGate?.close()

				this.#WSGate.addEventListener("message", (message) => {
					this.#handleMessage(JSON.parse(message.data))
				})
			}
		)

		this.reconnect()
	}

	reconnect(client: Client = this): void {
		client
			.http("GET", "meta", null)
			.then(() => {
				window.clearInterval(client.#reconnectInterval)
				client.#reconnectInterval = undefined
			})
			.catch((error) => {
				if (
					client.#reconnectDelay > 0 &&
					client.#reconnectInterval === undefined
				) {
					client.#reconnectInterval = window.setInterval(
						client.reconnect,
						client.#reconnectDelay,
						client
					)
				}

				throw `Couldn't reconnect: fetch request failed with status code ${error}`
			})
	}

	get ready(): boolean {
		return this.#ready
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
		const i = setInterval(() => {
			this.#handleMessage(req)

			clearInterval(i)

			const sendRequest = () => this.#WSGate?.send(JSON.stringify(req))

			if (this.#ready) {
				sendRequest()
			} else {
				this.#WSGate?.addEventListener("open", () => sendRequest())
			}
		}, 1e2)
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
					throw `${response.status}: ${response.statusText}`
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
