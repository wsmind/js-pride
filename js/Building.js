"use strict";

function Building(options)
{
	this.shader = new ShaderProgram(buildingVertexShader, buildingFragmentShader)
	this.doorMesh = new Mesh(doorMeshBuffer)
	this.windowMesh = new Mesh(windowMeshBuffer)
	this.cornerMesh = new Mesh(cornerMeshBuffer)
	this.roofMesh = new Mesh(roofMeshBuffer)
	this.roofCornerMesh = new Mesh(roofCornerMeshBuffer)
	this.roofTopMesh = new Mesh(roofTopMeshBuffer)
	
	this.width = options.width || 4
	this.depth = options.depth || 3
	this.floors = options.floors || 5
}

Building.prototype.render = function(time, viewProjectionMatrix, viewMatrix)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", canvas.width / canvas.height)
	this.shader.setMat4Uniform("viewProjectionMatrix", viewProjectionMatrix)
	this.shader.setMat4Uniform("viewMatrix", viewMatrix)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")
	
	//this.floors = Math.floor((Math.sin(time * 0.2) + 2.0) * 2.0)
	//this.depth = Math.floor((Math.sin(time * 0.3) + 2.0) * 2.0)
	this.drawWall([0, 0, 0], this.width, this.floors, 0, positionAttribute, normalAttribute)
	this.drawWall([this.width, 0, -1], this.depth, this.floors, Math.PI * 0.5, positionAttribute, normalAttribute)
	this.drawWall([this.width - 1, 0, -this.depth - 1], this.width, this.floors, Math.PI, positionAttribute, normalAttribute)
	this.drawWall([-1, 0, -this.depth], this.depth, this.floors, -Math.PI * 0.5, positionAttribute, normalAttribute)
	this.drawRoof([0, this.floors, -1], positionAttribute, normalAttribute)
}

Building.prototype.drawWall = function(origin, length, height, angle, positionAttribute, normalAttribute)
{
	for (var x = 0; x < length; x++)
	{
		for (var y = 0; y < height; y++)
		{
			this.shader.setVec3Uniform("origin", [origin[0] + Math.cos(angle) * x, origin[1] + y, origin[2] - Math.sin(angle) * x])
			this.shader.setFloatUniform("angle", angle)
			
			if (x == length - 1)
			{
				if (y == height - 1)
					this.roofCornerMesh.render(positionAttribute, normalAttribute)
				else
					this.cornerMesh.render(positionAttribute, normalAttribute)
			}
			else
			{
				if (y == height - 1)
					this.roofMesh.render(positionAttribute, normalAttribute)
				else if (y > 0)
					this.windowMesh.render(positionAttribute, normalAttribute)
				else
					this.doorMesh.render(positionAttribute, normalAttribute)
			}
		}
	}
}

Building.prototype.drawRoof = function(origin, positionAttribute, normalAttribute)
{
	for (var x = 0; x < this.width - 1; x++)
	{
		for (var z = 0; z < this.depth - 1; z++)
		{
			this.shader.setVec3Uniform("origin", [origin[0] + x, origin[1], origin[2] - z])
			this.shader.setFloatUniform("angle", 0)
			
			this.roofTopMesh.render(positionAttribute, normalAttribute)
		}
	}
}
