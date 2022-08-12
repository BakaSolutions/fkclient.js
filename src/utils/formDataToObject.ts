export function formDataToObject(formData: FormData) {
	const obj: { [key: string]: any } = {}

	for (const key of formData.keys()) {
		obj[key] = formData.get(key)
	}

	return obj
}
