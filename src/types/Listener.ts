import type { InMessage } from "./InMessage"
import type { OutMessage } from "./OutMessage"

export type Listener = [
	Function: (arg0: InMessage | OutMessage) => boolean,
	Function: (arg0: InMessage | OutMessage) => any
]
