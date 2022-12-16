export type Meta = {
	captcha: {
		size: {
			min: number
			max: number
		}
		ttl: number
		type: string
	}
	engine: string
	res: {
		path: string
	}
	thumb: {
		format: string
		height: number
		path: string
		width: number
	}
	ws: string
}
