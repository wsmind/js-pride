"use strict";

function Background()
{
	this.shader = new ShaderProgram(backgroundVertexShader, backgroundFragmentShader)
	
	// fullscreen quad
	var points = [-1, -1, -1, 1, 1, -1, 1, 1]
	this.mesh = new VertexBuffer(2, gl.FLOAT, new Float32Array(points))
}

Background.prototype.render = function(time)
{
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setVec2Uniform("res", [canvas.width, canvas.height])
	
	var posAttribute = this.shader.getAttributeLocation("vertexPos")
	this.mesh.bind(posAttribute)
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}
