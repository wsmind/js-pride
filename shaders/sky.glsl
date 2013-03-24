precision highp float;

uniform float time;
uniform vec2 resolution;
uniform mat4 viewMatrix;
uniform vec3 sunDirection;

//! VERTEX
attribute vec2 position;

void main(void)
{
	gl_Position = vec4(position, 1.0, 1.0);
}

//! FRAGMENT
//! INCLUDE skycolor.glsl

void main(void)
{
	//vec3 pos = vec3(mouse.x - res.x * 0.5, mouse.y - res.y * 0.5, 0.0) * 0.1;
	//vec3 pos = vec3(cos(time * 0.7) * 5.0, sin(time * 0.4) * 10.0 + 12.0, 0.0);
	//vec3 pos = vec3(0.0, 0.0, 0.0);
	vec3 dir = normalize(vec3((gl_FragCoord.x - resolution.x * 0.5) / resolution.y, gl_FragCoord.y / resolution.y - 0.5, -1.0));
	//pos = -(viewMatrix * vec4(pos, 1.0)).xyz * 5.0;
	dir = -(viewMatrix * vec4(dir, 0.0)).xyz;
	dir.y = -dir.y;
	
	vec3 color = skyColor(dir, sunDirection) + sunLight(dir, sunDirection);
	gl_FragColor = vec4(color, 1.0);
	//gl_FragColor = vec4(randomVec3(time * 0.01), 1.0);
}
