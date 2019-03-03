import { noise } from '@/noise.js'
import Gcode  from '@/Gcode.js'
const CANVAS_SIZE = {
	x: 200,
	y: 287
}
const viewScale = 2
const curveRes = 0.05
var expRadius = 0
var hideRand = 0
var noiseStrengh = 0.9
var circleRange = {
	min: 70,
	max: 85
}
var offset = {
	x: 0, //Math.random() -0.5,
	y: 0 //Math.random() -0.5
}
var canvas, seed = Math.random() * 1000
document.addEventListener('DOMContentLoaded', function () {
	document.body.style.background = "cream"
	createCanvas()
	setup()
})

var createCanvas = () => {
	canvas = document.createElement('canvas')
	canvas.width = CANVAS_SIZE.x * viewScale 
	canvas.height = CANVAS_SIZE.y * viewScale 
	let container = document.querySelector('#app')
	canvas.style.background = 'black';
	container.append(canvas)
}

var setup = () => {
	var getPoint = []
	for (var i = circleRange.min; i <= circleRange.max; i += 1) {
	 	getPoint.push(generate(Math.exp(i / 20)))

	 	expRadius += 0.1
	 } 
	console.log(getPoint)
	var ctx = canvas.getContext('2d')
	for (var i = getPoint.length - 1; i >= 0; i--) {

		hideRand = i
		drawPoint (ctx, getPoint[i])
	}
	var gcode = new Gcode(CANVAS_SIZE, true)
	var flatArray =  getPoint.flat()
	var commands = gcode.generate(flatArray)
	console.log(commands)
}



var generate = (base = 20) => {
	var positions = []
	var offsetMult = 0
	for(var i = 0; i < 2 * Math.PI ; i += curveRes) {
      	var radius = noise.perlin3(Math.cos(i) + 1, Math.sin(i) + 1, seed) * base * noiseStrengh + base
		var obj = {
			x: Math.cos(i) * radius + CANVAS_SIZE.x / 2 + base * offset.x,
			y:  CANVAS_SIZE.y / 2 - Math.sin(i) * radius + base * offset.y,
			draw: Math.random() * base < (circleRange.min / 2)
		}
		positions.push(obj)
	}
	positions.push({
		...positions[0]
	})
	positions.unshift({
		...positions[0],
		draw: false
	})
	positions.push({
		...positions[positions.length - 1],
		draw: false
	})
	return positions
}

var drawPoint = (ctx, position) => {
  	ctx.beginPath();
	ctx.moveTo(position[0].x * viewScale, position[0].y * viewScale);
	ctx.strokeStyle = "#FFFFFF";
	for(var i = 0; i < position.length; i ++) {
		position[i].draw
			?  ctx.lineTo(position[i].x * viewScale, position[i].y * viewScale)
			:  ctx.moveTo(position[i].x * viewScale, position[i].y * viewScale)
	}

	ctx.closePath();
	ctx.stroke()

}