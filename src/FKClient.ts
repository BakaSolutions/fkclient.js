import Client, {
	InMessage,
	OutMessage
}              from "./Client"
import Board   from "./Board"
import Thread  from "./Thread"
import Post    from "./Post"
import Captcha from "./Captcha"

export default class FKClient {
	#client: Client
	#board?: Board
	#thread?: Thread
	#post?: Post
	#captcha?: Captcha

	constructor(uri: string) {
		this.#client = new Client(uri)

		this.#board = new Board(this.#client)
		this.#thread = new Thread(this.#client)
		this.#post = new Post(this.#client)
		this.#captcha = new Captcha(this.#client)
	}

	get ready() {
		return this.#client.ready
	}

	get APIServerURI() {
		return this.#client?.APIServerURI?.href
	}

	get engine(): string | null {
		return this.#client?.meta?.engine || null
	}

	get resPath(): string | null {
		return this.#client?.meta?.res || null
	}

	get thumbPath(): string | null {
		return this.#client?.meta?.thumb || null
	}

	addListener(filter: (arg0: InMessage | OutMessage) => boolean, callback: (arg0: InMessage | OutMessage) => any) {
		return this.#client.addListener(filter, callback)
	}

	removeListener(filter: (arg0: InMessage | OutMessage) => boolean) {
		return this.#client.removeListener(filter)
	}

	get board() {
		return this.#board
	}

	get thread() {
		return this.#thread
	}

	get post() {
		return this.#post
	}

	get captcha() {
		return this.#captcha
	}
}

// module.exports = FKClient
