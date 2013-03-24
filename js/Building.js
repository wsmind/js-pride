"use strict";

function Building(options)
{
	//this.shader = new ShaderProgram(buildingVertexShader, buildingFragmentShader)
	
	/*this.doorMesh = new Mesh(doorMeshBuffer)
	this.windowMesh = new Mesh(windowMeshBuffer)
	this.cornerMesh = new Mesh(cornerMeshBuffer)
	this.roofMesh = new Mesh(roofMeshBuffer)
	this.roofCornerMesh = new Mesh(roofCornerMeshBuffer)
	this.roofTopMesh = new Mesh(roofTopMeshBuffer)*/
	
	this.width = options.width || 4
	this.depth = options.depth || 3
	this.floors = options.floors || 5
	this.origin = options.origin || [0, 0, 0]
	
	var builder = new MeshBuilder()
	
	//this.floors = Math.floor((Math.sin(time * 0.2) + 2.0) * 2.0)
	//this.depth = Math.floor((Math.sin(time * 0.3) + 2.0) * 2.0)
	this.buildWall(builder, [0, 0, 0], this.width, this.floors, 0)
	this.buildWall(builder, [this.width, 0, -1], this.depth, this.floors, Math.PI * 0.5)
	this.buildWall(builder, [this.width - 1, 0, -this.depth - 1], this.width, this.floors, Math.PI)
	this.buildWall(builder, [-1, 0, -this.depth], this.depth, this.floors, -Math.PI * 0.5)
	this.buildRoof(builder, [0, this.floors, -1])
	
	this.mesh = builder.buildMesh()
}

Building.prototype.render = function(positionAttribute, normalAttribute)
{
	/*gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("ratio", renderParameters.camera.aspect)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	
	this.shader.setVec3Uniform("origin", this.origin)
	//this.shader.setFloatUniform("angle", 0)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")*/
	
	this.mesh.render(positionAttribute, normalAttribute)
}

Building.prototype.buildWall = function(builder, origin, length, height, angle)
{
	var position = vec3.create()
	for (var x = 0; x < length; x++)
	{
		for (var y = 0; y < height; y++)
		{
			//vec3.add(position, this.origin, origin)
			vec3.add(position, origin, [Math.cos(angle) * x, y, -Math.sin(angle) * x])
			
			if (x == length - 1)
			{
				if (y == height - 1)
					builder.appendMeshBuffer(roofCornerMeshBuffer, position, angle)
				else
					builder.appendMeshBuffer(cornerMeshBuffer, position, angle)
			}
			else
			{
				if (y == height - 1)
					builder.appendMeshBuffer(roofMeshBuffer, position, angle)
				else if (y > 0)
					builder.appendMeshBuffer(windowMeshBuffer, position, angle)
				else
					builder.appendMeshBuffer(doorMeshBuffer, position, angle)
			}
		}
	}
}

Building.prototype.buildRoof = function(builder, origin)
{
	var position = vec3.create()
	for (var x = 0; x < this.width - 1; x++)
	{
		for (var z = 0; z < this.depth - 1; z++)
		{
			//vec3.add(position, this.origin, [origin[0] + x, origin[1], origin[2] - z])
			vec3.add(position, origin, [x, 0, -z])
			builder.appendMeshBuffer(roofTopMeshBuffer, position, 0)
		}
	}
}

/*Building.prototype.drawWall = function(origin, length, height, angle, positionAttribute, normalAttribute)
{
	for (var x = 0; x < length; x++)
	{
		for (var y = 0; y < height; y++)
		{
			var position = vec3.clone(this.origin)
			vec3.add(position, position, origin)
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
}*/
