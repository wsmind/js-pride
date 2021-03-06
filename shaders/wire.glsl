precision highp float;

uniform float time;
uniform float ratio;

varying vec3 interpolatedNormal;

//! VERTEX
attribute vec3 position;
attribute vec3 normal;

void main(void)
{
	float c = cos(time);
	float s = sin(time);
	mat2 rotation = mat2(c, -s, s, c);
	
	gl_Position = vec4(position.xzy * 0.01, 1.0);
	gl_Position.xz = rotation * gl_Position.xz;
	gl_Position.x /= ratio;
	gl_Position.y += sin(gl_Position.x + time * 5.0) * 0.2 - 2.0;
	gl_Position.w = gl_Position.z  + 5.0;
	
	interpolatedNormal = normal;
}

//! FRAGMENT

void main()
{
	gl_FragColor = vec4(1.0, 1.0, interpolatedNormal.z, 1.0);
}
