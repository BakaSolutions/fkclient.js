import Client from "./Client"

export default class Users {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	getInviteCode({ groupName }: { groupName: string }) {
		if (!groupName) {
			throw new Error("groupName should be specified")
		}

		this.client.ws({ request: "invite", groupName })
	}
}
