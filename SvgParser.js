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
			x: 1 * this.scaleFactor,
			y: 1 * this.scaleFactor
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

	execRegex() {
		let result
		let prev
		while (( result = this.regex.exec(this.path)) !== null) {
			let type = result[1]
			let coord = result[2]
			let endline = result[3]
			var command = this.formatCommand(coord, type)
			
		}
		return this.commands //this.pathElements.join(this.endLine())
	}
	formatCommand (str, type) {
		var coord = str.match(/-?\d*(\.\d+)?/g).filter(function(n){ return n != '' })
		var last = this.getLastCoord()
		if (type === 'H') coord.push(last.y)
		else if (type === 'V') coord.unshift(last.x)
		else if (type === 'h') coord.push(0)
		else if (type === 'v') coord.unshift(0)
		for (var i = 0 ; i < coord.length - 1 ; i+=2) {
			this.commands.push({
				x: (parseFloat(coord[i]) * this.scaleFactor) + this.translatePoint.x,
				y: (parseFloat(coord[i + 1]) * this.scaleFactor) + this.translatePoint.y,
				type: type
			})
		}
		return this.commands
	}
	getRelativeCoord (coords) {
		var last = this.getLastCoord()
		for (var i = 0; i < coords.length ; i++) {
			coords[i] = {
				x: last.x + coords[i].x,
				y: last.y + coords[i].y
			}
		}
		return coords
	}
	moveTo (type, coord) {
		let isUpperCase = type === type.toUpperCase()
		if (typeof coord === 'object') coord = [coord]
		var mapCoord = isUpperCase ? coord[0] : this.getRelativeCoord(coord)[0]
		var obj = {
			type: type,
			position: isUpperCase ? 'absolute': 'relative',
			x: mapCoord.x,
			y: mapCoord.y
		}
		this.coords.push(obj)
	}
	moveFromTo(type, coord) {
		var mapCoord = coord[0]
		let isUpperCase = type === type.toUpperCase()
		mapCoord = this.getRelativeCoord(mapCoord)
		var obj = {
			type: type,
			position: isUpperCase ? 'absolute': 'relative',
			x: mapCoord.x,
			y: mapCoord.y
		}
		this.coords.push(obj)
	}
	cubicTo (type, coord, isAbsolute) {
		var lastCoord = this.getLastCoord()
		if (!isAbsolute) coord = this.getRelativeCoord(coord)
		for (var i = 0; i <= 1; i += 1 / this.precision) {
			this.coords.push(this.getCubicBezierXYatPercent(lastCoord, coord[0], coord[1], coord[2] ,i))
		}
		this.lastControlPoint = coord[1]
	}
	cubicShortHandTo (type, coord) {
		var lastCoord = this.getLastCoord()
		var mirrorControlPoint = this.getLastControlPoint()
		for (var i = 0; i <= 1; i += 1 / this.precision) {
			this.coords.push(this.getCubicBezierXYatPercent(lastCoord, mirrorControlPoint, coord[0], coord[1] ,i))
		}
		this.lastControlPoint = coord[0]
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
			type: 'C',
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
		this.commands.push(this.penUp())
		this.commands.push('X0 Y0')
	}

}
module.exports = SvgParser;