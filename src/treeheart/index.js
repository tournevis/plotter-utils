import { noise } from '@/noise.js'
import { createCanvas, drawPath } from '@/canvas.utils'
import { createButton } from '@/controls'
import Gcode  from '@/Gcode.js'
const CANVAS_SIZE = {
	width: 200,
	height: 287
}

const viewScale = 2
const curveRes = 0.05
var expRadius = 0
var hideRand = 0
var noiseStrengh = 0.9
var commands = []
var circleRange = {
	min: 70,
	max: 85
}
var offset = {
	x: 0, //Math.random() -0.5,
	y: 0 //Math.random() -0.5
}
var canvas, seed
document.addEventListener('DOMContentLoaded', function () {
	document.body.style.background = "cream"
	canvas = createCanvas(CANVAS_SIZE, viewScale)
	createButton('#generate', setup)
	createButton('#download', download)
	setup()
})

var setup = () => {
	var getPoint = []
	seed = Math.random() * 1000
	var ctx = canvas.getContext('2d')
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = circleRange.min; i <= circleRange.max; i += 1) {

	 	getPoint.push(generate(Math.exp(i / 20)))
	 	expRadius += 0.1
	 } 
	console.log(getPoint)
	for (var i = getPoint.length - 1; i >= 0; i--) {
		hideRand = i
		drawPath(ctx, getPoint[i], viewScale)
	}
	var gcode = new Gcode()
	var flatArray =  getPoint.flat()
	commands = gcode.generate(flatArray)
	console.log(commands)
}


var download = () => {
	let render = document.querySelector('.control-panel-container')
	let link = document.createElement('a')
	link.download = 'spiral.gcode'
	link.href = 'data:text/plain,' + commands
	link.click()
}
var generate = (base = 20) => {
	var positions = []
	var offsetMult = 0
	for(var i = 0; i < 2 * Math.PI ; i += curveRes) {
      	var radius = noise.perlin3(Math.cos(i) + 1, Math.sin(i) + 1, seed) * base * noiseStrengh + base
		var obj = {
			x: Math.cos(i) * radius + CANVAS_SIZE.width / 2 + base * offset.x,
			y:  CANVAS_SIZE.height / 2 - Math.sin(i) * radius + base * offset.y,
			penState: Math.random() * base < (circleRange.min / 2) ? 'down' : 'up'
		}
		positions.push(obj)
	}
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
