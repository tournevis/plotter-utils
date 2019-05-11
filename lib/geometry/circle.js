class Circle {
	constructor (x, y ,radius) {
		this.positions = []
		this.x = x
		this.y = y
		this.radius = radius
		this.createPoly()
	}
	createPoly (curveRes = 70) {
		for(var i = 0; i < 2 * Math.PI ; i +=(2 * Math.PI) / curveRes) {
			var obj = {
				x: Math.cos(i) * this.radius + this.x ,
				y:  this.y - Math.sin(i) * this.radius ,
				penState: 'down',
			}
			this.positions.push(obj)
		}
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

export default Circle