import { parseToObject } from "utils"
import Category from "components/Category"
import Widget from "components/Widget"

export default function Auth({ client, initialised }) {
	return (
		<Category name="Auth">
			<Widget>
				<label>Name</label>
				<input type="text" name="auth.register/name" />
				<label>Email</label>
				<input type="text" name="auth.register/email" />
				<label>Password</label>
				<input type="text" name="auth.register/password" />
				<label>Invite</label>
				<input type="text" name="auth.register/invite" />
				<button
					disabled={!initialised}
					onClick={() => client.auth.register(parseToObject("auth.register"))}
				>
					Register
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
			<Widget>
				<button
					disabled={!initialised}
					onClick={() => client.auth.whoAmI()}
				>
					Who am I
				</button>
			</Widget>
		</Category>
	)
}
