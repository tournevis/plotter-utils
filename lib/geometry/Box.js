class Box {
	constructor (x, y, width, height) {
		this.positions = []
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.createPoly()
	}
	createPoly () {
		this.positions.push({x: this.x, y: this.y, penState: 'down'})
		this.positions.push({x: this.x + this.width, y: this.y, penState: 'down'})
		this.positions.push({x: this.x + this.width, y: this.y + this.height, penState: 'down'})
		this.positions.push({x: this.x, y: this.y + this.height, penState: 'down'})
		return this.closePoly()
	}
	closePoly () {
		this.positions.push({
			...this.positions[0]
		})
		this.positions.unshift({
			...this.positions[0],
			penState: 'up'
		})
		this.positions.push({
			...this.positions[this.positions.length - 1],
			penState: 'up'
		})
		return this.positions
	}
	getPosition () {
		return this.positions
	}
}

export default Box