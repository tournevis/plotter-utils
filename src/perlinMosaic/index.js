import { drawPath, createCanvas, download } from '@/canvas.utils.js'
import { createButton } from '@/controls'
import Gcode from '@/Gcode.js'
import { noise } from '@/noise.js'
var canvas
// this should be you plotter max width and height
const CANVAS_SIZE = { //A5 
	width: 148,
	height: 210
}

var commands, ctx
// this will scale the canvas render but NOT the generated coordonates
const viewScale = 3

const plotterConfig = {
	maxSize: CANVAS_SIZE,
	revert: true,
	unit: 'G21',
	penDownCommand: 'S1000 M3',
	penUpCommand: 'S0 M5',
	baseCommand: 'G01'
}

document.addEventListener('DOMContentLoaded', function () {
	document.body.style.background = "cream"  // WU TANG !
	canvas = createCanvas(CANVAS_SIZE, viewScale)
	ctx = canvas.getContext('2d')
	createButton('#generate', setup)
	createButton('#download', () => { download(commands) } )
	setup()
})

var setup = () => {
	var seed = Math.random() * 10000
	var positions = []
	var step = 10
	var noiseStrengh = 4
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var i = 0
	for (var y = CANVAS_SIZE.width -20; y >= 20; y -= step) {
		i += 1
		for (var x = CANVAS_SIZE.width-40; x >= 10; x -= step) {
			var radius = noise.perlin3(x /50, y /50, seed ) * noiseStrengh + 1.5
			var offset = i % 2 == 0 ? 5 : 0
			var obj = createShape(x + offset , y, radius)
			positions.push(obj)
		}
	}

	for (var i = positions.length - 1; i >= 0; i--) {
		drawPath(ctx, positions[i], viewScale)
	}
	var gcode = new Gcode(plotterConfig)
	var flatArray =  positions.flat()
	commands = gcode.generate(flatArray)
	//drawPath(ctx, path, viewScale)
}
var createShape = (x,y,radius) => {
	var curveRes = 70
	var positions = []
	for(var i = 0; i < 2 * Math.PI ; i +=(2 * Math.PI) / curveRes) {
		var obj = {
			x: Math.cos(i) * radius + x ,
			y:  y - Math.sin(i) * radius ,
			penState: 'down',
		}
		positions.push(obj)
	}
	return closeShape(positions)
}

var closeShape = (positions) => {
	positions.push({
		...positions[0]
	})
	positions.unshift({
		...positions[0],
		penState: 'up'
	})
	positions.push({
		...positions[positions.length - 1],
		penState: 'up'
	})
	return positions
}