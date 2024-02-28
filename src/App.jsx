import { parseParam } from "utils/index.js"
import { useState, useReducer } from "react"
import AuthCategory from "categories/Auth"
import BoardsCategory from "categories/Boards"
import CaptchaCategory from "categories/Captcha"
import Category from "components/Category"
import FKClient from "lib/FKClient"
import LogScreen from "components/LogScreen"
import PostsCategory from "categories/Posts"
import ThreadsCategory from "categories/Threads"
import UsersCategory from "categories/Users"
import Widget from "components/Widget"

let client = undefined
let counter = 0

export default function App() {
	const [initialised, setInitialised] = useState(false)
	const [log, setLog] = useState([])
	const [shouldRefresh, refresh] = useReducer(() => +new Date(), +new Date())

	function connect(uri, reconnectDelay) {
		try {
			// Create an FKClient instance and tie it to a specific API address
			client = new FKClient(uri, reconnectDelay)

			// Add message listeners
			// The second parameter is a handler function, that decides what to do with the message
			// The first parameter is a filter function, that decides if a message should be handled by the second parameter
			// Here, the filter always returns true, hence all messages are handled by the provided handler
			client.addInMessageListener(
				() => true,
				message => setLog(log => [...log, { direction: "in", id: counter++, message }])
			)

			client.addOutMessageListener(
				() => true,
				message => setLog(log => [...log, { direction: "out", id: counter++, message }])
			)

			setInitialised(true)
			refresh()
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<>
			<div id="buttons">
				<Category name="General" openByDefault={true}>
					<Widget>
						<label>API address</label>
						<input type="text" name="connect/uri" defaultValue="http://127.0.0.1:6749" disabled={initialised} />
						<label>Reconnection delay</label>
						<input type="number" name="connect/reconnectDelay" defaultValue="5000" disabled={initialised} />
						<button
							disabled={initialised}
							onClick={() => connect(parseParam("connect", "uri"), parseParam("connect", "reconnectDelay"))}
						>
							Connect
						</button>
					</Widget>
					<Widget>
						<label children="API address" />
						<input type="text" name="switch/uri" defaultValue="http://127.0.0.1:6749" disabled={!initialised} />
						<button
							children="Switch API"
							disabled={!initialised}
							onClick={() => client.reconnect(parseParam("switch", "uri"))}
						/>
					</Widget>
					<Widget>
						<button
							disabled={!initialised}
							onClick={() => client.reconnect()}
						>
							Reconnect now
						</button>
					</Widget>
					<Widget>
						<button
							disabled={!initialised}
							onClick={() => setLog([])}
						>
							Clean log
						</button>
					</Widget>
				</Category>
				{[AuthCategory, BoardsCategory, ThreadsCategory, PostsCategory, CaptchaCategory, UsersCategory].map((C, i) => (
					<C key={i} client={client} initialised={initialised} shouldRefresh={shouldRefresh} refresh={refresh} />
				))}
			</div>
			<LogScreen log={log} />
		</>
	)
}
