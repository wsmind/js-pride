"use strict";

function MeshBuilder()
{
	this.positions = []
	this.normals = []
	this.indices = []
}

MeshBuilder.prototype.appendMeshBuffer = function(meshBuffer, origin, angle)
{
	var startIndex = this.positions.length / 3
	var rotation = quat.create()
	quat.rotateY(rotation, rotation, angle)
	
	for (var i = 0; i < meshBuffer.positions.length; i += 3)
	{
		var position = meshBuffer.positions.slice(i, i + 3)
		var normal = meshBuffer.normals.slice(i, i + 3)
		
		// rotate position and normal
		vec3.transformQuat(position, position, rotation)
		vec3.transformQuat(normal, normal, rotation)
		
		// offset the position with local origin
		vec3.add(position, position, origin)
		
		this.positions = this.positions.concat(position)
		this.normals = this.normals.concat(normal)
	}
	
	for (var i = 0; i < meshBuffer.indices.length; i++)
	{
		this.indices.push(meshBuffer.indices[i] + startIndex)
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
