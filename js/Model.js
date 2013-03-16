"use strict";

function Model(meshBuffer)
{
	this.shader = new ShaderProgram(modelVertexShader, modelFragmentShader)
	this.mesh = new Mesh(meshBuffer)
}

Model.prototype.render = function(time)
{
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", canvas.width / canvas.height)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")
	this.mesh.render(positionAttribute, normalAttribute)
}
