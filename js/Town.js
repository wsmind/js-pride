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
	
	/*for (var x = 0; x < 6; x++)
	{
		for (var z = 0; z < 6; z++)
		{
			this.buildings.push(new Building({
				origin: [x * 7 - 30, 0, -z * 6 + 10],
				width: Math.floor(Math.random() * 4),
				depth: Math.floor(Math.random() * 4),
				floors: 5
			}))
		}
	}*/
	
	this.models = []
	for (var size = 2; size < 7; size++)
	{
		this.models.push(new Building({
			width: size,
			depth: size,
			floors: 5
		}))
	}
	
	var currentZ = 0
	this.buildings = []
	for (var i = 0; i < 20; i++)
	{
		var size = Math.floor(Math.random() * 4) + 2
		this.buildings.push({
			origin: [2, 0, currentZ],
			size: size
		})
		this.buildings.push({
			origin: [-4 - size, 0, currentZ],
			size: size
		})
		currentZ -= size
	}
	//this.buildings.push(new Building({origin: [0, 0, 0]}))
}

Town.prototype.render = function(time, renderParameters)
{
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true)
	
	this.shader.bind()
	this.shader.setFloatUniform("time", time)
	this.shader.setFloatUniform("pulseIntensity", renderParameters.pulseIntensity)
	this.shader.setFloatUniform("ratio", renderParameters.camera.aspect)
	this.shader.setMat4Uniform("viewProjectionMatrix", renderParameters.camera.viewProjectionMatrix)
	this.shader.setMat4Uniform("viewMatrix", renderParameters.camera.viewMatrix)
	this.shader.setVec3Uniform("sunDirection", renderParameters.sunDirection)
	
	var positionAttribute = this.shader.getAttributeLocation("position")
	var normalAttribute = this.shader.getAttributeLocation("normal")
	
	/*var beat = Math.exp(-(time % 1.0))
	for (var i = 0; i < this.buildings.length; i++)
	{
		var building = this.buildings[i]
		this.shader.setVec3Uniform("origin", building.origin)
		//this.shader.setFloatUniform("scale", 1.0)
		//this.shader.setFloatUniform("rainbowFactor", 0.0)
		this.shader.setFloatUniform("scale", 1.0 + Math.sin(building.origin[2] * 2.0 + time * 0.25) * 0.2)
		this.shader.setFloatUniform("rainbowFactor", beat * 0.2 + Math.max(i - time, 0) * 0.8)
		//this.shader.setFloatUniform("spaceFactor", Math.max(i - time, 0))
		this.shader.setFloatUniform("spaceFactor", 0)
		building.render(positionAttribute, normalAttribute)
	}*/
	
	var beat = Math.exp(-(time % 1.0))
	for (var i = 0; i < this.buildings.length; i++)
	{
		var building = this.buildings[i]
		this.shader.setVec3Uniform("origin", building.origin)
		//this.shader.setFloatUniform("scale", 1.0)
		//this.shader.setFloatUniform("rainbowFactor", 0.0)
		this.shader.setFloatUniform("scale", 1.0 + Math.sin(building.origin[2] * 2.0 + time * 0.25) * 0.2)
		//this.shader.setFloatUniform("rainbowFactor", beat * 0.2 + Math.max(i - time, 0) * 0.8)
		this.shader.setFloatUniform("rainbowFactor", beat * 0.2)
		//this.shader.setFloatUniform("spaceFactor", Math.max(i - time, 0))
		this.shader.setFloatUniform("spaceFactor", Math.exp(vec3.distance(building.origin, renderParameters.camera.origin) - 20.0) * 0.01)
		this.models[building.size - 2].render(positionAttribute, normalAttribute)
	}
	
	/*for (var x = 0; x < 6; x++)
	{
		for (var z = 0; z < 6; z++)
		{
			this.shader.setVec3Uniform("origin", [x * 7 - 30, 0, -z * 6 + 10])
			this.buildings[0].render(positionAttribute, normalAttribute)
		}
	}*/
}
