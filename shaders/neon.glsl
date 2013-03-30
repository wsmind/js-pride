precision highp float;

uniform float time;

uniform vec3 origin;
uniform float scale;
uniform float rainbowFactor;
uniform float spaceFactor;

uniform mat4 viewMatrix;
uniform mat4 viewProjectionMatrix;
uniform vec3 sunDirection;
//uniform vec3 cameraZ;

varying vec3 fragNormal;
varying vec3 fragTangent;

//! VERTEX

attribute vec3 position;
//attribute vec3 normal;
attribute vec3 tangent;

void main(void)
{
	//vec3 cameraZ = (viewMatrix * vec4(0.0, 0.0, -1.0, 0.0)).xyz;
	vec3 cameraZ = vec3(0.0, 0.0, 1.0);
	vec3 normal = cross(cameraZ, tangent);
	vec3 worldPosition = origin + position + normal * 0.06;// * exp(-mod(time, 1.0)) * 0.2;
	gl_Position = viewProjectionMatrix * vec4(worldPosition, 1.0);
	fragNormal = normal;
	fragTangent = tangent * 0.5 + 0.5;
}

//! FRAGMENT

void main()
{
	vec3 color = normalize(fragTangent * 2.0 - 1.0) * 0.5 + 0.5;//vec3(0.0, pow(1.0 - abs(fragNormal.y), 4.0) * 0.8 /** sin(time * time)*/, 0.0);
	gl_FragColor = vec4(color, 1.0);
}
