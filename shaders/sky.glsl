precision highp float;

uniform float time;
uniform vec2 resolution;
uniform mat4 viewMatrix;
uniform vec3 sunDirection;

//! VERTEX
attribute vec2 position;

void main(void)
{
	gl_Position = vec4(position, 0.0, 1.0);
}

//! FRAGMENT

// source: http://http.developer.nvidia.com/GPUGems2/gpugems2_chapter16.html
float phase(float cosAngle, float g)
{
	return 3.0 * (1.0 - g * g) / (2.0 * (2.0 + g * g)) * (1.0 + cosAngle * cosAngle) / pow(1.0 + g * g - 2.0 * g * cosAngle, 1.5);
}

// source: http://www.scratchapixel.com/lessons/3d-advanced-lessons/simulating-the-colors-of-the-sky/atmospheric-scattering/
// scattering at sea level, for wavelengths 680 (red), 550 (green) and 440 (blue)
// expressed per meter(m-1)
vec3 rayleighCoefficient = vec3(5.8e-6, 13.5e-6, 33.1e-6);

// scaled by 10^5 for precision
//vec3 rayleighCoefficient = vec3(0.58, 1.35, 3.31);

// probability that scattering changes the direction of the photon of the given angle
// per meter and steradian (m-1sr-1)
float rayleighPhase(float cosAngle)
{
	return 3.0 / (16.0 * 3.1415) * (1.0 + cosAngle * cosAngle);
}

vec3 rayleighScattering(float cosAngle)
{
	return 3.0 / (16.0 * 3.1415) * (1.0 + cosAngle * cosAngle) * rayleighCoefficient;
}

float distanceToUnitSphere(vec3 pos, vec3 dir)
{
	// solve pos + k*dir = unit sphere surface
	// dot(pos + k*dir, pos + k*dir) = 1
	
	// quadratic coefficients
	float a = dot(dir, dir);
	float b = 2.0 * dot(pos, dir);
	float c = dot(pos, pos) - 1.0;
	float discriminant = b * b - 4.0 * a * c;
	
	// only the positive root is useful, the position is guaranteed to be inside the sphere
	return (-b + sqrt(discriminant)) / (2.0 * a);
}

void main(void)
{
	//vec3 pos = vec3(mouse.x - res.x * 0.5, mouse.y - res.y * 0.5, 0.0) * 0.1;
	//vec3 pos = vec3(cos(time * 0.7) * 5.0, sin(time * 0.4) * 10.0 + 12.0, 0.0);
	//vec3 pos = vec3(0.0, 0.0, 0.0);
	vec3 dir = normalize(vec3((gl_FragCoord.x - resolution.x * 0.5) / resolution.y, gl_FragCoord.y / resolution.y - 0.5, -1.0));
	//pos = -(viewMatrix * vec4(pos, 1.0)).xyz * 5.0;
	dir = -(viewMatrix * vec4(dir, 0.0)).xyz;
	dir.y = -dir.y;
	
	vec3 outColor;
	
	// atmospheric scattering (cool fog)
	//vec3 sunDirection = normalize(vec3(cos(time * 0.1), sin(-time * 0.4), cos(time * 0.4)));
	vec3 sunColor = vec3(10.0, 10.0, 10.0);
	float distance = distanceToUnitSphere(vec3(0.0, 0.9, 0.0), dir);
	
	//vec3 inScattering = rayleighPhase(dot(sunDirection, dir)) * (1.0 - exp(-distance * 600000.0 * rayleighCoefficient));
	//outColor = inScattering * sunColor;// * exp(-distance * 600000.0 * rayleighCoefficient);
	
	outColor = vec3(0.0, 0.0, 0.0);
	float opticalDepth = 1.0;
	const int stepCount = 20;
	const float scaleHeight = 8000.0;
	const float step = 1.0 / float(stepCount);
	float s = 0.0;
	for (int i = 0; i < stepCount; i++)
	{
		s += step;
		vec3 position = vec3(0.0, 0.9, 0.0) + s * distance * dir;
		float realDistanceToViewPoint = s * distance * 600000.0; // map 0.1 from the unit sphere to 60km of atmosphere
		float altitude = (length(position) - 0.9) * 600000.0; // in [0-60km]
		opticalDepth += exp(-altitude / scaleHeight);
		float depth = distanceToUnitSphere(position, sunDirection) * 600000.0;
		vec3 extinction = exp(-depth * rayleighCoefficient);
		vec3 extinction2 = exp(-realDistanceToViewPoint * 0.15 * rayleighCoefficient);
		//outColor = vec3(opticalDepth, 0.0, 0.0) * 0.1;
		outColor += extinction2 * extinction * rayleighCoefficient * step * distance * 600000.0;
	}
	float cosAngle = dot(sunDirection, dir);
	//vec3 rayleighFactor = rayleighScattering(cosAngle);
	outColor *= sunColor * rayleighPhase(cosAngle);
	
	//outColor = sunColor * distance * 0.1;
	
	vec3 sun = pow(max(cosAngle, 0.0), 400.0) * vec3(1.0, 1.0, 1.0);
	outColor += sun;
	
	gl_FragColor = vec4(outColor, 1.0);
	//gl_FragColor = vec4(randomVec3(time * 0.01), 1.0);
}
