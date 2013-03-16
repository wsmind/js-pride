"use strict";

function Building(options)
{
	this.shader = new ShaderProgram(buildingVertexShader, buildingFragmentShader)
	this.doorMesh = new Mesh(doorMeshBuffer)
	this.windowMesh = new Mesh(windowMeshBuffer)
	this.cornerMesh = new Mesh(cornerMeshBuffer)
	
	this.width = options.width || 4
	this.depth = options.depth || 3
	this.floors = options.floors || 3
}

Building.prototype.render = function(time)
{
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", canvas.width / canvas.height)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")
	
	this.floors = Math.floor((Math.sin(time) + 2.0) * 3.0)
	this.depth = Math.floor((Math.sin(time * 0.7) + 2.0) * 2.0)
	this.drawWall([0, 0, 0], this.width, this.floors, 0, positionAttribute, normalAttribute)
	this.drawWall([this.width, 0, -1], this.depth, this.floors, Math.PI * 0.5, positionAttribute, normalAttribute)
	this.drawWall([this.width - 1, 0, -this.depth - 1], this.width, this.floors, Math.PI, positionAttribute, normalAttribute)
	this.drawWall([-1, 0, -this.depth], this.depth, this.floors, -Math.PI * 0.5, positionAttribute, normalAttribute)
	
	/*this.shader.setVec3Uniform("origin", [0.0, 0.0, 0.0])
	this.doorMesh.render(positionAttribute, normalAttribute)
	this.shader.setVec3Uniform("origin", [1.0, 0.0, 0.0])
	this.doorMesh.render(positionAttribute, normalAttribute)
	
	this.shader.setVec3Uniform("origin", [0.0, 1.0, 0.0])
	this.windowMesh.render(positionAttribute, normalAttribute)
	this.shader.setVec3Uniform("origin", [1.0, 1.0, 0.0])
	this.windowMesh.render(positionAttribute, normalAttribute)
	
	this.shader.setVec3Uniform("origin", [2.0, 0.0, 0.0])
	this.cornerMesh.render(positionAttribute, normalAttribute)
	this.shader.setVec3Uniform("origin", [2.0, 1.0, 0.0])
	this.cornerMesh.render(positionAttribute, normalAttribute)*/
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
				this.cornerMesh.render(positionAttribute, normalAttribute)
			}
			else
			{
				if (y > 0)
					this.windowMesh.render(positionAttribute, normalAttribute)
				else
					this.doorMesh.render(positionAttribute, normalAttribute)
			}
		}
	}
}
