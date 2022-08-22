import { parseToObject } from "utils"
import Category from "components/Category"
import Widget from "components/Widget"

export default function Users({ client, initialised }) {
	return (
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
	)
}
