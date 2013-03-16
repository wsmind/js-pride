precision highp float;

uniform float time;
uniform float ratio;

uniform vec3 origin;
uniform float angle;

uniform mat4 viewProjectionMatrix;

varying vec3 interpolatedPosition;
varying vec3 interpolatedNormal;

//! VERTEX
attribute vec3 position;
attribute vec3 normal;

void main(void)
{
	float c = cos(angle);
	float s = sin(angle);
	mat2 rotation = mat2(c, -s, s, c);
	
	vec3 rotatedPos = position;
	rotatedPos.xz = rotation * rotatedPos.xz;
	gl_Position = viewProjectionMatrix * vec4(rotatedPos + origin, 1.0);
	
	interpolatedPosition = gl_Position.xyz;
	interpolatedNormal = normal;
	interpolatedNormal.xz = rotation * interpolatedNormal.xz;
}

//! FRAGMENT

void main()
{
	vec3 N = normalize(interpolatedNormal);
	float luminance = max(dot(N, vec3(0.0, 0.707, 0.707)), 0.0);
	gl_FragColor = vec4(luminance, luminance, luminance, 1.0);
	//gl_FragColor = vec4(interpolatedPosition, 1.0);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
