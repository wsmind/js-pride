"use strict";

function Rainbow()
{
	this.shader = new ShaderProgram(rainbowVertexShader, rainbowFragmentShader)
	
	// generate some tesselation to allow deforming the mesh
	steps = 100
	var points = []
	for (var i = 0; i < steps; i++)
	{
		var x = (i / (steps - 1)) * 2.0 - 1.0;
		points.push(x)
		points.push(-1.0)
		points.push(x)
		points.push(1.0)
	}
	this.mesh = new VertexBuffer(2, gl.FLOAT, new Float32Array(points))
}

Rainbow.prototype.render = function(time)
{
	gl.disable(gl.DEPTH_TEST)
	gl.depthMask(false)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	
	var posAttribute = this.shader.getAttributeLocation("pos")
	this.mesh.bind(posAttribute)
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.mesh.itemCount)
	
	gl.enable(gl.DEPTH_TEST)
}
