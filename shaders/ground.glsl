precision highp float;

uniform float time;
uniform vec2 resolution;
uniform mat4 viewMatrix;
uniform mat4 viewProjectionMatrix;
uniform vec3 sunDirection;
uniform float stride;

varying vec3 viewPosition;
varying vec3 viewSunDirection;

//! VERTEX

//attribute vec2 position;
attribute float gridIndex;

void main(void)
{
	vec3 worldPosition = vec3(mod(gridIndex, stride), 0.0, floor(gridIndex / stride)) - 20.0;
	//vec3 worldPosition = vec3(position.x, 0.0, position.y) * 100.0;
	gl_Position = viewProjectionMatrix * vec4(worldPosition, 1.0);
	
	viewPosition = (viewMatrix * vec4(worldPosition, 1.0)).xyz;
	viewSunDirection = (viewMatrix * vec4(sunDirection, 0.0)).xyz;
}

//! FRAGMENT
//! INCLUDE skycolor.glsl

void main(void)
{
	vec3 sun = normalize(viewSunDirection);
	
	// atmospheric scattering (cool fog)
	float distance = -viewPosition.z * 5000.0;
	float cosAngle = dot(normalize(viewPosition), sun);
	vec3 extinction = exp(-distance * rayleighCoefficient);
	vec3 inScattering = skyColor(normalize(viewPosition), sun) * (1.0 - extinction);
	
	float luminance = max(sunDirection.y, 0.0);
	vec3 radiance = vec3(luminance, luminance, luminance);
	//vec3 color = radiance * extinction + inScattering;
	
	vec3 color = vec3(0.0, 1.0, 0.0);
	gl_FragColor = vec4(color, 1.0);
}
