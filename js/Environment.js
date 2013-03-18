"use strict";

function Environment(options)
{
	this.initialTime = options.initialTime || 12
	this.speed = options.speed || 0
}

Environment.prototype.render = function(time, renderParameters)
{
	// compute sun direction based on time of day
	var currentTime = this.initialTime + time * this.speed
	var currentPhase = currentTime * Math.PI / 12 // half a cycle every 12 hours
	var sun = vec3.clone([Math.sin(currentPhase), -Math.cos(currentPhase), 0.0])
	vec3.normalize(sun, sun)
	renderParameters.sunDirection = sun
}
