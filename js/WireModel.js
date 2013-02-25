"use strict";

function WireModel(buffer)
{
	this.shader = new ShaderProgram(wireVertexShader, wireFragmentShader)
	this.mesh = new VertexBuffer(3, gl.FLOAT, new Float32Array(buffer))
}

WireModel.prototype.render = function(time)
{
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", canvas.width / canvas.height)
	
	var posAttribute = this.shader.getAttributeLocation("pos")
	this.mesh.bind(posAttribute)
	
	this.shader.setVec2Uniform("q", [1, 1])
	gl.drawArrays(gl.LINES, 0, this.mesh.itemCount)
	this.shader.setVec2Uniform("q", [-1, 1])
	gl.drawArrays(gl.LINES, 0, this.mesh.itemCount)
	this.shader.setVec2Uniform("q", [1, -1])
	gl.drawArrays(gl.LINES, 0, this.mesh.itemCount)
	this.shader.setVec2Uniform("q", [-1, -1])
	gl.drawArrays(gl.LINES, 0, this.mesh.itemCount)
}
