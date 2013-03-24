"use strict";

function Ground(options)
{
	this.shader = new ShaderProgram(groundVertexShader, groundFragmentShader)
	
	// fullscreen quad
	var points = [-1, 1, -1, -1, 1, 1, 1, -1]
	this.mesh = new VertexBuffer(2, gl.FLOAT, new Float32Array(points))
}

Ground.prototype.render = function(time, renderParameters)
{
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setVec2Uniform("resolution", [canvas.width, canvas.height])
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	
	var posAttribute = this.shader.getAttributeLocation("position")
	this.mesh.bind(posAttribute)
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}
