"use strict";

function GreetsCamera(options)
{
	this.radius = options.radius || 4.0
	this.speed = options.speed || 0.4
}

GreetsCamera.prototype.render = function(time, renderParameters)
{
	var radius = this.radius * (1.0 + Math.sin(time * this.speed) * 0.4)
	renderParameters.camera.origin = [this.radius * Math.cos(time * this.speed), time * this.speed, this.radius * Math.sin(time * this.speed)]
	renderParameters.camera.target = [0, time * this.speed + Math.cos(time * this.speed) * 2.0, 0]
}
