precision highp float;

uniform float time;

uniform vec3 origin;
uniform float scale;
uniform float rainbowFactor;
uniform float spaceFactor;

uniform mat4 viewMatrix;
uniform mat4 viewProjectionMatrix;
uniform vec3 sunDirection;

varying vec3 fragNormal;

//! VERTEX

attribute vec3 position;
attribute vec3 normal;

void main(void)
{
	vec3 worldPosition = position + normal * 1.2;
	gl_Position = viewProjectionMatrix * vec4(worldPosition, 1.0);
	fragNormal = normal;
}

//! FRAGMENT

void main()
{
	vec3 color = vec3(0.0, pow(1.0 - abs(fragNormal.y), 2.0) * 0.8 * sin(time * time), 0.0);
	gl_FragColor = vec4(color, 1.0);
}
