type Listener = [
	Function: (arg0: InMessage | OutMessage) => boolean,
	Function: (arg0: InMessage | OutMessage) => any
]

export type InMessage = {
	what: OutMessage,

	data: {
		ws?: string
	}

	error?: {
		message?: string
		description?: string
		code?: string
	}
}

export type OutMessage = {
	request?: string
	name?: string
	id?: number
	number?: number
	threadNumber?: number
	threadId?: number
	query?: string
	boardName?: string
	count?: number
	page?: number
	parameters?: object

	data?: object
}

function formDataToObject(formData: FormData) {
	const obj: {[key:string]: any} = {}

	for (const key of formData.keys()) {
		obj[key] = formData.get(key)
	}

	return obj
}

function wait(delay: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, delay))
}

export default class Client {
	#APIServerURI: URL
	#WSGate?: WebSocket
	#ready: boolean = false
	#meta: { engine?: string, res?: string, thumb?: string } = {}
	#messageHandlers: Listener[] = []
	#reconnectInterval: number

	constructor(uri: string, reconnectInterval: number = 1e3) {
		this.#APIServerURI = new URL(uri)
		this.#reconnectInterval = reconnectInterval

		this.addListener((message) => {
			return "what" in message && message.data?.ws !== undefined
		}, (message) => {
			this.#meta = { ...this.#meta, ...message.data }
			if (this.#WSGate !== undefined) {
				this.#WSGate.close()
			}
			this.#WSGate = new WebSocket((message as {data: {ws: string}}).data.ws)

			this.#WSGate.onopen = () => this.#ready = true
			this.#WSGate.onclose = (event) => {
				this.#ready = false

				if (event.wasClean === false) {
					this.reconnect()
				}
			}
			window.onbeforeunload = () => this.#WSGate?.close()

			this.#WSGate.addEventListener("message", (message) => {
				this.#handleMessage(JSON.parse(message.data))
			})
		})

		this.reconnect()
	}

	async reconnect(): Promise<void> {
		enum ReconnectState {
			Initial,
			Retry,
			Reconnected,
			Failed,
		}

		let state: ReconnectState = ReconnectState.Initial

		while (state < 2 && this.#ready === false) {
			state = await this.http("GET", "meta", null)
				.then(() => ReconnectState.Reconnected)
				.catch((error) => {
					if (this.#reconnectInterval) {
						console.warn(`Couldn't reconnect: fetch request failed with status code ${error}, retrying in ${this.#reconnectInterval / 1e3} seconds`)
						return wait(this.#reconnectInterval).then(() => ReconnectState.Retry)
					}

					console.error(`Couldn't reconnect: fetch request failed with status code ${error}`)
					return ReconnectState.Failed
				})
		}

		if (state === ReconnectState.Failed) {
			throw "Couldn't reconnect"
		}
	}

	get ready(): boolean {
		return this.#ready
	}

	get meta(): { engine?: string, res?: string, thumb?: string } {
		return this.#meta
	}

	get APIServerURI(): URL {
		return this.#APIServerURI
	}

	#handleMessage(data: InMessage | OutMessage) {
		this.#messageHandlers.forEach(([filter, callback]) => {
			if (filter(data) === true) {
				callback(data)
			}
		})
	}

	addListener(filter: (arg0: InMessage | OutMessage) => boolean, callback: (arg0: InMessage | OutMessage) => any) {
		this.#messageHandlers.push([filter, callback])
	}

	removeListener(filter: (arg0: InMessage | OutMessage) => boolean) {
		this.#messageHandlers = this.#messageHandlers.filter((handler) => handler[0] !== filter)
	}

	ws(req: OutMessage): void {
		let i = setInterval(() => {
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

	async http(method: string, path: string, body: FormData | null): Promise<object> {
		let options: RequestInit = {
			method: method,
			mode: "cors",
			credentials: "include",
			headers: {
				"X-Requested-With": "XMLHttpRequest"
			},
			body: method === "HEAD" || method === "GET" ? null : body
		}

		this.#handleMessage({
			request: `${method} /${path}`,
			data: body ? formDataToObject(body) : undefined
		})

		return fetch(`${this.#APIServerURI.href}api/${path}`, options)
			.then((response) => {
				if (!response.ok) {
					throw `${response.status}: ${response.statusText}`
				}

				return response.json()
			})
			.then((data) => {
				this.#handleMessage({ what: { request: path }, data })
				return data
			})
	}
}
