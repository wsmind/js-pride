"use strict";

function GreetsTower(options)
{
	this.shader = new ShaderProgram(buildingVertexShader, buildingFragmentShader)
	
	this.building = new Building({
		width: 3,
		depth: 3,
		floors: 40
	})
	
	this.neons = []
	this.neons.push(new Neon({points: plopAdinpszPoints, origin: [0, 3, 0.2]}))
	this.neons.push(new Neon({points: plopAdinpszPoints, origin: [0, 7, 0.2]}))
	this.neons.push(new Neon({points: plopAdinpszPoints, origin: [0, 9, 0.2]}))
	this.neons.push(new Neon({points: plopAdinpszPoints, origin: [0, 12, 0.2]}))
}

GreetsTower.prototype.render = function(time, renderParameters)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")
	
	var beat = Math.exp(-(time % 1.0))
	this.shader.setVec3Uniform("origin", [-0.5, 0, 1.5])
	this.shader.setFloatUniform("scale", 1.0)
	this.shader.setFloatUniform("rainbowFactor", beat * 0.1)
	this.building.render(positionAttribute, normalAttribute)
	
	for (var i = 0; i < this.neons.length; i++)
		this.neons[i].render(time, renderParameters)
}
