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

	return (
		<>
			<div id="buttons">
				<h2>General</h2>
				<Widget>
					<label>API address</label>
					<input type="text" name="metaAPI/uri" defaultValue="http://127.0.0.1:6749" disabled={client !== undefined}></input>
					<button onClick={() => readMeta(document.querySelector("[name='metaAPI/uri']").value)}>readMeta</button>
				</Widget>
				<h2>Boards</h2>
				<Widget>
					<button onClick={() => client.readManyBoards()} disabled={client === undefined}>readManyBoards</button>
				</Widget>
				<Widget>
					<label>Board name</label>
					<input type="text" name="readOneBoard/name" defaultValue="b" disabled={client === undefined}></input>
					<button onClick={() => client.readOneBoard(document.querySelector("[name='readOneBoard/name']").value)} disabled={client === undefined}>readOneBoard</button>
				</Widget>
			</div>
			<LogScreen log={log} />
		</>
	)
}
