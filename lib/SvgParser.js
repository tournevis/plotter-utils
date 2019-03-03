class SvgParser{
	constructor() {
		this.path = ''
		this.coords = []
		this.commands = []
		this.lastCoord = {}
		this.lastControlPoint = ''
		this.precision = 10
		this.scaleFactor = 1
		this.translatePoint = {
			x: 0,
			y: 0
		}
		this.regex = /([a-zA-Z])+\s?((?:[0-9-+.,]+\s?)*)/g
	}
	parse(path) {
		this.coords = []
		this.commands = []
		this.path = path
		this.execRegex()
		return this.commands
	}
	compute (commands) {
		var cmdArray = commands || this.commands
		for (var i = 0; i < cmdArray.length ; i++) {
			var command = cmdArray[i]
			switch (command.type.toUpperCase()) {
					case 'L':
					case 'H':
					case 'M':
					case 'V':
						this.moveTo(command.type, command)
						break;
					case 'C':
						this.cubicTo(command.type, command)
						break;
					case 'S':
						this.cubicShortHandTo(command.type, command)
						break;
					case 'Q':
						var mapCoord = this.formatCoord(coord, type)
						this.quadraticTo(type, mapCoord)
						break;
					case 'T':
						var mapCoord = this.formatCoord(coord, type)
						this.quadraticShortHandTo(type, mapCoord)
						break;
					case 'Z':
						this.backToZero()
						break;
					default:
						debugger
						break;
				}
		}
		return this.coords
	}

	execRegex() {
		let result
		let prev
		while (( result = this.regex.exec(this.path)) !== null) {
			let type = result[1]
			let coord = result[2]
			let endline = result[3]
			this.commands.push(this.formatCommand(coord, type))
			
		}
		return this.commands //this.pathElements.join(this.endLine())
	}
	formatCommand (str, type) {
		var coord = str.match(/-?\d*(\.\d+)?/g).filter(function(n){ return n != '' })
		if (type.toUpperCase() === 'H') coord.push(0)
		else if (type.toUpperCase() === 'V') coord.unshift(0) 
		var obj = {
			type: type,
			draw: true, 
			isRelative: type !== type.toUpperCase(),
			x: (parseFloat(coord[0]) * this.scaleFactor) + this.translatePoint.x,
			y: (parseFloat(coord[1]) * this.scaleFactor) + this.translatePoint.y
		}
		if ( type.toUpperCase() === 'Z') obj = { type: type, isRelative: type !== type.toUpperCase()}
		if ( type.toUpperCase() === 'M') obj.draw = false
		for (var i = 2 ; i < coord.length - 1 ; i += 2) {
			obj['x' + i/2] = (parseFloat(coord[i]) * this.scaleFactor) + this.translatePoint.x
			obj['y' + i/2] = (parseFloat(coord[i + 1]) * this.scaleFactor) + this.translatePoint.y
		}
		return obj
	}
	getRelativeCoord (coords) {
		var last = this.getLastCoord()
		return {
				x: last.x + coords.x,
				y: last.y + coords.y
			}
	}
	moveTo (type, coord) {
		var mapCoord = coord.isRelative ? coord : this.getRelativeCoord(coord)
		var obj = {
			x: mapCoord.x,
			y: mapCoord.y
		}
		this.coords.push(obj)
	}
	cubicTo (type, coord) {
		var lastCoord = this.getLastCoord()
		var ctrl1 = {
			x: coord.x,
			y: coord.y
		}
		var ctrl2 = {
			x: coord.x1,
			y: coord.y1
		}
		var ctrl3 = {
			x: coord.x2,
			y: coord.y2
		}
		for (var i = 0; i <= 1; i += 1 / this.precision) {
			this.coords.push(this.getCubicBezierXYatPercent(lastCoord, ctrl1, ctrl2, ctrl3 ,i))
		}
		this.lastControlPoint = ctrl2
	}
	cubicShortHandTo (type, coord) {
		var lastCoord = this.getLastCoord()
		var mirrorControlPoint = this.getLastControlPoint()
		var ctrl1 = {
			x: coord.x,
			y: coord.y
		}
		var ctrl2 = {
			x: coord.x1,
			y: coord.y1
		}
		for (var i = 0; i <= 1; i += 1 / this.precision) {
			this.coords.push(this.getCubicBezierXYatPercent(lastCoord, mirrorControlPoint, ctrl1, ctrl2 ,i))
		}
		this.lastControlPoint = ctrl1
	}
	quadraticTo (type, coord) {
		var lastCoord = this.getLastCoord()
		for (var i = 0; i <= 1; i += 1 / this.precision) {
			this.coords.push(this.getQuadraticBezierXYatPercent(lastCoord, coord[0], coord[1] ,i))
		}
		this.lastControlPoint = coord[0]
	}
	quadraticShortHandTo (type, coord) {
		var lastCoord = this.getLastCoord()
		var mirrorControlPoint = this.getLastControlPoint()
		for (var i = 0; i <= 1; i += 1 / this.precision) {
			this.coords.push(this.getQuadraticBezierXYatPercent(lastCoord, mirrorControlPoint, coord[0] ,i))
		}
		this.lastControlPoint = coord[0]
	} 
	getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
		var x = this.CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
		var y = this.CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
		return ({
	        x: x,
	        y: y
	    });
	}
	getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
	    var x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
	    var y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
	    return ({
	        x: x,
	        y: y
	    });
	}
	CubicN(pct, a, b, c, d) {
	    var t2 = pct * pct;
	    var t3 = t2 * pct;
	    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
	}
	map () {

	}
	default () {

	}

	parseAndRound(value) {
		if (typeof value === 'number') return value
		let f = parseFloat(value)
		return Number(Math.round((f / 2 )+'e'+3)+'e-'+3)
	}

	penUp () {
		return 'S0 M5'
	}
	penDown () {
		return 'S1000 M3'
	}
	endLine () {
		return '\n'
	}
	getLastCoord () {
		let c =  this.coords[this.coords.length - 1]
		return c || {x: 0, y: 0}
	}
	getLastControlPoint () {
		let lastCoord = this.getLastCoord()
		return{
			x: (2 * lastCoord.x) - this.lastControlPoint.x,
			y: (2 * lastCoord.y) - this.lastControlPoint.y
		}
	}
	backToZero() {
	}

}
module.exports = SvgParser;