import { useState } from "react"
import FKClient from "@bakaso/fkclient"

import Widget from "./Widget"

let client = undefined
let counter = 0

export default function App() {
	const [log, setLog] = useState([])

	function readMeta(uri) {
		if (client === undefined) {
			try {
				client = new FKClient(uri)
				client.addListener(() => true, data => setLog(log => [...log, { direction: data.what === undefined ? "out" : "in", id: counter++, message: data }]))
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
			<div id="log">
				{
					log.map((element) => {
						return (
							<pre key={element.id} className={`message ${element.direction}`}>
								{JSON.stringify(element.message, null, 4)}
							</pre>
						)
					})
				}
			</div>
		</>
	)
}
