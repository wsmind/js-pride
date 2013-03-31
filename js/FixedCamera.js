"use strict";

function FixedCamera(options)
{
	this.origin = options.origin || [0, 0, 0]
	this.target = options.target || [0, 0, -1]
	this.fov = options.fov || Math.PI * 0.5
	this.shake = options.shake || 0
}

FixedCamera.prototype.render = function(time, renderParameters)
{
	renderParameters.camera.origin = this.origin
	renderParameters.camera.target = this.target
	var beat = time % 4
	var lastBeat = (beat > 3) ? beat - 3 : 0
	var lastStep = Math.floor(lastBeat * 2) / 2
	var rand = ((Math.floor(time) * 5987) % 40) / 40
	renderParameters.camera.fov = this.fov + (1.0 - Math.exp(-lastStep)) * this.shake * 0.2
	
	var up = renderParameters.camera.up
	up[0] = this.shake * lastStep * (rand - 0.5) * 3.0
	vec3.normalize(up, up)
	renderParameters.camera.up = up
}
