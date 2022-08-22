import Client from "./Client"

export default class Auth {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	register({
		email,
		invite,
		name,
		password,
	}: {
		email?: string
		invite: string
		name?: string
		password: string
	}) {
		if (!name && !email) {
			throw "Either name or email should be specified"
		}

		if (!invite) {
			throw "Invite code should be specified"
		}

		if (!password) {
			throw "Password should be specified"
		}

		const formData = new FormData()
		email && formData.append("email", email)
		formData.append("invite", invite)
		formData.append("password", password)
		name && formData.append("name", name)

		this.client.http("POST", "register", formData).then(() => {
			this.client.reconnect()
		})
	}

	logOn({
		email,
		name,
		password,
	}: {
		email?: string
		name?: string
		password: string
	}) {
		if (!name && !email) {
			throw "Either name or email should be specified"
		}

		if (!password) {
			throw "Password should be specified"
		}

		const formData = new FormData()
		email && formData.append("email", email)
		formData.append("password", password)
		name && formData.append("name", name)

		this.client.http("POST", "logOn", formData).then(() => {
			this.client.reconnect()
		})
	}

	logOff() {
		this.client.http("POST", "logOff", null).then(() => {
			this.client.reconnect()
		})
	}

	whoAmI() {
		this.client.http("get", "whoAmI", null)
	}
}
