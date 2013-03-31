"use strict";

function GreetsCamera(options)
{
	this.radius = options.radius || 4.0
	this.speed = options.speed || 0.4
}

GreetsCamera.prototype.render = function(time, renderParameters)
{
	var speed = this.speed
	var ref = 96
	if (time > ref)
	{
		var f = time - ref
		//speed *= Math.exp(-f * 0.1)
		time = ref + f * Math.exp(-f * 0.1)
	}
	var radius = this.radius * (1.0 + Math.sin(time * speed) * 0.4)
	renderParameters.camera.origin = [this.radius * Math.cos(time * speed), time * speed, this.radius * Math.sin(time * speed)]
	renderParameters.camera.target = [0, time * speed + Math.cos(time * speed) * 2.0, 0]
}
