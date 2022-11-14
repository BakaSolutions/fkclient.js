import type { InMessage } from "./InMessage"

export type InMessageListener = [
	filter: (arg0: InMessage<any>) => boolean,
	callback: (arg0: InMessage<any>) => any,
]
