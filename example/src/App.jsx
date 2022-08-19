import { parseParam, parseToObject } from "./utils/index.js"
import { useState, createRef } from "react"
import Category from "./components/Category"
import FKClient from "../../dist/FKClient"
import LogScreen from "./components/LogScreen"
import Widget from "./components/Widget"

let client = undefined
let counter = 0

export default function App() {
	const [log, setLog] = useState([])
	const [initialised, setInitialised] = useState(false)
	const captchaImg = createRef()

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
			refreshCaptcha()
		} catch(err) {
			console.error(err)
		}
	}

	function refreshCaptcha() {
		if(captchaImg.current) {
			captchaImg.current.src = client?.captcha.imageURI
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
				<Category name="Auth">
					<Widget>
						<button
							disabled={!initialised}
							onClick={() => client.auth.whoAmI()}
						>
							Who am I
						</button>
					</Widget>
					<Widget>
						<label>Name</label>
						<input type="text" name="auth.logOn/name" defaultValue="Admin" />
						<label>Email</label>
						<input type="text" name="auth.logOn/email" defaultValue="" />
						<label>Password</label>
						<input type="text" name="auth.logOn/password" defaultValue="changeme" />
						<button
							disabled={!initialised}
							onClick={() => client.auth.logOn(parseToObject("auth.logOn"))}
						>
							Log on
						</button>
					</Widget>
					<Widget>
						<button
							disabled={!initialised}
							onClick={() => client.auth.logOff()}
						>
							Log off
						</button>
					</Widget>
				</Category>
				<Category name="Boards">
					<Widget>
						<button
							onClick={() => client.board.requestMany()} disabled={!initialised}
						>
							Request all boards
						</button>
					</Widget>
					<Widget>
						<label>Board name</label>
						<input type="text" name="board.request/boardName" defaultValue="test" />
						<button
							disabled={!initialised}
							onClick={() => client.board.request(parseToObject("board.request"))}
						>
							Request board
						</button>
					</Widget>
				</Category>
				<Category name="Threads">
					<Widget>
						<label>Board name</label>
						<input type="text" name="thread.requestMany/boardName" defaultValue="test" />
						<label>Count</label>
						<input type="number" name="thread.requestMany/count" defaultValue="10" />
						<label>Page</label>
						<input type="number" name="thread.requestMany/page" defaultValue="0" />
						<button
							disabled={!initialised}
							onClick={() => client.thread.requestMany(parseToObject("thread.requestMany"))}
						>
							Request many threads
						</button>
					</Widget>
					<Widget>
						<label>Thread ID</label>
						<input type="number" name="thread.request/threadId" defaultValue="1" />
						<label>Board name</label>
						<input type="text" name="thread.request/boardName" defaultValue="test" />
						<label>Head number</label>
						<input type="number" name="thread.request/headNumber" defaultValue="1" />
						<button
							disabled={!initialised}
							onClick={() => client.thread.request(parseToObject("thread.request"))}
						>
							Request thread
						</button>
					</Widget>
				</Category>
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
				<Category name="Captcha">
					<Widget>
						<label>Captcha image</label>
						<img id="captchaImage" alt="Captcha" src={client?.captcha.imageURI} ref={captchaImg}></img>
						<button
							disabled={!initialised}
							onClick={refreshCaptcha}
						>
							Refresh captcha image
						</button>
						<label>Code</label>
						<input type="number" name="captcha.validate/code" />
						<button
							disabled={!initialised}
							onClick={() => client.captcha.validate(parseToObject("captcha.validate"))}
						>
							Validate captcha
						</button>
					</Widget>
				</Category>
				<Category name="Users">
					<Widget>
						<label>Group name</label>
						<input type="text" name="users.getInviteCode/groupName" defaultValue="Admin" />
						<button
							disabled={!initialised}
							onClick={() => client.users.getInviteCode(parseToObject("users.getInviteCode"))}
						>
							Generate invite code
						</button>
					</Widget>
				</Category>
			</div>
			<LogScreen log={log} />
		</>
	)
}
