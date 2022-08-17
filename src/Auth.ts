import Client from "./Client"

export default class Auth {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	logOn({
		name,
		email,
		password,
	}: {
		name?: string
		email?: string
		password: string
	}) {
		if (!name && !email) {
			throw "Either name or email should be specified"
		}

		const formData = new FormData()
		name && formData.append("name", name)
		email && formData.append("email", email)
		formData.append("password", password)

		this.client.http("POST", "logOn", formData)
	}

	logOff() {
		this.client.http("POST", "logOff", null)
	}

	whoAmI() {
		this.client.http("get", "whoAmI", null)
	}
}
