import Client from "./Client"

export default class Thread {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	request({
		threadId,
		boardName,
		headNumber,
	}: {
		threadId?: number
		boardName?: string
		headNumber?: number
	}) {
		if (threadId) {
			this.client.ws({ request: "thread", id: threadId })
		} else if (boardName && headNumber) {
			this.client.ws({ request: "thread", boardName, number: headNumber })
		} else {
			throw new Error(
				"Either threadId or (boardName and headNumber) should be specified"
			)
		}
	}

	requestMany({
		boardName,
		count = 10,
		page = 0,
	}: {
		boardName: string
		count?: number
		page?: number
	}) {
		if (boardName) {
			this.client.ws({ request: "threads", boardName, count, page })
		} else {
			throw new Error("boardName should be specified")
		}
	}
}
