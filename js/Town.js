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
	
	this.rainbow = options.rainbow || 0.2
	this.space = options.space || 0.0
	
	this.models = []
	for (var size = 2; size < 7; size++)
	{
		this.models.push(new Building({
			width: size,
			depth: size,
			floors: 5
		}))
	}
	
	this.buildings = []
	this.streets = []
	
	/*var currentZ = 0
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
	}*/
	//this.buildings.push(new Building({origin: [0, 0, 0]}))
	
	var buildingsPerStreet = 20
	var streetWidth = 2
	
	var currentPosition = [0, 0]
	var currentDirection = [0, -1]
	for (var street = 0; street < 20; street++)
	{
		this.streets.push({
			position: vec2.clone(currentPosition),
			direction: vec2.clone(currentDirection),
			time: street * buildingsPerStreet
		})
		
		var side = [-currentDirection[1], currentDirection[0]]
		
		// generate buildings along this streeet
		for (var i = 0; i < buildingsPerStreet; i++)
		{
			// random size
			var size = Math.floor(Math.random() * 4) + 2
			
			// add one building
			var building = {
				origin: [currentPosition[0] + side[0] * streetWidth + 1 - ((side[0] + currentDirection[0] < -0.2) ? size : 0), 0, currentPosition[1] + side[1] * streetWidth + ((side[1] + currentDirection[1] > 0.2) ? size : 0)],
				size: size,
				time: street * buildingsPerStreet + i + Math.floor(Math.random() * 4 - 2) - 3
			}
			
			this.buildings.push(building)
			
			// and the one across the road
			var building = {
				origin: [currentPosition[0] - side[0] * streetWidth + 1 - ((side[0] - currentDirection[0] > 0.2) ? size : 0), 0, currentPosition[1] - side[1] * streetWidth + ((side[1] - currentDirection[1] < -0.2) ? size : 0)],
				size: size,
				time: street * buildingsPerStreet + i + Math.floor(Math.random() * 4 - 2) - 3
			}
			
			this.buildings.push(building)
			
			/*this.buildings.push({
				origin: [-4 - size, 0, currentZ],
				size: size
			})*/
			
			vec2.add(currentPosition, currentPosition, [currentDirection[0] * size, currentDirection[1] * size])
		}
		
		// go to intersection center
		vec2.add(currentPosition, currentPosition, [currentDirection[0] * streetWidth, currentDirection[1] * streetWidth])
		
		// change direction randomly
		if (Math.random() >= 0.33)
			vec3.copy(currentDirection, side)
		else if (Math.random() >= 0.33)
			vec3.copy(currentDirection, [-side[0], -side[1]])
		
		// go to new street start
		vec2.add(currentPosition, currentPosition, [currentDirection[0] * streetWidth, currentDirection[1] * streetWidth])
		
	}
}

Town.prototype.render = function(time, renderParameters)
{
	window.streets = this.streets
	
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
	
	var fallingTime = 2
	
	var beat = Math.exp(-(time % 1.0))
	for (var i = 0; i < this.buildings.length; i++)
	{
		var building = this.buildings[i]
		if (building.time - time > fallingTime)
			continue
		if (time - building.time > 20)
			continue
		
		this.shader.setVec3Uniform("origin", building.origin)
		//this.shader.setFloatUniform("scale", 1.0)
		//this.shader.setFloatUniform("rainbowFactor", 0.0)
		this.shader.setFloatUniform("scale", 1.0 + Math.sin(building.origin[2] * 2.0 + time * 0.25) * 0.2)
		//this.shader.setFloatUniform("rainbowFactor", beat * 0.2 + Math.max(i - time, 0) * 0.8)
		this.shader.setFloatUniform("rainbowFactor", beat * this.rainbow)
		//this.shader.setFloatUniform("spaceFactor", Math.max(i - time, 0))
		//this.shader.setFloatUniform("spaceFactor", Math.exp(vec3.distance(building.origin, renderParameters.camera.origin) - 20.0) * 0.01)
		
		var bTime = (time - building.time + fallingTime) / fallingTime
		if (bTime < 0) bTime = 0
		if (bTime > 1) bTime = 1
		this.shader.setFloatUniform("spaceFactor", (1.0 - bTime * bTime) * this.space)
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
