export type Board = {
	description: string
	limits: {
		threadsPerMinute: number
		postsPerMinute: number
		threadBumps: number
		postFiles: number
		postFileSize: number
		postTotalFileSize: number
		postCharactersTop: number
	}
	modifiers: string[]
	name: string
	title: string
}
