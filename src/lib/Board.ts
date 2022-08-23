import Client from "./Client"

export default class Board {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	request({ boardName }: { boardName: string }) {
		if (boardName) {
			this.client.ws({ request: "board", name: boardName })
		} else {
			throw new Error("boardName should be specified")
		}
	}

	requestMany() {
		this.client.ws({ request: "boards" })
	}
}
