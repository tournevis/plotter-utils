var svg = require('./SvgParser.js')
var path = 'M 100 100 L 300 80 l-100,100h200v-40 M 100 10 C 50 20, 20 50, 10 100 C 20 50, 150 20, 100 10 S 150 150, 180 80 S 250 100, 80 30v12'
console.log(svg)
var s = new svg()
var res = s.parse(path)
console.log(res)