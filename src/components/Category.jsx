import { useReducer } from "react"

export default function Category({ name, openByDefault, children }) {
	const [open, toggleOpen] = useReducer(s => !s, openByDefault)

	return (
		<>
			<h2 onClick={toggleOpen} data-symbol={open ? "-" : "+"}> {name}</h2>
			{open && children}
		</>
	)
}
