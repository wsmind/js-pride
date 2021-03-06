"use strict";

function Sky()
{
	this.shader = new ShaderProgram(skyVertexShader, skyFragmentShader)
	
	// fullscreen quad
	var points = [-1, -1, -1, 1, 1, -1, 1, 1]
	this.mesh = new VertexBuffer(2, gl.FLOAT, new Float32Array(points))
}

Sky.prototype.render = function(time, renderParameters)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthMask(false)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("pulseIntensity", renderParameters.pulseIntensity)
	this.shader.setFloatUniform("tanFov", Math.tan(renderParameters.camera.fov * 0.5))
	this.shader.setVec2Uniform("resolution", [canvas.width, canvas.height])
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	
	var posAttribute = this.shader.getAttributeLocation("position")
	this.mesh.bind(posAttribute)
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}
