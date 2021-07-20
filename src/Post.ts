import Client from "./Client"

export default class Post {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	request({ postId, boardName, postNumber }: { postId?: number, boardName?: string, postNumber?: number }) {
		if (postId) {
			this.client.ws({ request: "post", id: postId })
		} else if (boardName && postNumber) {
			this.client.ws({ request: "post", boardName, number: postNumber })
		} else {
			throw "Either (postId) or (boardName and postNumber) should be specified"
		}
	}

	requestMany({ boardName, headNumber, threadId, count = 10, page = 0 }: { boardName?: string, headNumber?: number, threadId?: number, count?: number, page?: number }) {
		if (boardName && headNumber) {
			this.client.ws({ request: "posts", boardName, threadNumber: headNumber, count, page })
		} else if (boardName) {
			this.client.ws({ request: "posts", boardName, count, page })
		} else if (threadId) {
			this.client.ws({ request: "posts", threadId, count, page })
		} else {
			throw "Either (boardName) or (boardName and headNumber) or (threadId) should be specified"
		}
	}

	create({ threadId, boardName, headNumber, sage, signed, op, subject, text, attachments }: { threadId?: number, boardName: string, headNumber: number, sage?: boolean, signed?: boolean, op?: boolean, subject?: string, text?:string, attachments?: {file: File, spoiler?: boolean}[] }) {
		let formData = new FormData()

		if (threadId) {
			formData.append("threadId", threadId.toString())
		} else if (boardName && headNumber) {
			formData.append("boardName", boardName)
			formData.append("threadNumber", headNumber.toString())
		} else if (boardName) {
			formData.append("boardName", boardName)
		} else {
			throw "Either (boardName) or (threadId) or (boardName and headNumber) should be specified"
		}

		if (sage) {
			formData.append("modifiers:sage", "true")
		}

		if (signed) {
			formData.append("modifiers:signed", "true")
		}

		if (op) {
			formData.append("modifiers:OP", "true")
		}

		if (subject) {
			formData.append("subject", subject)
		}

		if (text) {
			formData.append("text", text)
		}

		attachments?.forEach((attachment, i) => {
			if (!attachment.file) return

			formData.append(`file:${i}`, attachment.file)

			if (attachment.spoiler) {
				formData.append(`fileMark:${i}:NSFW`, "true")
			}
		})

		this.client.http("POST", "createPost", formData)
	}

	findMany({ query, parameters }: { query: string, parameters: { boardName?: string, threadNumber?: number, threadId?: number, after?: Date, before?: Date, limitToSubjects?: boolean }}) {
		(parameters as { boardName?: string, threadNumber?: number, threadId?: number, after?: Date, before?: Date, searchOnlyInSubjects?: boolean }).searchOnlyInSubjects = parameters.limitToSubjects
		delete parameters.limitToSubjects

		this.client.ws({ request: "search", query, parameters })
	}

	delete(id: { postId: number, boardName: string, postNumber: number }) {
		this.deleteMany([id])
	}

	deleteMany(ids: { postId: number, boardName: string, postNumber: number }[]) {
		const formData = new FormData()

		ids.forEach((id) => {
			if (id.postId) {
				formData.append(`selectedPost:${id.postId}`, "true")
			} else if (id.boardName && id.postNumber) {
				formData.append(`selectedPost:${id.boardName}:${id.postNumber}`, "true")
			} else {
				throw "Either (postId) or (boardName and postNumber) should be specified"
			}
		})

		this.client.http("POST", "deletePosts", formData)
	}
}
