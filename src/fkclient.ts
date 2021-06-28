const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

export type Listener = [
	Function: (arg0: InMessage | OutMessage) => boolean,
	Function: (arg0: InMessage | OutMessage) => any
]

function formDataToObject(formData: FormData) {
	const obj: {[key:string]: any} = {}

	for (const key of formData.keys()) {
		obj[key] = formData.get(key)
	}

	return obj
}

export type InMessage = {
	what: {
		request: string
		name?: string
		id?: number
		threadId?: number
		query?: string
		boardName?: string
		count?: number
		page?: number
		parameters?: object
	},

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
	threadId?: number
	query?: string
	boardName?: string
	count?: number
	page?: number
	parameters?: object

	data?: object
}

export default class FKClient {
	#APIServerURI: URL
	#WSGate?: WebSocket
	#ready: boolean = false
	#meta: object = {}
	#messageHandlers: Listener[] = []

	constructor(uri: string) {
		this.#APIServerURI = new URL(uri)

		this.addListener((message) => {
			return "what" in message && message.data?.ws !== undefined
		}, (message) => {
			this.#meta = { ...this.#meta, ...message.data }
			if (this.#WSGate !== undefined) {
				this.#WSGate.close()
			}
			this.#WSGate = new WebSocket((message as {data: {ws: string}}).data.ws)

			this.#WSGate.onopen = () => this.#ready = true
			this.#WSGate.onclose = () => this.#ready = false
			window.onbeforeunload = () => this.#WSGate?.close()

			this.#WSGate.addEventListener("message", (message) => {
				this.#handleMessage(JSON.parse(message.data))
			})
		})

		this.readMeta()
	}

	get captchaImageURI() {
		return `${this.#APIServerURI.href}api/captcha?image&timestamp=${+new Date()}`
	}

	get APIServerURI() {
		return this.#APIServerURI.href
	}

	get engine(): string | null {
		return (this.#meta as {engine?: string}).engine || null
	}

	get resPath(): string | null {
		return (this.#meta as { res?: string }).res || null
	}

	get thumbPath(): string | null {
		return (this.#meta as { thumb?: string }).thumb || null
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

	#ws(req: OutMessage): void {
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

	async #http(method: string, path: string, body: FormData | null, retryDelay: number = 0): Promise<object> {
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
			.catch(async (error) => {
				if (!retryDelay) {
					throw `${path} fetch request failed with status code ${error}`
				}

				console.log(`${path} fetch request failed with status code ${error}, retrying in ${retryDelay / 1e3} seconds`)
				await wait(retryDelay)
				return this.#http(method, path, body, retryDelay << 1)
			})
	}

	readMeta() {
		this.#http("GET", "meta", null, 1e3).then((response: any) => {
			this.#handleMessage({ what: { request: "meta" }, data: response })
		})
	}

	readManyBoards() {
		this.#ws({ request: "boards" })
	}

	readOneBoard(name: string) {
		this.#ws({ request: "board", name })
	}

	readManyThreads(boardName: string, count: number, page: number) {
		this.#ws({ request: "threads", boardName, count, page })
	}

	readOneThread(id: number) {
		this.#ws({ request: "thread", id })
	}

	readManyPosts(threadId: number, count: number, page: number) {
		this.#ws({ request: "posts", threadId, count, page })
	}

	readOnePost(id: number) {
		this.#ws({ request: "post", id })
	}

	readFeed(boardName: string, count: number, page: number) {
		this.#ws({ request: "posts", boardName, count, page })
	}

	createPost(formData: FormData) {
		this.#http("POST", "createPost", formData).then((data) => {
			this.#handleMessage({ what: { request: "POST /createPost" }, data })
		})
	}

	deleteOnePost(id: number, boardName: string, number: number, password: string = "") {
		const formData = new FormData()

		if (Number.isInteger(id)) {
			// Delete by id
			formData.append(`selectedPost:${id}`, "true")
		} else {
			// Delete by boardName and number
			formData.append(`selectedPost:${boardName}:${number}`, "true")
		}

		if (password.length >= 0) {
			formData.append("password", password)
		}

		this.#http("POST", "deletePosts", formData).then((data) => {
			this.#handleMessage({ what: { request: "POST /deletePosts" }, data })
		})
	}

	search(query: string, parameters: object) {
		this.#ws({ request: "search", query, parameters })
	}

	checkCaptcha(formData: FormData) {
		this.#http("POST", "checkCaptcha", formData).then((data) => {
			this.#handleMessage({ what: { request: "POST /checkCaptcha" }, data })
		})
	}
}

module.exports = FKClient
