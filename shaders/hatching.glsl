float hatch(vec2 pos)
{
	float shiftedY = pos.y + sin(pos.x * 0.02) * 3.0;
	return pow(mod(shiftedY, 10.0) * 0.1 - 0.05, 2.0) * exp(-mod(pos.x * 0.1 + shiftedY + cos(pos.y), 5.0));
}

float crosshatch(vec2 pos, float intensity)
{
	float res = 1.0;
	res -= smoothstep(1.0, 0.8, intensity) * hatch(pos);
	res -= smoothstep(0.8, 0.6, intensity) * hatch(pos * 0.8);
	res -= smoothstep(0.6, 0.4, intensity) * hatch(pos.yx);
	res -= smoothstep(0.4, 0.0, intensity) * hatch(pos.yx * 0.7);
	
	return res;
}
