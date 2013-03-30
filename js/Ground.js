"use strict";

function Ground(options)
{
	this.shader = new ShaderProgram(groundVertexShader, groundFragmentShader)
	
	// index strip; expanded in vertex shader
	this._size = 200
	this._updateMesh()
}

Ground.prototype.render = function(time, renderParameters)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("pulseIntensity", renderParameters.pulseIntensity)
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	this.shader.setVec3Uniform("cameraPosition", renderParameters.camera.origin)
	
	this.shader.setFloatUniform("stride", this._size + 1)
	
	var gridIndexAttribute = this.shader.getAttributeLocation("gridIndex")
	this.mesh.bind(gridIndexAttribute)
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.mesh.itemCount)
}

Ground.prototype._updateMesh = function()
{
	var stride = this._size + 1
	vertexCount = (stride*2+2)*this._size;
	var gridArray = new Uint16Array(vertexCount)
	
	var index=0;
	for(var row=0; row < this._size; row++)
	{
		gridArray[index++] = (row+0)*stride;
		for(var col=0; col < stride; col++)
		{
			gridArray[index++] = (row+0)*stride + col;
			gridArray[index++] = (row+1)*stride + col;
		}
		gridArray[index++] = (row+2)*stride-1;
	}
	
	this.mesh = new VertexBuffer(1, gl.UNSIGNED_SHORT, gridArray)
}
