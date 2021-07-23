import { useState } from "react"
import FKClient from "@bakaso/fkclient"
import { parseParam, parseToObject } from "./utils/index.js"

import Category  from "./components/Category.jsx"
import Widget    from "./components/Widget.jsx"
import LogScreen from "./components/LogScreen.jsx"

let client = undefined
let counter = 0

export default function App() {
	const [log, setLog] = useState([])
	const [initialised, setInitialised] = useState(false)

	function connect(uri, reconnectDelay) {
		try {
			// Create an FKClient instance and tie it to a specific API address
			client = new FKClient(uri, reconnectDelay)

			// Add message listeners
			// The second parameter is a handler function, that decides what to do with the message
			// The first parameter is a filter function, that decides if a message should be handled by the second parameter
			// Here, the filter always returns true, hence all messages are handled by the provided handler
			client.addListener(
				() => true,
				message => setLog(log => [...log, { direction: message.what === undefined ? "out" : "in", id: counter++, message }])
			)

			setInitialised(true)
		} catch(err) {
			console.error(err)
		}
	}

	return (
		<>
			<div id="buttons">
				<Category name="General" openByDefault={ true }>
					<Widget>
						<label>API address</label>
						<input type="text" name="connect/uri" defaultValue="http://127.0.0.1:6749" disabled={initialised}></input>
						<label>Reconnection delay</label>
						<input type="number" name="connect/reconnectDelay" defaultValue="5000" disabled={initialised}></input>
						<button onClick={() => connect(parseParam("connect", "uri"), parseParam("connect", "reconnectDelay"))} disabled={initialised}>Connect</button>
					</Widget>
					<Widget>
						<button onClick={() => client.reconnect()} disabled={!initialised}>Reconnect now</button>
					</Widget>
					<Widget>
						<button onClick={() => setLog([])} disabled={!initialised}>Clean log</button>
					</Widget>
				</Category>
				<Category name="Boards">
					<Widget>
						<button onClick={() => client.board.requestMany()} disabled={!initialised}>readManyBoards</button>
					</Widget>
					<Widget>
						<label>Board name</label>
						<input type="text" name="board.request/boardName" defaultValue="test" disabled={!initialised}></input>
						<button onClick={() => client.board.request(parseToObject("board.request"))} disabled={!initialised}>Request board</button>
					</Widget>
				</Category>
				<Category name="Threads">
					<Widget>
						<label>Board name</label>
						<input type="text" name="thread.requestMany/boardName" defaultValue="test" disabled={!initialised}></input>
						<label>Count</label>
						<input type="number" name="thread.requestMany/count" defaultValue="10" disabled={!initialised}></input>
						<label>Page</label>
						<input type="number" name="thread.requestMany/page" defaultValue="0" disabled={!initialised}></input>
						<button onClick={() => client.thread.requestMany(parseToObject("thread.requestMany"))} disabled={!initialised}>Request many threads</button>
					</Widget>
					<Widget>
						<label>Thread ID</label>
						<input type="number" name="thread.request/threadId" defaultValue="1" disabled={!initialised}></input>
						<label>Board name</label>
						<input type="text" name="thread.request/boardName" defaultValue="test" disabled={!initialised}></input>
						<label>Head number</label>
						<input type="number" name="thread.request/headNumber" defaultValue="1" disabled={!initialised}></input>
						<button onClick={() => client.thread.request(parseToObject("thread.request"))} disabled={!initialised}>Request thread</button>
					</Widget>
				</Category>
				<Category name="Posts">
					<Widget>
						<label>Thread ID</label>
						<input type="number" name="post.create/threadId" defaultValue="1" disabled={!initialised}></input>
						<label>Board name</label>
						<input type="text" name="post.create/boardName" defaultValue="test" disabled={!initialised}></input>
						<label>Head number</label>
						<input type="number" name="post.create/headNumber" defaultValue="1" disabled={!initialised}></input>
						<label>Sage</label>
						<input type="checkbox" name="post.create/sage" disabled={!initialised}></input>
						<label>Signed</label>
						<input type="checkbox" name="post.create/signed" disabled={!initialised}></input>
						<label>OP</label>
						<input type="checkbox" name="post.create/op" disabled={!initialised}></input>
						<label>Subject</label>
						<input type="text" name="post.create/subject" defaultValue="Testing" disabled={!initialised}></input>
						<label>Text</label>
						<input type="text" name="post.create/text" defaultValue="Hello World!" disabled={!initialised}></input>
						<label>File[0]</label>
						<input type="file" name="post.create/file[0]" disabled={!initialised}></input>
						<label>File[0] NSFW marker</label>
						<input type="checkbox" name="post.create/fileRating[0]" disabled={!initialised}></input>
						<label>File[1]</label>
						<input type="file" name="post.create/file[1]" disabled={!initialised}></input>
						<label>File[1] NSFW marker</label>
						<input type="checkbox" name="post.create/fileRating[1]" disabled={!initialised}></input>
						<button onClick={() => client.post.create(parseToObject("post.create"))} disabled={!initialised}>Create post</button>
					</Widget>
					<Widget>
						<label>Board name</label>
						<input type="text" name="post.requestMany/boardName" defaultValue="test" disabled={!initialised}></input>
						<label>Head number</label>
						<input type="number" name="post.requestMany/headNumber" defaultValue="1" disabled={!initialised}></input>
						<label>Thread ID</label>
						<input type="number" name="post.requestMany/threadID" defaultValue="1" disabled={!initialised}></input>
						<label>Count</label>
						<input type="number" name="post.requestMany/count" defaultValue="10" disabled={!initialised}></input>
						<label>Page</label>
						<input type="number" name="post.requestMany/page" defaultValue="0" disabled={!initialised}></input>
						<button onClick={() => client.post.requestMany(parseToObject("post.requestMany"))} disabled={!initialised}>Request many posts</button>
					</Widget>
					<Widget>
						<label>Post ID</label>
						<input type="number" name="post.request/postId" defaultValue="1" disabled={!initialised}></input>
						<label>Board name</label>
						<input type="text" name="post.request/boardName" defaultValue="test" disabled={!initialised}></input>
						<label>Post number</label>
						<input type="number" name="post.request/postNumber" defaultValue="1" disabled={!initialised}></input>
						<button onClick={() => client.post.request(parseToObject("post.request"))} disabled={!initialised}>Request post</button>
					</Widget>
					<Widget>
						<label>Post ID</label>
						<input type="number" name="post.delete/postId" defaultValue="1" disabled={!initialised}></input>
						<label>Board name</label>
						<input type="text" name="post.delete/boardName" defaultValue="test" disabled={!initialised}></input>
						<label>Post number</label>
						<input type="number" name="post.delete/postNumber" defaultValue="1" disabled={!initialised}></input>
						<button onClick={() => client.post.delete(parseToObject("post.delete"))} disabled={!initialised}>Delete post</button>
					</Widget>
					<Widget>
						<label>Query</label>
						<input type="text" name="post.findMany/query" defaultValue="foxtan" disabled={!initialised}></input>
						<label>Board name</label>
						<input type="text" name="post.findMany/boardName" defaultValue="test" disabled={!initialised}></input>
						<label>Thread number</label>
						<input type="number" name="post.findMany/threadNumber" defaultValue="1" disabled={!initialised}></input>
						<label>Thread ID</label>
						<input type="number" name="post.findMany/threadId" defaultValue="1" disabled={!initialised}></input>
						<label>After</label>
						<input type="date" name="post.findMany/after" defaultValue="0" disabled={!initialised}></input>
						<label>Before</label>
						<input type="date" name="post.findMany/before" defaultValue="0" disabled={!initialised}></input>
						<label>Search only in subjects</label>
						<input type="checkbox" name="post.findMany/limitToSubjects" disabled={!initialised}></input>
						<button onClick={() => client.post.findMany(parseToObject("post.findMany"))} disabled={!initialised}>Find many posts</button>
					</Widget>
				</Category>
				<Category name="Captcha">
					<Widget>
						<label>Captcha image</label>
						<img id="captchaImage" alt="Captcha"></img>
						<button onClick={() => document.querySelector("#captchaImage").src = client.captcha.imageURI} disabled={!initialised}>Update captcha image</button>
						<label>Code</label>
						<input type="text" name="captcha.validate/code" disabled={!initialised}></input>
						<button onClick={() => client.captcha.validate(parseToObject("captcha.validate"))} disabled={!initialised}>Validate captcha</button>
					</Widget>
				</Category>
			</div>
			<LogScreen log={log} />
		</>
	)
}
