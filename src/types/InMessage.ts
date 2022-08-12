import type { OutMessage } from "./OutMessage"

export type InMessage = {
	what: OutMessage

	data: {
		ws?: string
	}

	error?: {
		message?: string
		description?: string
		code?: string
	}
}
