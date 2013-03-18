"use strict";

function Demo()
{
	// load sound
	this.audio = new Audio()
	this.audio.src = "music/LukHash_-_PRELUDE.mp3"
	this.audio.volume = 0
	
	this.audio.play()
	
	var self = this
	//this.audio.onloadedmetadata = function()
	setTimeout(function()
	{
		// wait to have the actual audio duration (not NaN)
		self.timeline = new Timeline(self.audio.duration)
	}, 500)
	
	$(window).keydown(function(event)
	{
		if (String.fromCharCode(event.keyCode) == ' ')
		{
			if (self.audio.paused)
				self.audio.play()
			else
				self.audio.pause()
			
			return false;
		}
		
		return true;
	})
	
	$("#timeline .content").mousedown(function(downEvent)
	{
		if (downEvent.button == 0)
		{
			//debugger;
			self.seek((downEvent.clientX - downEvent.delegateTarget.offsetLeft) * self.audio.duration / this.clientWidth)
			
			// start dragging
			$("#timeline .content").mousemove(function(moveEvent)
			{
				self.seek((moveEvent.clientX - moveEvent.delegateTarget.offsetLeft) * self.audio.duration / this.clientWidth)
			})
		}
	})
	
	$(document).mouseup(function(event)
	{
		// stop dragging
		$("#timeline .content").off("mousemove")
	})
}

Demo.prototype.update = function()
{
	if (!this.timeline)
		return
	
	var demoTime = this.audio.currentTime
	
	this._updateCursor(demoTime)
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clearDepth(1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	
	gl.enable(gl.CULL_FACE)
	gl.cullFace(gl.BACK)
	gl.frontFace(gl.CW)
	
	var renderParameters = {
		camera: new Camera(),
		sunDirection: vec3.clone([0, 1, 0])
	}
	
	// default aspect
	renderParameters.camera.aspect = canvas.width / canvas.height
	//renderParameters.camera.origin = [-5 * Math.cos(demoTime * 0.4), 7, 8 * Math.sin(demoTime * 0.3)]
	//renderParameters.camera.target = [0, 5, 0]
	
	//renderParameters.sunDirection = vec3.clone([Math.cos(demoTime * 0.1), Math.sin(-demoTime * 0.4), Math.cos(demoTime * 0.4)]);
	//vec3.normalize(renderParameters.sunDirection, renderParameters.sunDirection)
	
	this.timeline.render(demoTime, renderParameters)
}

Demo.prototype.seek = function(time)
{
	// seek audio track
	this.audio.currentTime = time
	
	// update time cursor
	this._updateCursor(time)
}

Demo.prototype._updateCursor = function(time)
{
	var cursorPosition = time * $("#timeline .content").width() / this.audio.duration;
	
	$("#cursor").css("left", cursorPosition)
}
