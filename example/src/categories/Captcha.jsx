import { parseToObject } from "utils"
import { useMemo } from "react"
import Category from "components/Category"
import Widget from "components/Widget"

export default function Captcha({ client, initialised, shouldRefresh, refresh }) {
	// eslint-disable-next-line
	const src = useMemo(() => client?.captcha.imageURI, [shouldRefresh])

	return (
		<Category name="Captcha">
			<Widget>
				<label>Captcha image</label>
				<img id="captchaImage" alt="Captcha" src={src} />
				<button
					disabled={!initialised}
					onClick={refresh}
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
	)
}
