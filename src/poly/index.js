import { drawPath, createCanvas, download } from '@/canvas.utils.js'
import config from 'config'
import Circle from '@/geometry/Circle'
import Box from '@/geometry/Box'
import { createButton } from '@/controls'
import Gcode from '@/Gcode.js'
import { noise } from '@/noise.js'
import clustering from 'density-clustering';
import convexHull from 'convex-hull';

var canvas, ctx, points
// this should be you plotter max width and height
var positions = []

document.addEventListener('DOMContentLoaded', function () {
	canvas = createCanvas(config.maxSize, 2.5)
	ctx = canvas.getContext('2d')
	setup()
})

function setup () {
	var c = new Circle(148/2 , 210/2, 20)
	//drawPath(ctx, c.positions)
	positions.push(c.positions)

	var b = new Box(148/2 , 210/2, 20, 20)
	//drawPath(ctx, b.positions)
	positions.push(b.positions)
	points = pointsFill()
	points.forEach(p => {
		var c = new Circle(p.x , p.y, 2)
		drawPath(ctx, c.positions)
	})
	var gcode = new Gcode(config)
	var flatArray =  positions.flat()
	var commands = gcode.generate(flatArray)
	update()
	createButton('#download', () => {download(commands)})
}

function pointsFill () {
	const pointCount = 30000;
	return new Array(pointCount).fill(undefined).map(() => {
    	const margin = 20;
    	return [
     		Math.random() * (config.maxSize.width * 2.5 - margin*2) + margin,
      		Math.random() * (config.maxSize.width * 2.5 - margin*2) + margin
    	]
  	})

}
function update () {
	if (points.length <= 2) return;

	 // k-means cluster our data
	 const scan = new clustering.KMEANS();
	 const clusters = scan.run(points, 3).filter(c => c.length >= 3);
	  // Ensure we resulted in some clusters
	  if (clusters.length === 0) return;
	  // Sort clusters by density
	  clusters.sort((a, b) => a.length - b.length);
	  // Select the least dense cluster
	  const cluster = clusters[0];
	  const positions = cluster.map(i => points[i]);
	  const edges = convexHull(positions);

	  // Ensure the hull is large enough
	  if (edges.length <= 2) return;

	  // Create a closed polyline from the hull
	  let path = edges.map(c => positions[c[0]]);
	  path.push(path[0]);
	  console.log(path)
	  // Add to total list of polylines
	  //lines.push(path);

	  	ctx.beginPath();
		ctx.moveTo(path[0][0], path[0][1])
		for (var i = path.length - 1; i >= 0; i--) {
		  	ctx.lineTo(path[i][0], path[i][1])
		 }
	  	ctx.stroke();
  		ctx.closePath();
	  // Remove those points from our data set
	  points = points.filter(p => !positions.includes(p));

		
		window.requestAnimationFrame(update)
}