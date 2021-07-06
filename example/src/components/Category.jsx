import { useState } from "react"

export default function Category({ name, openByDefault, children }) {
	const [open, setOpen] = useState(openByDefault)

	return (
		<>
			<h2 onClick={() => setOpen(!open)} data-symbol={ open ? "-" : "+" }> { name }</h2>
			{ open ? children : null }
		</>
	)
}
