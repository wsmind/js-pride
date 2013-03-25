"use strict";

function Equalizer(options)
{
	this.shader = new ShaderProgram(buildingVertexShader, buildingFragmentShader)
	
	this.building = new Building({
		width: 2,
		depth: 2,
		floors: 6
	})
}

Equalizer.prototype.render = function(time, renderParameters)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", renderParameters.camera.aspect)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")
	
	var beat = Math.exp(-(time % 1.0))
	for (var x = 0; x < 6; x++)
	{
		this.shader.setVec3Uniform("origin", [x * 4 - 10.5, 0, 0])
		var height = ((Math.floor(time) * 3527 * x) % 5) / 3
		this.shader.setFloatUniform("scale", height + beat)
		this.shader.setFloatUniform("rainbowFactor", beat)
		this.building.render(positionAttribute, normalAttribute)
	}
}
