"use strict";

function TextCamera(options)
{
	this.origin = options.origin || [0, 120, 3]
	this.target = options.target || [0, 1, 2]
	this.fov = options.fov || Math.PI * 0.16
}

TextCamera.prototype.render = function(time, renderParameters)
{
	var origin = vec3.clone(this.origin)
	var factor = Math.exp(-time)
	vec3.add(origin, origin, [Math.cos(time * 0.1) * 20 * factor, -100 * factor, Math.sin(time * 0.1) * 20 * factor])
	
	renderParameters.camera.origin = origin
	renderParameters.camera.target = this.target
	renderParameters.camera.fov = this.fov
}
