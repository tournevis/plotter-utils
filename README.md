# Plotter utils 🐝 !
Welcome to My plotter lib. Here you will find multiples tools to parse svg path, generate gcode and more. 
Every tools is located in the `lib/` folder and you can find a doc for each one right above. 
This is an early work and still a work in project, be carefull using it ! 

I Own an Eleksdraw plotter, at the moment this is the only machin i have access. 
## Install 

To install dependencies and run the exemple project 
```shell
npm install 
npm run dev -- --env.project=exemple
```

To create a new project, just create a new folder with a `index.js` at his root.
Then run the commands `npm run dev -- --env.project=FOLDER_NAME`, this will watch our new js file.
I recommand to use a dev server aside to serve index.html, this is the simplest way you can do it: `python -m SimpleHTTPServer 8080`

### First Sketch 
Take a look at the exemple project located in `src/exemple/`. This project generate a simple circle

### Gcode.js

Generate gcodes commands from an array of points. First, you need to configure it ( config above for an eleksdraw plotter);
```json
 {
	"maxSize": {
		"x": 200,
		"y": 287
	},
	"revert": true,
	"unit": "G21",
	"penDownCommand": "S1000 M5",
	"penUpCommand": "S0 M5",
	"baseCommand": "G01"
}
```

How to use it : 
```javascript
const gcode = new Gcode(config)
var gcodeCommands = gcode.generate(path)
console.log(gcodeCommands) 
```

More stuff comming soon, stayed tuned ! 

