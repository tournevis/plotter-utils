import { drawPath, createCanvas, download } from '@/canvas.utils.js'
import Circle from '@/geometry/Circle'
import Box from '@/geometry/Box'
import { createButton } from '@/controls'
import Gcode from '@/Gcode.js'
import { noise } from '@/noise.js'
var canvas, ctx
// this should be you plotter max width and height
const CANVAS_SIZE = { //A5 
	width: 148,
	height: 210
}
document.addEventListener('DOMContentLoaded', function () {
	canvas = createCanvas(CANVAS_SIZE, 2.5)
	ctx = canvas.getContext('2d')
	setup()
})

function setup () {
	var c = new Circle(148/2 , 210/2, 20)
	drawPath(ctx, c.positions)

	var b = new Box(148/2 , 210/2, 20, 20)
	drawPath(ctx, b.positions)
}