import type { File } from "./File"

export type Post = {
	attachments: File[]
	createdAt: string
	editedAt?: string
	id: number
	marks: string[]
	modifiers: string[]
	number: number
	replies: Post[]
	subject: string
	text: string
	threadId: number
}
