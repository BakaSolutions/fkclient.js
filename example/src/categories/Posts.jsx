import { parseToObject } from "utils"
import Category from "components/Category"
import Widget from "components/Widget"

export default function Posts({ client, initialised }) {
	return (
		<Category name="Posts">
			<Widget>
				<label>Thread ID</label>
				<input type="number" name="post.create/threadId" defaultValue="1" />
				<label>Board name</label>
				<input type="text" name="post.create/boardName" defaultValue="test" />
				<label>Head number</label>
				<input type="number" name="post.create/headNumber" defaultValue="1" />
				<label>Sage</label>
				<input type="checkbox" name="post.create/sage" />
				<label>Signed</label>
				<input type="checkbox" name="post.create/signed" />
				<label>OP</label>
				<input type="checkbox" name="post.create/op" />
				<label>Subject</label>
				<input type="text" name="post.create/subject" defaultValue="Testing" />
				<label>Text</label>
				<input type="text" name="post.create/text" defaultValue="Hello World!" />
				<label>File[0]</label>
				<input type="file" name="post.create/file[0]" />
				<label>File[0] NSFW marker</label>
				<input type="checkbox" name="post.create/fileRating[0]" />
				<label>File[1]</label>
				<input type="file" name="post.create/file[1]" />
				<label>File[1] NSFW marker</label>
				<input type="checkbox" name="post.create/fileRating[1]" />
				<button
					disabled={!initialised}
					onClick={() => client.post.create(parseToObject("post.create"))}
				>
					Create post
				</button>
			</Widget>
			<Widget>
				<label>Board name</label>
				<input type="text" name="post.requestMany/boardName" defaultValue="test" />
				<label>Head number</label>
				<input type="number" name="post.requestMany/headNumber" defaultValue="1" />
				<label>Thread ID</label>
				<input type="number" name="post.requestMany/threadId" defaultValue="1" />
				<label>Count</label>
				<input type="number" name="post.requestMany/count" defaultValue="10" />
				<label>Page</label>
				<input type="number" name="post.requestMany/page" defaultValue="0" />
				<button
					disabled={!initialised}
					onClick={() => client.post.requestMany(parseToObject("post.requestMany"))}
				>
					Request many posts
				</button>
			</Widget>
			<Widget>
				<label>Post ID</label>
				<input type="number" name="post.request/postId" defaultValue="1" />
				<label>Board name</label>
				<input type="text" name="post.request/boardName" defaultValue="test" />
				<label>Post number</label>
				<input type="number" name="post.request/postNumber" defaultValue="1" />
				<button
					disabled={!initialised}
					onClick={() => client.post.request(parseToObject("post.request"))}
				>
					Request post
				</button>
			</Widget>
			<Widget>
				<label>Post ID</label>
				<input type="number" name="post.delete/postId" defaultValue="1" />
				<label>Board name</label>
				<input type="text" name="post.delete/boardName" defaultValue="test" />
				<label>Post number</label>
				<input type="number" name="post.delete/postNumber" defaultValue="1" />
				<button
					disabled={!initialised}
					onClick={() => client.post.delete(parseToObject("post.delete"))}
				>
					Delete post
				</button>
			</Widget>
			<Widget>
				<label>Query</label>
				<input type="text" name="post.findMany/query" defaultValue="foxtan" />
				<label>Board name</label>
				<input type="text" name="post.findMany/boardName" defaultValue="test" />
				<label>Thread number</label>
				<input type="number" name="post.findMany/threadNumber" defaultValue="1" />
				<label>Thread ID</label>
				<input type="number" name="post.findMany/threadId" defaultValue="1" />
				<label>After</label>
				<input type="date" name="post.findMany/after" defaultValue="0" />
				<label>Before</label>
				<input type="date" name="post.findMany/before" defaultValue="0" />
				<label>Search only in subjects</label>
				<input type="checkbox" name="post.findMany/limitToSubjects" />
				<button
					disabled={!initialised}
					onClick={() => client.post.findMany(parseToObject("post.findMany"))}
				>
					Find many posts
				</button>
			</Widget>
		</Category>
	)
}
