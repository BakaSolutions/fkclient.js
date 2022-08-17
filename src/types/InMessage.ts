import type { OutMessage } from "./OutMessage"

export type InMessage<T> = {
	what: OutMessage
	data: T
	error?: {
		message?: string
		description?: string
		code?: string
	}
}
