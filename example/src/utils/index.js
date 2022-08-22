function getInputValue(node) {
	switch (node.type) {
		case "number":
			return parseInt(node.value)

		case "checkbox":
			return node.checked

		case "date":
			return +new Date(node.value)

		case "file":
			return node.files[0]

		case "text":
		default:
			return node.value
	}
}

export function parseParam(request, parameter) {
	return getInputValue(document.querySelector(`[name="${request}/${parameter}"]`))
}

export function parseToObject(domain) {
	const obj = {}

	if (domain === "post.findMany") {
		const inputs = [...document.querySelectorAll(`[name^="${domain}/"]:not([name^="${domain}/query)`)]

		obj.query = getInputValue(document.querySelectorAll(`[name^="${domain}/query"]`))

		obj.parameters = {}
		inputs.forEach((input) => {
			obj.parameters[input.name.split("/")[1]] = getInputValue(input)
		})
	} else {
		const inputs = [...document.querySelectorAll(`[name^="${domain}/"]:not([name^="${domain}/file"])`)]

		inputs.forEach((input) => {
			obj[input.name.split("/")[1]] = getInputValue(input)
		})

		if (domain === "post.create") {
			const attachments = [...document.querySelectorAll(`[name^="${domain}/file"]`)]

			obj.attachments = []
			for (let i = 0; i < attachments.length; i += 2) {
				obj.attachments.push({ file: getInputValue(attachments[i]), spoiler: getInputValue(attachments[i + 1]) })
			}
		}
	}

	return obj
}
