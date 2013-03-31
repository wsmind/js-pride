precision highp float;

uniform float time;

uniform vec3 origin;
uniform float scale;
uniform float rainbowFactor;
uniform float spaceFactor;

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

void main(void)
{
	vec3 worldPosition = position + origin;
	//worldPosition.y += sin(worldPosition.x * worldPosition.z * 0.1) * exp(-mod(time, 1.0)) * 0.4;
	worldPosition.y += (exp(spaceFactor) - 1.0) * 60.0;
	//worldPosition.z += sin(worldPosition.y * 0.8) * spaceFactor * worldPosition.y * 0.4;
	worldPosition.y *= scale;
	gl_Position = viewProjectionMatrix * vec4(worldPosition, 1.0);
	
	vec3 viewPosition = (viewMatrix * vec4(worldPosition, 1.0)).xyz;
	vec3 viewSunDirection = (viewMatrix * vec4(sunDirection, 0.0)).xyz;
	
	interpolatedPosition = gl_Position.xyz;
	interpolatedNormal = normal;
	//interpolatedNormal.xz = rotation * interpolatedNormal.xz;
	
	// atmospheric scattering (cool fog)
	float distance = -viewPosition.z * 2000.0;
	float cosAngle = dot(normalize(viewPosition), viewSunDirection);
	extinction = exp(-distance * rayleighCoefficient);
	inScattering = skyColor(normalize(viewPosition), viewSunDirection) * (1.0 - extinction);
}

//! FRAGMENT
//! INCLUDE hatching.glsl

vec3 rainbow(float x)
{
	/*
		Target colors
		=============
		
		L  x   color
		0  0.0 vec4(1.0, 0.0, 0.0, 1.0);
		1  0.2 vec4(1.0, 0.5, 0.0, 1.0);
		2  0.4 vec4(1.0, 1.0, 0.0, 1.0);
		3  0.6 vec4(0.0, 0.5, 0.0, 1.0);
		4  0.8 vec4(0.0, 0.0, 1.0, 1.0);
		5  1.0 vec4(0.5, 0.0, 0.5, 1.0);
	*/
	
	float level = floor(x * 6.0);
	float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
	float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
	float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
	return vec3(r, g, b);
}

void main()
{
	vec3 N = normalize(interpolatedNormal);
	float luminance = max(dot(N, sunDirection), 0.0);
	luminance = luminance;// * crosshatch(interpolatedPosition.xy * 100.0, luminance);
	vec3 radiance = vec3(luminance, luminance, luminance);
	vec3 color = radiance * extinction + inScattering + rainbow(mod(scale, 1.0)) * rainbowFactor;
	//vec3 color = extinction;
	gl_FragColor = vec4(color, 1.0);
	//gl_FragColor = vec4(interpolatedPosition, 1.0);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
