"use strict";

function Neon(options)
{
	this.shader = new ShaderProgram(neonVertexShader, neonFragmentShader)
	this.origin = options.origin || [0, 0, 0]
	this.direction = options.direction || [1, 0, 0]
	var points = options.points
	
	this.planeNormal = vec3.create()
	vec3.cross(this.planeNormal, this.direction, [0, 1, 0])
	
	var positions = new Float32Array(points.length * 2)
	//var normals = new Float32Array(points.length * 2)
	var tangents = new Float32Array(points.length * 2)
	var progress = new Float32Array(points.length * 2 / 3)
	
	for (var i = 0; i < points.length; i++)
	{
		positions[(i * 2 + 0) * 3 + 0] = points[(i + 0) * 3 + 0]
		positions[(i * 2 + 0) * 3 + 1] = points[(i + 0) * 3 + 1]
		positions[(i * 2 + 0) * 3 + 2] = points[(i + 0) * 3 + 2]
		positions[(i * 2 + 1) * 3 + 0] = points[(i + 0) * 3 + 0]
		positions[(i * 2 + 1) * 3 + 1] = points[(i + 0) * 3 + 1]
		positions[(i * 2 + 1) * 3 + 2] = points[(i + 0) * 3 + 2]
		
		/*normals[(i * 2 + 0) * 3 + 0] = 0
		normals[(i * 2 + 0) * 3 + 1] = -1
		normals[(i * 2 + 0) * 3 + 2] = 0
		normals[(i * 2 + 1) * 3 + 0] = 0
		normals[(i * 2 + 1) * 3 + 1] = 1
		normals[(i * 2 + 1) * 3 + 2] = 0*/
		
		//var prevIndex = (i > 0) ? i - 1 : i
		//var nextIndex = (i < points.length - 1) ? i + 1 : i
		var prevIndex = i - 2
		var nextIndex = i + 2
		if (prevIndex < 0) prevIndex = 0
		if (nextIndex >= points.length) nextIndex = points.length - 1
		
		var prevPoint = vec3.clone(points.slice(prevIndex * 3, prevIndex * 3 + 3))
		var nextPoint = vec3.clone(points.slice(nextIndex * 3, nextIndex * 3 + 3))
		var tangent = vec3.create()
		vec3.subtract(tangent, nextPoint, prevPoint)
		vec3.normalize(tangent, tangent)
		
		tangents[(i * 2 + 0) * 3 + 0] = tangent[0]
		tangents[(i * 2 + 0) * 3 + 1] = tangent[1]
		tangents[(i * 2 + 0) * 3 + 2] = tangent[2]
		tangents[(i * 2 + 1) * 3 + 0] = -tangent[0]
		tangents[(i * 2 + 1) * 3 + 1] = -tangent[1]
		tangents[(i * 2 + 1) * 3 + 2] = -tangent[2]
		
		progress[i * 2 + 0] = i / points.length
		progress[i * 2 + 1] = i / points.length
	}
	
	this.positions = new VertexBuffer(3, gl.FLOAT, new Float32Array(positions))
	//this.normals = new VertexBuffer(3, gl.FLOAT, new Float32Array(normals))
	this.tangents = new VertexBuffer(3, gl.FLOAT, new Float32Array(tangents))
	this.progress = new VertexBuffer(1, gl.FLOAT, new Float32Array(progress))
}

Neon.prototype.render = function(time, renderParameters)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(false)
	
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.ONE, gl.ONE)
	
	gl.disable(gl.CULL_FACE)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", renderParameters.camera.aspect)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	this.shader.setVec3Uniform("origin", this.origin)
	this.shader.setVec3Uniform("cameraZ", this.planeNormal)
	this.shader.setVec3Uniform("direction", this.direction)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	//var normalAttribute = this.shader.getAttributeLocation("normal")
	var tangentAttribute = this.shader.getAttributeLocation("tangent")
	var progressAttribute = this.shader.getAttributeLocation("progress")
	
	this.positions.bind(positionAttribute)
	//this.normals.bind(normalAttribute)
	this.tangents.bind(tangentAttribute)
	this.progress.bind(progressAttribute)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.positions.itemCount)
	
	gl.disable(gl.BLEND)
	gl.enable(gl.CULL_FACE)
}
