export default class Gcode {
	constructor (config) {
		this.maxSize = config.maxSize || {x: 200, y: 287}
		this.revert = config.revert ? -1 : 1
		this.lastPenState = 'up'
		this.unit = (config.unit ||  'G21') + '\n' // units in mm by default
 		this.penDownCommand = (config.penDownCommand || 'S1000 M3') + '\n'
		this.penUpCommand = (config.penUpCommand  || 'S0 M5') + '\n'
		this.baseCommand = config.baseCommand || 'G01'
		this.mode = config.mode || 'E2 A1\n' // Servo mode in mm by default
		this.speed = 'F5000\n'
	}

	initPlotter () {
		this.gcodeStr = ''

		this.gcodeStr = this.unit

		// Movement Speed
		this.gcodeStr += this.speed


		this.gcodeStr += this.mode

		//ensure that pen is up
		this.gcodeStr += this.penUpCommand
		this.lastPenState = 'up'
		return this.gcodeStr
	}
	generate (position) {
		this.initPlotter()
		this.travelToFirstPoint(position[0])
		for (var i = 0; i < position.length ; i++) {
			var maxPos = this.getMinMaxPos(position[i])
			if (this.lastPenState != position[i].penState) this.gcodeStr += position[i].penState ? this.penDownCommand : this.penUpCommand
			this.gcodeStr += `${this.baseCommand} X${maxPos.x * this.revert} Y${maxPos.y * this.revert} \n` 
			this.lastPenState = position[i].penState
		}	
		this.backToZero()
		return this.gcodeStr
	}
	getMinMaxPos (pos) {
		var noNegative = {
			x: Math.max(pos.x, 0),
			y: Math.max(pos.y, 0)
		}
		return {
			x: Math.min(noNegative.x, this.maxSize.x),
			y: Math.min(noNegative.y, this.maxSize.y)
		}
	}
	travelToFirstPoint (pos) {
		var maxPos = this.getMinMaxPos(pos)
		this.gcodeStr += `${this.baseCommand} X${maxPos.x * this.revert} Y${maxPos.y * this.revert} \n` 
	}
	backToZero () {
		this.gcodeStr += this.penUpCommand
		this.gcodeStr += `${this.baseCommand} X0 Y0 \n` 
	}
	resetCommands() {
		this.gcodeStr = ''
	}
}
