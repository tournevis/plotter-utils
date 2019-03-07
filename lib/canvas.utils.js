function  createCanvas (canvasSize, viewScale = 1) {
	canvasSize = canvasSize || {width: 200, height: 287}
	var canvas = document.createElement('canvas')
	canvas.width = canvasSize.width * viewScale 
	canvas.height = canvasSize.height * viewScale 
	let container = document.querySelector('#app')
	canvas.style.background = 'black'
	container.append(canvas)
	return canvas
}


function drawPath (ctx, position, viewScale = 1, color = '#FFFFFF') {
  	ctx.beginPath();
	ctx.moveTo(position[0].x * viewScale, position[0].y * viewScale)
	ctx.strokeStyle = color
	for(var i = 0; i < position.length; i ++) {
		position[i].penState === 'down'
			?  ctx.lineTo(position[i].x * viewScale, position[i].y * viewScale)
			:  ctx.moveTo(position[i].x * viewScale, position[i].y * viewScale)
	}

	ctx.stroke()
	ctx.closePath()
}

export { createCanvas, drawPath }
