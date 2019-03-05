import { drawPath, createCanvas } from '@/canvas.utils.js'
import Gcode from '@/Gcode.js'


// this should be you plotter max width and height
const CANVAS_SIZE = {
	width: 200,
	height: 287
}

// this will scale the canvas render but NOT the generated coordonates
const viewScale = 2

const plotterConfig = {
	maxSize: CANVAS_SIZE,
	revert: true,
	unit: 'G21',
	penDownCommand: 'S1000 M5',
	penUpCommand: 'S0 M5',
	baseCommand: 'G01'
}
const gcode = new Gcode(CANVAS_SIZE)

var canvas
document.addEventListener('DOMContentLoaded', function () {
	document.body.style.background = "cream"
	canvas = createCanvas(CANVAS_SIZE, viewScale)
	var ctx = canvas.getContext('2d')
	var path = createPath() 
	drawPath(ctx, path, viewScale)
	
	console.log(gcode.generate(path))
})

var createPath = () => {
	var positions = []
	var radius = 80
	var curveRes = 0.1
	for(var i = 0; i < 2 * Math.PI ; i += curveRes) {
		var obj = {
			x: Math.cos(i) * radius,
			y: Math.sin(i) * radius,
			penState: 'down'
		}
		obj = center(obj)
		positions.push(obj)
	}
	return positions
}

var center = (pos) => {
	pos.x += CANVAS_SIZE.width / 2
	pos.y += CANVAS_SIZE.height / 2
	return pos
}

