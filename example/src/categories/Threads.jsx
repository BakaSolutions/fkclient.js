import { parseToObject } from "utils"
import Category from "components/Category"
import Widget from "components/Widget"

export default function Threads({ client, initialised }) {
	return (
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
	)
}
