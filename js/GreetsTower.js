"use strict";

function GreetsTower(options)
{
	this.shader = new ShaderProgram(buildingVertexShader, buildingFragmentShader)
	
	this.building = new Building({
		width: 3,
		depth: 3,
		floors: 35
	})
	
	this.neons = []
	this.neons.push(new Neon({points: neonVitalmotionPoints, 	origin: [-1, 5, -1.7], 	direction: [-1, 0, 0]}))
	this.neons.push(new Neon({points: neonXmenPoints, 			origin: [1.6, 8, 1], 	direction: [0.707, 0, 0]}))
	this.neons.push(new Neon({points: neonCtrlPoints, 			origin: [0, 11, -1.7], 	direction: [-1, 0, 0]}))
	this.neons.push(new Neon({points: neonPunkfloydPoints, 		origin: [-0.1, 14, 1.7], 	direction: [0.707, 0, 0]}))
	this.neons.push(new Neon({points: neonMPoints, 				origin: [1.5, 20, -1.5], 	direction: [1, 0, 0]}))
	this.neons.push(new Neon({points: neonRibbonPoints, 		origin: [0, 21, 1.7], 	direction: [1, 0, 0]}))
	this.neons.push(new Neon({points: neonAdinpzPoints, 		origin: [1.6, 25, 1], 	direction: [-1, 0, 0]}))
	this.neons.push(new Neon({points: neonLnxPoints, 		origin: [0, 28, 1.7], 	direction: [1, 0, 0]}))
	this.neons.push(new Neon({points: neonZuulPoints, 		origin: [1.6, 30, 1], 	direction: [-1, 0, 0]}))

	this.neons.push(new Neon({points: neonDatePoints, 		origin: [0, 38, 1.7], 	direction: [0.707, 0, 0]}))
	this.neons.push(new Neon({points: neonDemojsPoints, 		origin: [0, 39.5, 1.7], 	direction: [0.707, 0, 0]}))

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
	this.shader.setFloatUniform("rainbowFactor", -beat * 0.4)
	this.building.render(positionAttribute, normalAttribute)
	
	for (var i = 0; i < this.neons.length; i++)
		this.neons[i].render(time, renderParameters)
}
