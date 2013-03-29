"use strict";

function StreetCamera(options)
{
	this.speed = options.speed || 0.4
}

StreetCamera.prototype.render = function(time, renderParameters)
{
	renderParameters.camera.origin = [0, 2, 5 - time * this.speed]
	renderParameters.camera.target = [0, 0, 0]
	//renderParameters.camera.target = [0, 1, -time * this.speed]
	renderParameters.camera.fov = Math.PI * 0.3
}
