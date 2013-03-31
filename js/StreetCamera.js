"use strict";

function StreetCamera(options)
{
	this.speed = options.speed || 3.0
}

StreetCamera.prototype.render = function(time, renderParameters)
{
	renderParameters.camera.origin = [0, 2, 5 - time * this.speed]
	//renderParameters.camera.target = [0, 0, 0]
	renderParameters.camera.target = [0, 2, -time * this.speed]
	
	if (window.streets)
	{
		for (var i = 0; i < window.streets.length; i++)
		{
			var street = window.streets[i]
			if (time >= street.time)
			{
				if (i < window.streets.length - 1)
				{
					var nextStreet = window.streets[i + 1]
					var pos = vec2.create()
					
					var t = (time - street.time) / (nextStreet.time - street.time)
					var coeff = Math.sqrt(1 - t) * (1.0 + Math.sin(time)) * 0.8
					vec2.lerp(pos, street.position, nextStreet.position, t)
					vec2.add(pos, pos, [-nextStreet.direction[0] * coeff, -nextStreet.direction[1] * coeff])
					
					var up = renderParameters.camera.up
					vec2.add(up, up, [Math.cos(time * 0.1) * 0.4, 0.0, Math.sin(time * 0.1) * 0.4])
					vec2.normalize(up, up)
					renderParameters.camera.up = up
					
					renderParameters.camera.origin = [pos[0], 2, pos[1]]
					renderParameters.camera.target = [nextStreet.position[0], 2, nextStreet.position[1]]
				}
			}
		}
	}
}
