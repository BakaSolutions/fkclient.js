import Auth from "./Auth"
import Board from "./Board"
import Captcha from "./Captcha"
import Client from "./Client"
import Post from "./Post"
import Thread from "./Thread"
import Users from "./Users"

import type { InMessage, OutMessage } from "./types"

export default class FKClient {
	#client: Client

	#auth: Auth
	#board: Board
	#captcha: Captcha
	#post: Post
	#thread: Thread
	#users: Users

	constructor(uri: string, reconnectDelay: number) {
		this.#client = new Client(uri, reconnectDelay)

		this.#users = new Users(this.#client)
		this.#auth = new Auth(this.#client)
		this.#board = new Board(this.#client)
		this.#captcha = new Captcha(this.#client)
		this.#post = new Post(this.#client)
		this.#thread = new Thread(this.#client)
	}

	reconnect(uri?: string) {
		this.#client.reconnect(uri)
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

	addInMessageListener(filter: (arg0: InMessage<any>) => boolean, callback: (arg0: InMessage<any>) => any) {
		return this.#client.addInMessageListener(filter, callback)
	}

	addOutMessageListener(filter: (arg0: OutMessage) => boolean, callback: (arg0: OutMessage) => any) {
		return this.#client.addOutMessageListener(filter, callback)
	}

	removeInMessageListener(filter: (arg0: InMessage<any>) => boolean) {
		return this.#client.removeInMessageListener(filter)
	}

	removeOutMessageListener(filter: (arg0: OutMessage) => boolean) {
		return this.#client.removeOutMessageListener(filter)
	}

	get auth() {
		return this.#auth
	}

	get board() {
		return this.#board
	}

	get captcha() {
		return this.#captcha
	}

	get thread() {
		return this.#thread
	}

	get post() {
		return this.#post
	}

	get users() {
		return this.#users
	}
}
