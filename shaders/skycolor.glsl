// source: http://www.scratchapixel.com/lessons/3d-advanced-lessons/simulating-the-colors-of-the-sky/atmospheric-scattering/
// scattering at sea level, for wavelengths 680 (red), 550 (green) and 440 (blue)
// expressed per meter(m-1)
vec3 rayleighCoefficient = vec3(5.8e-6, 13.5e-6, 33.1e-6);

// color of the sun
vec3 sunColor = vec3(10.0, 10.0, 10.0);

// probability that scattering changes the direction of the photon of the given angle
// per meter and steradian (m-1sr-1)
float rayleighPhase(float cosAngle)
{
	return 3.0 / (16.0 * 3.1415) * (1.0 + cosAngle * cosAngle);
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

vec3 skyColor(vec3 viewDirection, vec3 sunDirection)
{
	vec3 outColor;
	
	float distance = distanceToUnitSphere(vec3(0.0, 0.9, 0.0), viewDirection);
	
	//vec3 inScattering = rayleighPhase(dot(sunDirection, viewDirection)) * (1.0 - exp(-distance * 600000.0 * rayleighCoefficient));
	//outColor = inScattering * sunColor;// * exp(-distance * 600000.0 * rayleighCoefficient);
	
	outColor = vec3(0.0, 0.0, 0.0);
	//float opticalDepth = 1.0;
	const int stepCount = 10;
	//const float scaleHeight = 8000.0;
	const float step = 1.0 / float(stepCount);
	float s = 0.0;
	for (int i = 0; i < stepCount; i++)
	{
		s += step;
		vec3 position = vec3(0.0, 0.9, 0.0) + s * distance * viewDirection;
		float realDistanceToViewPoint = s * distance * 600000.0; // map 0.1 from the unit sphere to 60km of atmosphere
		float altitude = (length(position) - 0.9) * 600000.0; // in [0-60km]
		//opticalDepth += exp(-altitude / scaleHeight) * step * distance * 600000.0;
		float depth = distanceToUnitSphere(position, sunDirection) * 600000.0;
		vec3 extinction = exp(-depth * rayleighCoefficient);
		vec3 extinction2 = exp(-realDistanceToViewPoint * 0.3 * rayleighCoefficient);
		//outColor = vec3(opticalDepth, 0.0, 0.0) * 0.1;
		outColor += extinction2 * extinction * rayleighCoefficient * step * distance * 600000.0;
	}
	float cosAngle = dot(sunDirection, viewDirection);
	//vec3 rayleighFactor = rayleighScattering(cosAngle);
	outColor *= sunColor * rayleighPhase(cosAngle);
	
	return outColor;
}

vec3 sunLight(vec3 viewDirection, vec3 sunDirection)
{
	float cosAngle = dot(sunDirection, viewDirection);
	vec3 sun = sunColor * pow(max(cosAngle, 0.0), 1000.0 + (1.0 - exp(-mod(time, 1.0))) * 3000.0);
	
	return sun;
}
