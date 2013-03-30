"use strict";

function Neon(options)
{
	this.shader = new ShaderProgram(neonVertexShader, neonFragmentShader)
	
	var positions = new Float32Array(plopYopPoints.length * 2)
	var normals = new Float32Array(plopYopPoints.length * 2)
	var tangents = new Float32Array(plopYopPoints.length * 2)
	
	for (var i = 0; i < plopYopPoints.length; i++)
	{
		positions[(i * 2 + 0) * 3 + 0] = plopYopPoints[(i + 0) * 3 + 0]
		positions[(i * 2 + 0) * 3 + 1] = plopYopPoints[(i + 0) * 3 + 1]
		positions[(i * 2 + 0) * 3 + 2] = plopYopPoints[(i + 0) * 3 + 2]
		positions[(i * 2 + 1) * 3 + 0] = plopYopPoints[(i + 0) * 3 + 0]
		positions[(i * 2 + 1) * 3 + 1] = plopYopPoints[(i + 0) * 3 + 1]
		positions[(i * 2 + 1) * 3 + 2] = plopYopPoints[(i + 0) * 3 + 2]
		
		normals[(i * 2 + 0) * 3 + 0] = 0
		normals[(i * 2 + 0) * 3 + 1] = -1
		normals[(i * 2 + 0) * 3 + 2] = 0
		normals[(i * 2 + 1) * 3 + 0] = 0
		normals[(i * 2 + 1) * 3 + 1] = 1
		normals[(i * 2 + 1) * 3 + 2] = 0
		
		var prevIndex = (i > 0) ? i - 1 : i
		var nextIndex = (i < plopYopPoints.length - 1) ? i + 1 : i
		
		var prevPoint = vec3.clone(plopYopPoints.slice(prevIndex * 3, prevIndex * 3 + 3))
		var nextPoint = vec3.clone(plopYopPoints.slice(nextIndex * 3, nextIndex * 3 + 3))
		var tangent = vec3.create()
		vec3.subtract(tangent, nextPoint, prevPoint)
		vec3.normalize(tangent, tangent)
		
		tangents[(i * 2 + 0) * 3 + 0] = tangent[0]
		tangents[(i * 2 + 0) * 3 + 1] = tangent[1]
		tangents[(i * 2 + 0) * 3 + 2] = tangent[2]
		tangents[(i * 2 + 1) * 3 + 0] = -tangent[0]
		tangents[(i * 2 + 1) * 3 + 1] = -tangent[1]
		tangents[(i * 2 + 1) * 3 + 2] = -tangent[2]
	}
	
	this.positions = new VertexBuffer(3, gl.FLOAT, new Float32Array(positions))
	this.normals = new VertexBuffer(3, gl.FLOAT, new Float32Array(normals))
	this.tangents = new VertexBuffer(3, gl.FLOAT, new Float32Array(tangents))
}

Neon.prototype.render = function(time, renderParameters)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(false)
	
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.ONE, gl.ONE)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", renderParameters.camera.aspect)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	this.shader.setVec3Uniform("origin", [0, 0, 0])
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")
	var tangentAttribute = this.shader.getAttributeLocation("tangent")
	
	this.positions.bind(positionAttribute)
	this.normals.bind(normalAttribute)
	this.tangents.bind(tangentAttribute)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.positions.itemCount)
	
	gl.disable(gl.BLEND)
}
