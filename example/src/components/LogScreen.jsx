export default function LogScreen({ log }) {
	return (
		<div id="log">
			{log.map((element) => (
				<pre key={element.id} className={`message ${element.direction}`}>
					{JSON.stringify(element.message, null, 4)}
				</pre>
			))}
		</div>
	)
}
