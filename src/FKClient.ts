import Board from "./Board"
import Captcha from "./Captcha"
import Client from "./Client"
import Post from "./Post"
import Thread from "./Thread"
import type { InMessage, OutMessage } from "./types"

export default class FKClient {
	#client: Client
	#board?: Board
	#thread?: Thread
	#post?: Post
	#captcha?: Captcha

	constructor(uri: string, reconnectDelay: number) {
		this.#client = new Client(uri, reconnectDelay)

		this.#board = new Board(this.#client)
		this.#thread = new Thread(this.#client)
		this.#post = new Post(this.#client)
		this.#captcha = new Captcha(this.#client)
	}

	reconnect() {
		this.#client.reconnect()
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

	get res(): { path: string } | null {
		return this.#client?.meta?.res || null
	}

	get thumb(): {
		path: string
		format: string
		width: number
		height: number
	} | null {
		return this.#client?.meta?.thumb || null
	}

	addListener(
		filter: (arg0: InMessage | OutMessage) => boolean,
		callback: (arg0: InMessage | OutMessage) => any
	) {
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
