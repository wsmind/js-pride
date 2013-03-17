"use strict";

function Sky()
{
	this.shader = new ShaderProgram(skyVertexShader, skyFragmentShader)
	
	// fullscreen quad
	var points = [-1, -1, -1, 1, 1, -1, 1, 1]
	this.mesh = new VertexBuffer(2, gl.FLOAT, new Float32Array(points))
}

Sky.prototype.render = function(time, viewProjectionMatrix, viewMatrix)
{
	gl.disable(gl.DEPTH_TEST)
	gl.depthMask(false)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setVec2Uniform("resolution", [canvas.width, canvas.height])
	this.shader.setMat4Uniform("viewMatrix", viewMatrix)
	
	var posAttribute = this.shader.getAttributeLocation("position")
	this.mesh.bind(posAttribute)
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}
