function getInputValue(node) {
	switch (node.type) {
		case "number":
			return parseInt(node.value)

		case "checkbox":
			return node.checked

		case "date":
			return +new Date(node.value)

		case "text":
		default:
			return node.value
	}
}

export function parseParam(request, parameter) {
	return getInputValue(document.querySelector(`[name="${request}/${parameter}"]`))
}

export function createFormData(requestName) {
	const formData = new FormData()

	document.querySelectorAll(`[name^='${requestName}/']`).forEach((node) => {
		if (node.type === "file") {
			if (node.files.length > 0) {
				formData.append(node.name.replace(`${requestName}/`, ""), node.files[0])
			}
		} else if (node.type === "checkbox") {
			if (node.checked) {
				formData.append(node.name.replace(`${requestName}/`, ""), true)
			}
		} else {
			formData.append(node.name.replace(`${requestName}/`, ""), getInputValue(node))
		}
	})

	return formData
}
