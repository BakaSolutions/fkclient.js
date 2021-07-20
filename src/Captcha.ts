import Client from "./Client"

export default class Captcha {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	get imageURI() {
		return `${this.client.APIServerURI.href}api/captcha?image&timestamp=${+new Date()}`
	}

	validate({ code }: { code: string }) {
		const formData = new FormData()
		formData.append("code", code)

		this.client.http("POST", "checkCaptcha", formData)
	}
}
