precision highp float;

//uniform mat4 mvp;
uniform float time;

varying float factor;

//! VERTEX
attribute vec2 pos;

void main(void)
{
	factor = -pos.y * 0.5 + 0.5;
	gl_Position = vec4(pos * vec2(1.0, sin(pos.x * 0.8) * 0.2 + 0.2), 0.0, 1.0);
	//gl_Position = vec4(pos * vec2(1.0, sin(time) * 0.1 + sin(pos.x * 2.0) * 0.2 + 0.2), 0.0, 1.0);
	gl_Position.y += sin(time + pos.x) * 0.4;
}

//! FRAGMENT
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
	gl_FragColor = vec4(rainbow(factor), 1.0);
}
