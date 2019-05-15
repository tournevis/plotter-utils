import Box from './Box'
class Poly {
	constructor (positions) {
		this.positions = positions
		this.x = this.getMedianX()
		this.y = this.getMedianY()
	}
	getMin() {
		//return min value
	}
	getMax() {
		//return max value
	}
	getBorderBox() {
		let min = this.getMin()
		let max = this.getMax()
		return new Box (
				min.x,
				min.y,
				max.x - min.x,
				max.y - min.y
			)
	},
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

export default Poly