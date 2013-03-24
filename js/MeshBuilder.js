"use strict";

function MeshBuilder()
{
	this.positions = []
	this.normals = []
	this.indices = []
}

MeshBuilder.prototype.appendMeshBuffer = function(meshBuffer, origin, angle)
{
	var startIndex = this.positions.length
	var startIndex2 = this.indices.length
	var rotation = quat.create()
	quat.rotateY(rotation, rotation, angle)
	
	this.positions.length += meshBuffer.positions.length
	this.normals.length += meshBuffer.positions.length
	this.indices.length += meshBuffer.indices.length
	
	var position = vec3.create()
	var normal = vec3.create()
	
	for (var i = 0; i < meshBuffer.positions.length; i += 3)
	{
		position[0] = meshBuffer.positions[i + 0]
		position[1] = meshBuffer.positions[i + 1]
		position[2] = meshBuffer.positions[i + 2]
		normal[0] = meshBuffer.normals[i + 0]
		normal[1] = meshBuffer.normals[i + 1]
		normal[2] = meshBuffer.normals[i + 2]
		
		// rotate position and normal
		vec3.transformQuat(position, position, rotation)
		vec3.transformQuat(normal, normal, rotation)
		
		// offset the position with local origin
		vec3.add(position, position, origin)
		
		this.positions[startIndex + i + 0] = position[0]
		this.positions[startIndex + i + 1] = position[1]
		this.positions[startIndex + i + 2] = position[2]
		this.normals[startIndex + i + 0] = normal[0]
		this.normals[startIndex + i + 1] = normal[1]
		this.normals[startIndex + i + 2] = normal[2]
	}
	
	for (var i = 0; i < meshBuffer.indices.length; i++)
	{
		this.indices[startIndex2 + i] = meshBuffer.indices[i] + startIndex / 3
	}
}

MeshBuilder.prototype.buildMesh = function()
{
	return new Mesh({
		positions: this.positions,
		normals: this.normals,
		indices: this.indices
	})
}
