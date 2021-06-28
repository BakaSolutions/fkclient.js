import { useState } from "react"
import FKClient from "@bakaso/fkclient"
import Widget from "./Widget"
import LogScreen from "./LogScreen"
import { parseParam, createFormData } from "./utils"

let client = undefined
let counter = 0

export default function App() {
	const [log, setLog] = useState([])

	function readMeta(uri) {
		if (client === undefined) {
			try {
				// Create an FKClient instance and tie it to a specific API address
				client = new FKClient(uri)

				// Add message listeners
				// The second parameter is a handler function, that decides what to do with the message
				// The first parameter is a filter function, that decides if a message should be handled by the second parameter
				// Here, the filter always returns true, hence all messages are handled by the provided handler
				client.addListener(
					() => true,
					message => setLog(log => [...log, { direction: message.what === undefined ? "out" : "in", id: counter++, message }])
				)
			} catch { }
		} else {
			client.readMeta()
		}
	}

	return (
		<>
			<div id="buttons">
				<h2>General</h2>
				<Widget>
					<label>API address</label>
					<input type="text" name="metaAPI/uri" defaultValue="http://127.0.0.1:6749" disabled={client !== undefined}></input>
					<button onClick={() => readMeta(parseParam("metaAPI", "uri"))}>readMeta</button>
				</Widget>
				<h2>Boards</h2>
				<Widget>
					<button onClick={() => client.readManyBoards()} disabled={client === undefined}>readManyBoards</button>
				</Widget>
				<Widget>
					<label>Board name</label>
					<input type="text" name="readOneBoard/name" defaultValue="b" disabled={client === undefined}></input>
					<button onClick={() => client.readOneBoard(parseParam("readOneBoard", "name"))} disabled={client === undefined}>readOneBoard</button>
				</Widget>
				<h2>Threads</h2>
				<Widget>
					<label>Board name</label>
					<input type="text" name="readManyThreads/boardName" defaultValue="b" disabled={client === undefined}></input>
					<label>Count</label>
					<input type="number" name="readManyThreads/count" defaultValue="10" disabled={client === undefined}></input>
					<label>Page</label>
					<input type="number" name="readManyThreads/page" defaultValue="0" disabled={client === undefined}></input>
					<button onClick={() => client.readManyThreads(parseParam("readManyThreads", "boardName"), parseParam("readManyThreads", "count"), parseParam("readManyThreads", "page"))} disabled={client === undefined}>readManyThreads</button>
				</Widget>
				<Widget>
					<label>Thread ID</label>
					<input type="number" name="readOneThread/id" defaultValue="0" disabled={client === undefined}></input>
					<button onClick={() => client.readOneThread(parseParam("readOneThread", "id"))} disabled={client === undefined}>readOneThread</button>
				</Widget>
				<h2>Posts</h2>
				<Widget>
					<label>Board name</label>
					<input type="text" name="createPost/boardName" defaultValue="b" disabled={client === undefined}></input>
					<label>Thread number</label>
					<input type="number" name="createPost/threadNumber" defaultValue="0" disabled={client === undefined}></input>
					<label>Sage</label>
					<input type="checkbox" name="createPost/sage" disabled={client === undefined}></input>
					<label>OP</label>
					<input type="checkbox" name="createPost/op" disabled={client === undefined}></input>
					<label>Subject</label>
					<input type="text" name="createPost/subject" defaultValue="Testing" disabled={client === undefined}></input>
					<label>Text</label>
					<input type="text" name="createPost/text" defaultValue="Hello World!" disabled={client === undefined}></input>
					<label>Password</label>
					<input type="text" name="createPost/password" defaultValue="123" disabled={client === undefined}></input>
					<label>File[0]</label>
					<input type="file" name="createPost/file[0]" disabled={client === undefined}></input>
					<label>File[0] NSFW marker</label>
					<input type="checkbox" name="createPost/fileRating[0]" disabled={client === undefined}></input>
					<label>File[1]</label>
					<input type="file" name="createPost/file[1]" disabled={client === undefined}></input>
					<label>File[1] NSFW marker</label>
					<input type="checkbox" name="createPost/fileRating[1]" disabled={client === undefined}></input>
					<button onClick={() => client.createPost(createFormData("createPost"))} disabled={client === undefined}>createPost</button>
				</Widget>
				<Widget>
					<label>Board name</label>
					<input type="text" name="readFeed/boardName" defaultValue="b" disabled={client === undefined}></input>
					<label>Count</label>
					<input type="number" name="readFeed/count" defaultValue="10" disabled={client === undefined}></input>
					<label>Page</label>
					<input type="number" name="readFeed/page" defaultValue="0" disabled={client === undefined}></input>
					<button onClick={() => client.readFeed(parseParam("readFeed", "boardName"), parseParam("readFeed", "count"), parseParam("readFeed", "page"))} disabled={client === undefined}>readFeed</button>
				</Widget>
				<Widget>
					<label>Thread ID</label>
					<input type="number" name="readManyPosts/threadID" defaultValue="0" disabled={client === undefined}></input>
					<label>Count</label>
					<input type="number" name="readManyPosts/count" defaultValue="10" disabled={client === undefined}></input>
					<label>Page</label>
					<input type="number" name="readManyPosts/page" defaultValue="0" disabled={client === undefined}></input>
					<button onClick={() => client.readManyPosts(parseParam("readManyPosts", "threadID"), parseParam("readManyPosts", "count"), parseParam("readManyPosts", "page"))} disabled={client === undefined}>readManyPosts</button>
				</Widget>
				<Widget>
					<label>Post ID</label>
					<input type="number" name="readOnePost/id" defaultValue="0" disabled={client === undefined}></input>
					<button onClick={() => client.readOnePost(parseParam("readOnePost", "id"))} disabled={client === undefined}>readOnePost</button>
				</Widget>
				<Widget>
					<label>Post ID</label>
					<input type="number" name="deleteOnePost/id" defaultValue="0" disabled={client === undefined}></input>
					<label>Board name</label>
					<input type="text" name="deleteOnePost/boardName" defaultValue="b" disabled={client === undefined}></input>
					<label>Number</label>
					<input type="number" name="deleteOnePost/number" defaultValue="0" disabled={client === undefined}></input>
					<label>Password</label>
					<input type="text" name="deleteOnePost/password" defaultValue="123" disabled={client === undefined}></input>
					<button onClick={() => client.deleteOnePost(parseParam("deleteOnePost", "id"), parseParam("deleteOnePost", "boardName"), parseParam("deleteOnePost", "number"), parseParam("deleteOnePost", "password"))} disabled={client === undefined}>deleteOnePost</button>
				</Widget>
				<h2>Captcha</h2>
				<Widget>
					<label>Captcha image</label>
					<img id="captchaImage" alt="Captcha"></img>
					<button onClick={() => document.querySelector("#captchaImage").src = client?.captchaImageURI} disabled={client === undefined}>update captcha image</button>
					<label>Code</label>
					<input type="text" name="checkCaptcha/code" disabled={client === undefined}></input>
					<button onClick={() => client.checkCaptcha(parseParam("checkCaptcha", "code"))} disabled={client === undefined}>checkCaptcha</button>
				</Widget>
				<h2>Search</h2>
				<Widget>
					<label>Query</label>
					<input type="text" name="search/query" defaultValue="foxtan" disabled={client === undefined}></input>
					<label>Board name</label>
					<input type="text" name="search/boardName" defaultValue="b" disabled={client === undefined}></input>
					<label>Thread number</label>
					<input type="number" name="search/threadNumber" defaultValue="0" disabled={client === undefined}></input>
					<label>After</label>
					<input type="date" name="search/after" defaultValue="0" disabled={client === undefined}></input>
					<label>Before</label>
					<input type="date" name="search/before" defaultValue="0" disabled={client === undefined}></input>
					<label>Search only in subjects</label>
					<input type="checkbox" name="search/searchOnlyInSubjects" disabled={client === undefined}></input>
					<button onClick={() => client.search(parseParam("search", "query"), { boardName: parseParam("search", "boardName"), threadNumber: parseParam("search", "threadNumber"), after: parseParam("search", "after"), before: parseParam("search", "before"), searchOnlyInSubjects: parseParam("search", "searchOnlyInSubjects") })} disabled={client === undefined}>search</button>
				</Widget>
			</div>
			<LogScreen log={log} />
		</>
	)
}
