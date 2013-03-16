precision highp float;

uniform float time;
uniform float ratio;

varying vec3 interpolatedNormal;

//! VERTEX
attribute vec3 position;
attribute vec3 normal;

void main(void)
{
	float c = cos(time * 0.4);
	float s = sin(time * 0.4);
	mat2 rotation = mat2(c, -s, s, c);
	
	gl_Position = vec4(position, 1.0);
	gl_Position.xz = rotation * gl_Position.xz;
	gl_Position.x /= ratio;
	gl_Position.y += sin(gl_Position.x + time * 0.2) * 0.1 - 0.5;
	gl_Position.w = gl_Position.z + 1.8;
	
	interpolatedNormal = normal;
}

//! FRAGMENT

void main()
{
	vec3 N = normalize(interpolatedNormal);
	float bref = max(dot(N, vec3(0.0, 0.707, 0.707)), 0.0);
	gl_FragColor = vec4(bref, bref, bref, 1.0);
}
