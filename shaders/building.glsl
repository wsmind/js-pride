precision highp float;

uniform float time;

uniform vec3 origin;
//uniform float angle;

uniform mat4 viewMatrix;
uniform mat4 viewProjectionMatrix;
uniform vec3 sunDirection;

varying vec3 interpolatedPosition;
varying vec3 interpolatedNormal;

varying vec3 extinction;
varying vec3 inScattering;

//! VERTEX
//! INCLUDE skycolor.glsl

attribute vec3 position;
attribute vec3 normal;

// source: http://www.scratchapixel.com/lessons/3d-advanced-lessons/simulating-the-colors-of-the-sky/atmospheric-scattering/
// scaled by 10^5 for precision
//vec3 rayleighCoefficient = vec3(0.58, 1.35, 3.31);

void main(void)
{
	vec3 worldPosition = position + origin;
	worldPosition.y += sin(worldPosition.x * worldPosition.z * 0.1) * exp(-mod(time, 1.0)) * 0.4;
	gl_Position = viewProjectionMatrix * vec4(worldPosition, 1.0);
	
	vec3 viewPosition = (viewMatrix * vec4(worldPosition, 1.0)).xyz;
	vec3 viewSunDirection = (viewMatrix * vec4(sunDirection, 0.0)).xyz;
	
	//interpolatedPosition = gl_Position.xyz;
	interpolatedNormal = normal;
	//interpolatedNormal.xz = rotation * interpolatedNormal.xz;
	
	// atmospheric scattering (cool fog)
	float distance = -viewPosition.z * 5000.0;
	float cosAngle = dot(normalize(viewPosition), viewSunDirection);
	extinction = exp(-distance * rayleighCoefficient);
	inScattering = skyColor(normalize(viewPosition), viewSunDirection) * (1.0 - extinction);
}

//! FRAGMENT

void main()
{
	vec3 N = normalize(interpolatedNormal);
	float luminance = max(dot(N, sunDirection), 0.0);
	vec3 radiance = vec3(luminance, luminance, luminance);
	vec3 color = radiance * extinction + inScattering;
	//vec3 color = extinction;
	gl_FragColor = vec4(color, 1.0);
	//gl_FragColor = vec4(interpolatedPosition, 1.0);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
