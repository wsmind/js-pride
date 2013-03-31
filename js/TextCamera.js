"use strict";

function TextCamera(options)
{
	this.origin = options.origin || [0, 0, 0]
	this.target = options.target || [0, 0, -1]
	this.fov = options.fov || Math.PI * 0.5
}

TextCamera.prototype.render = function(time, renderParameters)
{
	renderParameters.camera.origin = this.origin
	renderParameters.camera.target = this.target
	renderParameters.camera.fov = this.fov
}
