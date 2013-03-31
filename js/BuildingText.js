"use strict";

function BuildingText(text)
{
	this.shader = new ShaderProgram(buildingVertexShader, buildingFragmentShader)
	
	this.building = new Building({
		width: 2,
		depth: 2,
		floors: 6
	})
	
	this.computeTextMap(text)
}

BuildingText.prototype.computeTextMap = function(text)
{
	var currentX = -text.length * 2
	this.textMap = []
	
	for (var i = 0; i < text.length; i++)
	{
		var chr = text.charAt(i)
		
		if (chr in this.characterPoints)
		{
			var points = this.characterPoints[chr]
			var startIndex = this.textMap.length
			this.textMap.length += points.length
			
			for (var j = 0; j < points.length; j += 2)
			{
				this.textMap[startIndex + j + 0] = points[j + 0] + currentX
				this.textMap[startIndex + j + 1] = points[j + 1]
			}
		}
		
		// each character is 3 pixels wide
		currentX += 4
	}
}

BuildingText.prototype.render = function(time, renderParameters)
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
	
	var beat = Math.exp(-(time % 1.0))
	for (var i = 0; i < this.textMap.length; i += 2)
	{
		this.shader.setVec3Uniform("origin", [this.textMap[i + 0] * 3, 0, this.textMap[i + 1] * 3])
		var height = ((3527 * i) % 3) / 3
		this.shader.setFloatUniform("scale", height + beat)
		this.shader.setFloatUniform("rainbowFactor", beat * 0.8)
		this.building.render(positionAttribute, normalAttribute)
	}
}

BuildingText.prototype.characterPoints = {
	"J": [2, 0, 2, 1, 2, 2, 2, 3, 2, 4, 1, 4, 0, 4, 0, 3],
	"S": [0, 0, 1, 0, 2, 0, 0, 1, 0, 2, 1, 2, 2, 2, 2, 3, 0, 4, 1, 4, 2, 4],
	"-": [0, 2, 1, 2, 2, 2],
	"P": [0, 0, 1, 0, 2, 0, 0, 1, 2, 1, 0, 2, 1, 2, 2, 2, 0, 3, 0, 4],
	"R": [0, 0, 1, 0, 2, 0, 0, 1, 2, 1, 0, 2, 1, 2, 2, 2, 0, 3, 0, 4, 1, 3, 2, 4],
	"I": [0, 0, 1, 0, 2, 0, 1, 1, 1, 2, 1, 3, 0, 4, 1, 4, 2, 4],
	"D": [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 1, 0, 1, 4, 2, 1, 2, 2, 2, 3],
	"E": [0, 0, 1, 0, 2, 0, 0, 1, 0, 2, 1, 2, 0, 3, 0, 4, 1, 4, 2, 4],
	"T": [0, 0, 1, 0, 2, 0, 1, 1, 1, 2, 1, 3, 1, 4],
	"K": [0, 0, 2, 0, 0, 1, 2, 1, 0, 2, 1, 2, 0, 3, 2, 3, 0, 4, 2, 4],
	"O": [0, 0, 1, 0, 2, 0, 0, 1, 2, 1, 0, 2, 2, 2, 0, 3, 2, 3, 0, 4, 1, 4, 2, 4],
	"W": [0, 0, 2, 0, 0, 1, 2, 1, 0, 2, 2, 2, 0, 3, 1, 3, 2, 3, 0, 4, 2, 4],
	"M": [0, 0, 2, 0, 0, 1, 1, 1, 2, 1, 0, 2, 2, 2, 0, 3, 2, 3, 0, 4, 2, 4],
	"N": [0, 0, 2, 0, 0, 1, 1, 1, 2, 1, 0, 2, 1, 2, 2, 2, 0, 3, 2, 3, 0, 4, 2, 4],
	"A": [1, 0, 0, 1, 2, 1, 0, 2, 1, 2, 2, 2, 0, 3, 2, 3, 0, 4, 2, 4]
}
