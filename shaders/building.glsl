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
	float c = cos(time * 0.4);
	float s = sin(time * 0.4);
	mat2 rotation = mat2(c, -s, s, c);
	
	float c2 = cos(angle);
	float s2 = sin(angle);
	mat2 rotation2 = mat2(c2, -s2, s2, c2);
	
	vec3 rotatedPos = position;
	rotatedPos.xz = rotation2 * rotatedPos.xz;
	gl_Position = viewProjectionMatrix * vec4(rotatedPos + origin, 1.0);
	//gl_Position.w = -gl_Position.z + 3.0;
	/*gl_Position.xz = rotation * gl_Position.xz;
	gl_Position.z -= 4.0;
	gl_Position.x /= ratio;
	gl_Position.y += sin(gl_Position.x + time * 0.2) * 0.1 - 0.5;
	gl_Position.w = -gl_Position.z + 3.0;*/
	
	//gl_Position = viewProjectionMatrix * vec4(position, 1.0);
	
	interpolatedPosition = gl_Position.xyz;
	interpolatedNormal = normal;
	interpolatedNormal.xz = rotation2 * interpolatedNormal.xz;
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
