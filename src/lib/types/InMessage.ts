import type { OutMessage } from "./OutMessage"

export type InMessage<T> = {
	data: T
	error?: {
		message?: string
		description?: string
		code?: string
	}
	event?: "created" | "deleted" | "edited"
	type?: "board" | "thread" | "post"
	what: OutMessage
}
