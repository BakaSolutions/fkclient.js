import type { OutMessage } from "./OutMessage"

export type OutMessageListener = [
	filter: (arg0: OutMessage) => boolean,
	callback: (arg0: OutMessage) => any,
]
