import type { Post } from "./Post"

export type Thread = {
	boardName: string
	head: Post
	id: number
	limits: {
		postsPerMinute: number
		threadBumps: number
		postFiles: number
		postFileSize: number
		postTotalFileSize: number
		postCharactersTop: number
	}
	modifiers: string[]
	posts: number
}
