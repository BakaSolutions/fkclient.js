import { parseToObject } from "utils"
import Category from "components/Category"
import Widget from "components/Widget"

export default function Boards({ client, initialised }) {
	return (
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
	)
}
