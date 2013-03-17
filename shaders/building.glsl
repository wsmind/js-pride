precision highp float;

uniform float time;
uniform float ratio;

uniform vec3 origin;
uniform float angle;

uniform mat4 viewMatrix;
uniform mat4 viewProjectionMatrix;

varying vec3 interpolatedPosition;
varying vec3 interpolatedNormal;

varying vec3 extinction;
varying vec3 inScattering;
varying vec3 sunDirection;

//! VERTEX
attribute vec3 position;
attribute vec3 normal;

// source: http://www.scratchapixel.com/lessons/3d-advanced-lessons/simulating-the-colors-of-the-sky/atmospheric-scattering/
// scaled by 10^5 for precision
vec3 rayleighCoefficient = vec3(0.58, 1.35, 3.31);

vec3 rayleighScattering(float cosAngle)
{
	return 3.0 / (16.0 * 3.1415) * (1.0 + cosAngle * cosAngle) * rayleighCoefficient;
}

void main(void)
{
	float c = cos(angle);
	float s = sin(angle);
	mat2 rotation = mat2(c, -s, s, c);
	
	vec3 rotatedPos = position;
	rotatedPos.xz = rotation * rotatedPos.xz;
	gl_Position = viewProjectionMatrix * vec4(rotatedPos + origin, 1.0);
	
	vec3 viewPosition = (viewMatrix * vec4(rotatedPos + origin, 1.0)).xyz;
	//vec3 cameraPosition = (viewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
	
	interpolatedPosition = gl_Position.xyz;
	interpolatedNormal = normal;
	interpolatedNormal.xz = rotation * interpolatedNormal.xz;
	
	// atmospheric scattering (cool fog)
	sunDirection = normalize(vec3(1.0, sin(time * 0.1) + 1.0, 1.0));
	vec3 sunColor = vec3(10.0, 10.0, 10.0);
	float distance = -viewPosition.z * 0.01;
	float cosAngle = dot(normalize(vec3(0.0, 0.0, 1.0)), sunDirection);
	vec3 rayleighFactor = rayleighScattering(cosAngle);
	extinction = exp(-distance * rayleighCoefficient);
	inScattering = sunColor * rayleighFactor / rayleighCoefficient * (vec3(1.0, 1.0, 1.0) - extinction);
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
