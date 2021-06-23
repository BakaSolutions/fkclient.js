const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

type Listener = [Function: (arg0: object) => boolean, Function: (arg0: object) => any]

export default class FKClient {
	#APIServerURI: URL
	#WSGate?: WebSocket
	#ready: boolean = false
	#meta: object = {}
	#messageHandlers: Listener[] = []

	constructor(uri: string) {
		this.#APIServerURI = new URL(uri)

		this.#http("GET", "meta", null, 1e3).then((response: any) => {
			this.#handleMessage({ what: { request: "meta" }, data: response })

			if (response["ws"] === undefined) {
				throw "API initialisation failed"
			}

			this.#meta = { ...this.#meta, ...response }
			this.#WSGate = new WebSocket(response["ws"])

			this.#WSGate.onopen = () => this.#ready = true
			this.#WSGate.onclose = () => this.#ready = false
			window.onbeforeunload = () => this.#WSGate?.close()

			this.#WSGate.addEventListener("message", (message) => {
				this.#handleMessage(JSON.parse(message.data))
			})
		})
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

	#handleMessage(data: object) {
		this.#messageHandlers.forEach(([filter, callback]) => {
			if (filter(data) === true) {
				callback(data)
			}
		})
	}

	addListener(filter: (arg0: object) => boolean, callback: (arg0: object) => any) {
		this.#messageHandlers.push([filter, callback])
	}

	removeListener(filter: (arg0: object) => boolean) {
		this.#messageHandlers = this.#messageHandlers.filter((handler) => handler[0] !== filter)
	}

	#ws(req: object): void {
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
		this.#http("POST", "newPost", formData).then((data) => {
			this.#handleMessage({ what: { request: "submitPost" }, data })
		})
	}

	deleteManyPosts(formData: FormData) {
		this.#http("POST", "deletePosts", formData).then((data) => {
			this.#handleMessage({ what: { request: "deletePosts" }, data })
		})
	}

	search(query: string, parameters: object) {
		this.#ws({ request: "search", query, parameters })
	}

	checkCaptcha(formData: FormData) {
		this.#http("POST", "checkCaptcha", formData).then((data) => {
			this.#handleMessage({ what: { request: "checkCaptcha" }, data })
		})
	}
}

module.exports = FKClient
