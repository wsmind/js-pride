"use strict";

function Mesh(meshBuffer)
{
	this.vertexCount = 0
	this.primitiveType = gl.TRIANGLES
	
	this.vertexCount = meshBuffer.indices.length
	this.positions = new VertexBuffer(3, gl.FLOAT, new Float32Array(meshBuffer.positions))
	this.normals = new VertexBuffer(3, gl.FLOAT, new Float32Array(meshBuffer.normals))
	this.indices = new IndexBuffer(new Uint16Array(meshBuffer.indices))
}

Mesh.prototype.render = function(positionAttribute, normalAttribute)
{
	if (this.vertexCount == 0)
		return;
	
	if (this.positions) this.positions.bind(positionAttribute)
	if (this.normals) this.normals.bind(normalAttribute)
	
	if (this.indices)
	{
		this.indices.bind()
		gl.drawElements(this.primitiveType, this.vertexCount, gl.UNSIGNED_SHORT, 0)
	}
	else
	{
		gl.drawArrays(this.primitiveType, 0, this.vertexCount)
	}
}
