import { useState } from "react"
import FKClient from "@bakaso/fkclient"
import { parseParam, createFormData } from "./utils/index.js"

import Category  from "./components/Category.jsx"
import Widget    from "./components/Widget.jsx"
import LogScreen from "./components/LogScreen.jsx"

let client = undefined
let counter = 0

export default function App() {
	const [log, setLog] = useState([])
	const [initialised, setInitialised] = useState(false)

	function connect(uri) {
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

			setInitialised(true)
		} catch { }
	}

	return (
		<>
			<div id="buttons">
				<Category name="General" openByDefault={ true }>
					<Widget>
						<label>API address</label>
						<input type="text" name="connect/uri" defaultValue="http://127.0.0.1:6749" disabled={initialised}></input>
						<button onClick={() => connect(parseParam("connect", "uri"))} disabled={initialised}>connect</button>
					</Widget>
					<Widget>
						<button onClick={() => client.readMeta()} disabled={!initialised}>readMeta</button>
					</Widget>
					<Widget>
						<button onClick={() => setLog([])} disabled={!initialised}>Clean log</button>
					</Widget>
				</Category>
				<Category name="Boards">
					<Widget>
						<button onClick={() => client.readManyBoards()} disabled={!initialised}>readManyBoards</button>
					</Widget>
					<Widget>
						<label>Board name</label>
						<input type="text" name="readOneBoard/name" defaultValue="b" disabled={!initialised}></input>
						<button onClick={() => client.readOneBoard(parseParam("readOneBoard", "name"))} disabled={!initialised}>readOneBoard</button>
					</Widget>
				</Category>
				<Category name="Threads">
					<Widget>
						<label>Board name</label>
						<input type="text" name="readManyThreads/boardName" defaultValue="b" disabled={!initialised}></input>
						<label>Count</label>
						<input type="number" name="readManyThreads/count" defaultValue="10" disabled={!initialised}></input>
						<label>Page</label>
						<input type="number" name="readManyThreads/page" defaultValue="0" disabled={!initialised}></input>
						<button onClick={() => client.readManyThreads(parseParam("readManyThreads", "boardName"), parseParam("readManyThreads", "count"), parseParam("readManyThreads", "page"))} disabled={!initialised}>readManyThreads</button>
					</Widget>
					<Widget>
						<label>Thread ID</label>
						<input type="number" name="readOneThread/id" defaultValue="1" disabled={!initialised}></input>
						<button onClick={() => client.readOneThread(parseParam("readOneThread", "id"))} disabled={!initialised}>readOneThread</button>
					</Widget>
				</Category>
				<Category name="Posts">
					<Widget>
						<label>Board name</label>
						<input type="text" name="createPost/boardName" defaultValue="b" disabled={!initialised}></input>
						<label>Thread number</label>
						<input type="number" name="createPost/threadNumber" defaultValue="0" disabled={!initialised}></input>
						<label>Sage</label>
						<input type="checkbox" name="createPost/sage" disabled={!initialised}></input>
						<label>OP</label>
						<input type="checkbox" name="createPost/op" disabled={!initialised}></input>
						<label>Subject</label>
						<input type="text" name="createPost/subject" defaultValue="Testing" disabled={!initialised}></input>
						<label>Text</label>
						<input type="text" name="createPost/text" defaultValue="Hello World!" disabled={!initialised}></input>
						<label>Password</label>
						<input type="text" name="createPost/password" defaultValue="123" disabled={!initialised}></input>
						<label>File[0]</label>
						<input type="file" name="createPost/file[0]" disabled={!initialised}></input>
						<label>File[0] NSFW marker</label>
						<input type="checkbox" name="createPost/fileRating[0]" disabled={!initialised}></input>
						<label>File[1]</label>
						<input type="file" name="createPost/file[1]" disabled={!initialised}></input>
						<label>File[1] NSFW marker</label>
						<input type="checkbox" name="createPost/fileRating[1]" disabled={!initialised}></input>
						<button onClick={() => client.createPost(createFormData("createPost"))} disabled={!initialised}>createPost</button>
					</Widget>
					<Widget>
						<label>Board name</label>
						<input type="text" name="readFeed/boardName" defaultValue="b" disabled={!initialised}></input>
						<label>Count</label>
						<input type="number" name="readFeed/count" defaultValue="10" disabled={!initialised}></input>
						<label>Page</label>
						<input type="number" name="readFeed/page" defaultValue="0" disabled={!initialised}></input>
						<button onClick={() => client.readFeed(parseParam("readFeed", "boardName"), parseParam("readFeed", "count"), parseParam("readFeed", "page"))} disabled={!initialised}>readFeed</button>
					</Widget>
					<Widget>
						<label>Thread ID</label>
						<input type="number" name="readManyPosts/threadID" defaultValue="1" disabled={!initialised}></input>
						<label>Count</label>
						<input type="number" name="readManyPosts/count" defaultValue="10" disabled={!initialised}></input>
						<label>Page</label>
						<input type="number" name="readManyPosts/page" defaultValue="0" disabled={!initialised}></input>
						<button onClick={() => client.readManyPosts(parseParam("readManyPosts", "threadID"), parseParam("readManyPosts", "count"), parseParam("readManyPosts", "page"))} disabled={!initialised}>readManyPosts</button>
					</Widget>
					<Widget>
						<label>Post ID</label>
						<input type="number" name="readOnePost/id" defaultValue="1" disabled={!initialised}></input>
						<button onClick={() => client.readOnePost(parseParam("readOnePost", "id"))} disabled={!initialised}>readOnePost</button>
					</Widget>
					<Widget>
						<label>Post ID</label>
						<input type="number" name="deleteOnePost/id" defaultValue="1" disabled={!initialised}></input>
						<label>Board name</label>
						<input type="text" name="deleteOnePost/boardName" defaultValue="b" disabled={!initialised}></input>
						<label>Number</label>
						<input type="number" name="deleteOnePost/number" defaultValue="0" disabled={!initialised}></input>
						<label>Password</label>
						<input type="text" name="deleteOnePost/password" defaultValue="123" disabled={!initialised}></input>
						<button onClick={() => client.deleteOnePost(parseParam("deleteOnePost", "id"), parseParam("deleteOnePost", "boardName"), parseParam("deleteOnePost", "number"), parseParam("deleteOnePost", "password"))} disabled={!initialised}>deleteOnePost</button>
					</Widget>
					<Widget>
						<label>Query</label>
						<input type="text" name="search/query" defaultValue="foxtan" disabled={!initialised}></input>
						<label>Board name</label>
						<input type="text" name="search/boardName" defaultValue="b" disabled={!initialised}></input>
						<label>Thread number</label>
						<input type="number" name="search/threadNumber" defaultValue="0" disabled={!initialised}></input>
						<label>After</label>
						<input type="date" name="search/after" defaultValue="0" disabled={!initialised}></input>
						<label>Before</label>
						<input type="date" name="search/before" defaultValue="0" disabled={!initialised}></input>
						<label>Search only in subjects</label>
						<input type="checkbox" name="search/searchOnlyInSubjects" disabled={!initialised}></input>
						<button onClick={() => client.search(parseParam("search", "query"), { boardName: parseParam("search", "boardName"), threadNumber: parseParam("search", "threadNumber"), after: parseParam("search", "after"), before: parseParam("search", "before"), searchOnlyInSubjects: parseParam("search", "searchOnlyInSubjects") })} disabled={!initialised}>search</button>
					</Widget>
				</Category>
				<Category name="Captcha">
					<Widget>
						<label>Captcha image</label>
						<img id="captchaImage" alt="Captcha"></img>
						<button onClick={() => document.querySelector("#captchaImage").src = client?.captchaImageURI} disabled={!initialised}>update captcha image</button>
						<label>Code</label>
						<input type="text" name="checkCaptcha/code" disabled={!initialised}></input>
						<button onClick={() => client.checkCaptcha(parseParam("checkCaptcha", "code"))} disabled={!initialised}>checkCaptcha</button>
					</Widget>
				</Category>
			</div>
			<LogScreen log={log} />
		</>
	)
}
