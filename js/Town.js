"use strict";

function Town(options)
{
	this.shader = new ShaderProgram(buildingVertexShader, buildingFragmentShader)
	
	/*this.doorMesh = new Mesh(doorMeshBuffer)
	this.windowMesh = new Mesh(windowMeshBuffer)
	this.cornerMesh = new Mesh(cornerMeshBuffer)
	this.roofMesh = new Mesh(roofMeshBuffer)
	this.roofCornerMesh = new Mesh(roofCornerMeshBuffer)
	this.roofTopMesh = new Mesh(roofTopMeshBuffer)
	
	this.width = options.width || 4
	this.depth = options.depth || 3
	this.floors = options.floors || 5*/
	
	this.buildings = []
	
	/*for (var x = 0; x < 10; x++)
	{
		for (var z = 0; z < 10; z++)
		{
			this.buildings.push(new Building({origin: [x * 7 - 50, 0, -z * 6 + 30]}))
		}
	}*/
	this.buildings.push(new Building({origin: [0, 0, 0]}))
}

Town.prototype.render = function(time, renderParameters)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", renderParameters.camera.aspect)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")
	
	/*for (var i = 0; i < this.buildings.length; i++)
	{
		var building = this.buildings[i]
		this.shader.setVec3Uniform("origin", building.origin)
		building.render(positionAttribute, normalAttribute)
	}*/
	
	for (var x = 0; x < 6; x++)
	{
		for (var z = 0; z < 6; z++)
		{
			this.shader.setVec3Uniform("origin", [x * 7 - 30, 0, -z * 6 + 10])
			this.buildings[0].render(positionAttribute, normalAttribute)
		}
	}
}

/*Town.prototype.drawBuilding = function(origin, positionAttribute, normalAttribute)
{
	//this.floors = Math.floor((Math.sin(time * 0.2) + 2.0) * 2.0)
	//this.depth = Math.floor((Math.sin(time * 0.3) + 2.0) * 2.0)
	var position = vec3.create()
	vec3.add(position, origin, [0, 0, 0])
	this.drawWall(position, this.width, this.floors, 0, positionAttribute, normalAttribute)
	vec3.add(position, origin, [this.width, 0, -1])
	this.drawWall(position, this.depth, this.floors, Math.PI * 0.5, positionAttribute, normalAttribute)
	vec3.add(position, origin, [this.width - 1, 0, -this.depth - 1])
	this.drawWall(position, this.width, this.floors, Math.PI, positionAttribute, normalAttribute)
	vec3.add(position, origin, [-1, 0, -this.depth])
	this.drawWall(position, this.depth, this.floors, -Math.PI * 0.5, positionAttribute, normalAttribute)
	vec3.add(position, origin, [0, this.floors, -1])
	this.drawRoof(position, positionAttribute, normalAttribute)
}

Town.prototype.drawWall = function(origin, length, height, angle, positionAttribute, normalAttribute)
{
	for (var x = 0; x < length; x++)
	{
		for (var y = 0; y < height; y++)
		{
			var position = vec3.clone(origin)
			vec3.add(position, position, [Math.cos(angle) * x, y, -Math.sin(angle) * x])
			this.shader.setVec3Uniform("origin", position)
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

Town.prototype.drawRoof = function(origin, positionAttribute, normalAttribute)
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
}*/
