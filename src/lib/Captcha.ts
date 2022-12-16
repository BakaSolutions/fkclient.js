import Client from "./Client"

export default class Captcha {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	getTrustedPostCount() {
		this.client.ws({ request: "trustedPostCount" })
	}

	getImageURI({ timestamp }: { timestamp: number }) {
		if (!isFinite(timestamp) && 0 >= timestamp) {
			throw new Error("timestamp should be specified")
		}

		return this.client.APIServerURI.href + "api/captcha?image&timestamp=" + timestamp
	}

	validate({ code, timestamp }: { code: string, timestamp: number }) {
		const { min, max } = this.client.meta!.captcha.size

		if (code.length < min) {
			throw new Error(`Captcha code should be at least ${min} symbols long`)
		}

		if (code.length > max) {
			throw new Error(`Captcha code cannot be more than ${max} symbols long`)
		}

		if (!isFinite(timestamp) && 0 >= timestamp) {
			throw new Error("A correct captcha timestamp should be specified")
		}

		const formData = new FormData()
		formData.set("code", code)
		formData.set("timestamp", String(timestamp))

		this.client.http("POST", "checkCaptcha", formData)
	}

	get ttl() {
		return this.client.meta?.captcha.ttl || 0
	}

	get type() {
		return this.client.meta?.captcha.type || "Number"
	}

	get size() {
		return this.client.meta?.captcha.size || { min: 0, max: 99 }
	}
}
