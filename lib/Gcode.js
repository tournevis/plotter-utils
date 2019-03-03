export default class Gcode {
	constructor ( maxSize, revert) {
		this.maxSize = maxSize || {x: 200, y: 287}
		this.revert = revert ? -1 : 1
		this.lastPenState = false
		this.penDownCommand = 'S1000 M3 \n'
		this.penUpCommand = 'S0 M5 \n'
	}
	initPlotter () {
		// unit in mm
		var gcodeStr = 'G21\n'

		// Movement Speed
		gcodeStr += 'F5000\n'

		//Servo mode
		gcodeStr += 'E2 A1\n'
		return gcodeStr
	}
	generate (position) {
		var gcodeStr = this.initPlotter()
		var baseCommand = 'G01'

		for (var i = 0; i < position.length ; i++) {
			var maxPos = this.getMinMaxPos(position[i])
			if (this.lastPenState != position[i].draw) gcodeStr += position[i].draw ? this.penDownCommand : this.penUpCommand
			gcodeStr += `${baseCommand} X${maxPos.x * this.revert} Y${maxPos.y * this.revert} \n` 
			this.lastPenState = position[i].draw
		}	
		gcodeStr += 'S0 M5 \n'		
		return gcodeStr
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
}
