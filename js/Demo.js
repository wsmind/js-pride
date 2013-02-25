"use strict";

function Demo()
{
	// load sound
	this.audio = new Audio()
	this.audio.src = "../music/LukHash_-_PRELUDE.mp3"
	this.audio.volume = 0
	
	this.audio.play()
	
	this.background = new Background()
	this.rainbow = new Rainbow()
	this.wire = new WireModel(eiffelMeshBuffer)
}

Demo.prototype.update = function(time)
{
	if ((!this.refTime) && (time != 0))
		this.refTime = time
	
	var demoTime = this.audio.currentTime
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clearDepth(1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	
	this.background.render(demoTime)
	this.rainbow.render(demoTime)
	this.wire.render(demoTime)
}
