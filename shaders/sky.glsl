precision highp float;

uniform float time;
uniform vec2 resolution;
uniform mat4 viewMatrix;

//! VERTEX
attribute vec2 position;

void main(void)
{
	gl_Position = vec4(position, 0.0, 1.0);
}

//! FRAGMENT
const float infinity = 10000.0;
const vec3 skyColor = vec3(0.7, 0.9, 1.0);
const float fogDensity = 0.004;
const vec3 lightColor = vec3(0.5, 1.0, 0.9);

// inspired from WebGL path tracing demo
float random(float seed)
{
  return fract(sin(dot(gl_FragCoord.xyz * 0.01 + seed, vec3(3.9898, 7.233, 11.7182))) * 43758.5453 + seed);
}

vec3 randomVec3(float seed)
{
  return vec3(random(seed), random(seed + 0.15), random(seed - 0.87));
}

float plane(vec3 pos, vec4 eq)
{
  return dot(eq, vec4(pos, 1.0)) - sin(pos.x * 0.5 + time * 2.0) * sin(pos.z * 0.2 + time);
}

float spheres(vec3 pos, float r)
{
  return length(mod(pos, 20.0) - vec3(10.0, 10.0, 10.0)) - r;
}

float cube(vec3 pos)
{
	return length(max(abs(pos) - vec3(10.0, 10.0, 10.0), 0.0));
}

float map(vec3 pos)
{
	float f = sin(time * 0.1) * 0.004;
	float c = cos(pos.z * f);
	float s = sin(pos.z * f);
	mat2 rotation = mat2(c, -s, s, c);
	pos.xy = rotation * pos.xy;
	
	//return min(plane(pos, vec4(0.0, 1.0, 0.0, 0.0)), spheres(pos, (sin(time) * sin(time)) * 5.0 + 2.0));
	return cube(mod(pos - vec3(-5.0, 0.0, 50.0), 50.0) - vec3(25.0, 25.0, 25.0));
}

vec3 calcNormal(vec3 pos)
{
    float eps = 0.01;
    vec3 nor;
    nor.x = map( vec3(pos.x+eps, pos.y, pos.z)) - map( vec3(pos.x-eps, pos.y, pos.z));
    nor.y = map( vec3(pos.x, pos.y+eps, pos.z)) - map( vec3(pos.x, pos.y-eps, pos.z));
    nor.z = map( vec3(pos.x, pos.y, pos.z+eps)) - map( vec3(pos.x, pos.y, pos.z-eps));
    return normalize( nor );
}

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

vec3 calcColor(vec3 pos)
{
	vec3 q = floor(mod(pos * 0.4, 2.0)) * 2.0 - 1.0;
	float checker = q.x * q.y * q.z;
   float f1 = mod(pos.x, 10.0) > 5.0 ? 1.0 : -1.0;
   float f2 = mod(pos.z, 10.0) > 5.0 ? 1.0 : -1.0;
   //float checker = f1 * f2;
   return vec3(checker, checker, 1.0);
}

float calcOcclusion(vec3 pos, vec3 normal, float occlusionScale)
{
   float distance = occlusionScale;
   pos += normal * occlusionScale;
   for (int i = 0; i < 5; i++)
   {
      pos += normal;
      distance = min(distance, max(map(pos), 0.0));
   }
   return distance / occlusionScale;
}

vec3 traceRay(vec3 pos, vec3 dir)
{
   for (int i = 0; i < 40; i++)
   {
       float distance = map(pos);
       pos += 0.9 * distance * dir;
   }
   return pos;
}

// source: http://http.developer.nvidia.com/GPUGems2/gpugems2_chapter16.html
float phase(float cosAngle, float g)
{
	return 3.0 * (1.0 - g * g) / (2.0 * (2.0 + g * g)) * (1.0 + cosAngle * cosAngle) / pow(1.0 + g * g - 2.0 * g * cosAngle, 1.5);
}

// source: http://www.scratchapixel.com/lessons/3d-advanced-lessons/simulating-the-colors-of-the-sky/atmospheric-scattering/
// scaled by 10^5 for precision
vec3 rayleighCoefficient = vec3(0.58, 1.35, 3.31);

vec3 rayleighScattering(float cosAngle)
{
	return 3.0 / (16.0 * 3.1415) * (1.0 + cosAngle * cosAngle) * rayleighCoefficient;
}

float distanceToUnitSphere(vec3 pos, vec3 dir)
{
	return sqrt((1.0 - dot(pos, pos)) / dot(dir, dir));
}

float atmospheric_depth(vec3 position, vec3 dir){
    float a = dot(dir, dir);
    float b = 2.0*dot(dir, position);
    float c = dot(position, position)-1.0;
    float det = b*b-4.0*a*c;
    float detSqrt = sqrt(det);
    float q = (-b - detSqrt)/2.0;
    float t1 = c/q;
    return t1;
}

void main(void)
{
   //vec3 pos = vec3(mouse.x - res.x * 0.5, mouse.y - res.y * 0.5, 0.0) * 0.1;
   //vec3 pos = vec3(cos(time * 0.7) * 5.0, sin(time * 0.4) * 10.0 + 12.0, 0.0);
   vec3 pos = vec3(0.0, 0.0, 0.0);
   vec3 dir = normalize(vec3((gl_FragCoord.x - resolution.x * 0.5) / resolution.y, gl_FragCoord.y / resolution.y - 0.5, 1.0));
   pos = -(viewMatrix * vec4(pos, 1.0)).xyz * 5.0;
   dir = (viewMatrix * vec4(dir, 0.0)).xyz;
   
   vec3 outColor;
   vec3 point = traceRay(pos, dir);
   vec3 normal = calcNormal(point);
   //vec3 reflectPoint = traceRay(point, reflect(normal, dir));
   vec3 color = vec3(1.0, 1.0, 1.0); //calcColor(point);
   //vec3 reflectColor = calcColor(reflectPoint);
   float fogFactor = 1.0 - (1.0 / exp(point.z * fogDensity));
   //float reflectFogFactor = 1.0 - (1.0 / exp(length(reflectPoint - point) * fogDensity));
   //float occlusion = calcOcclusion(point, normal, 5.0);
   float diffuse = max(dot(normal, vec3(0.707, 0.707, 0.0)), 0.0);
   //outColor = mix(color * diffuse * occlusion + mix(reflectColor, skyColor, reflectFogFactor) * 0.2, skyColor, fogFactor);
   //outColor = mix(color * diffuse * occlusion + skyColor * reflectFogFactor * 0.3, skyColor, fogFactor);
   //outColor = mix(color * diffuse, rainbow(gl_FragCoord.y / resolution.y + sin(time + gl_FragCoord.x * 10.0 / resolution.x) * 0.1), fogFactor);
   
	// atmospheric scattering (cool fog)
	vec3 sunDirection = normalize(vec3(1.0, sin(time * 0.1) + 1.0, 1.0));
	vec3 sunColor = vec3(10.0, 10.0, 10.0);
	float cosAngle = dot(sunDirection, dir);
	float distance = atmospheric_depth(vec3(0.0, 0.9, 0.0), dir);// * 60000.0; // atmosphere is roughly 60km wide
	vec3 rayleighFactor = rayleighScattering(cosAngle);
	vec3 extinction = exp(-distance * rayleighCoefficient);
	vec3 inScattering = sunColor * rayleighFactor / rayleighCoefficient * (1.0 - extinction);
	outColor = inScattering;
	
	//vec3 sunColor = pow(max(cosAngle, 0.0), 3.0) * vec3(1.0, 1.0, 1.0);
	//outColor = vec3(distance, distance, distance);

	gl_FragColor = vec4(outColor, 1.0);
	//gl_FragColor = vec4(randomVec3(time * 0.01), 1.0);
}
