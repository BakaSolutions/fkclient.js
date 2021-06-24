import { useState } from "react"
import FKClient from "@bakaso/fkclient"
import Widget from "./Widget"
import LogScreen from "./LogScreen"

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

	function parseParam(request, parameter) {
		const node = document.querySelector(`[name="${request}/${parameter}"]`)

		switch (node.type) {
			case "number":
				return parseInt(node.value)

			case "checkbox":
				return node.checked

			case "date":
				return +new Date(node.value)

			case "text":
			default:
				return node.value
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
