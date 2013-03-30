"use strict";

function Camera()
{
	// view parameters
	
	this._origin = vec3.create()
	Object.defineProperty(this, "origin", {
		get: function() { return vec3.clone(this._origin) },
		set: function(origin) { vec3.copy(this._origin, origin); this._rebuildMatrix() }
	})
	
	this._target = vec3.clone([0, 0, -1])
	Object.defineProperty(this, "target", {
		get: function() { return vec3.clone(this._target) },
		set: function(target) { vec3.copy(this._target, target); this._rebuildMatrix() }
	})
	
	// projection parameters
	
	this._fov = Math.PI * 0.5
	Object.defineProperty(this, "fov", {
		get: function() { return this._fov },
		set: function(fov) { this._fov = fov; this._rebuildMatrix() }
	})
	
	this._aspect = 1.0
	Object.defineProperty(this, "aspect", {
		get: function() { return this._aspect },
		set: function(aspect) { this._aspect = aspect; this._rebuildMatrix() }
	})
	
	this._nearPlane = 0.1
	Object.defineProperty(this, "nearPlane", {
		get: function() { return this._nearPlane },
		set: function(nearPlane) { this._nearPlane = nearPlane; this._rebuildMatrix() }
	})
	
	this._farPlane = 200.0
	Object.defineProperty(this, "farPlane", {
		get: function() { return this._farPlane },
		set: function(farPlane) { this._farPlane = farPlane; this._rebuildMatrix() }
	})
	
	// derived values
	this._viewMatrix = mat4.create()
	Object.defineProperty(this, "viewMatrix", {
		get: function() { return mat4.clone(this._viewMatrix) }
	})
	
	this._projectionMatrix = mat4.create()
	Object.defineProperty(this, "projectionMatrix", {
		get: function() { return mat4.clone(this._projectionMatrix) }
	})
	
	this._viewProjectionMatrix = mat4.create()
	Object.defineProperty(this, "viewProjectionMatrix", {
		get: function() { return mat4.clone(this._viewProjectionMatrix) }
	})
	
	Object.defineProperty(this, "axisZ", {
		get: function()
		{
			var result = vec3.create()
			vec3.subtract(result, result, this._origin, this._target)
			vec3.normalize(result, result)
			return result
		}
	})
}

Camera.prototype._rebuildMatrix = function()
{
	mat4.lookAt(this._viewMatrix, this._origin, this._target, [0, 1, 0])
	mat4.perspective(this._projectionMatrix, this._fov, this._aspect, this._nearPlane, this._farPlane)
	mat4.multiply(this._viewProjectionMatrix, this._projectionMatrix, this._viewMatrix)
}
