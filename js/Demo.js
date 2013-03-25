"use strict";

function Demo()
{
	// load sound
	this.audio = new Audio()
	this.audio.src = "music/Pissaladiere03_drums.mp3"
	//this.audio.volume = 0
	this.bpm = 128
	
	this.audio.play()
	
	var self = this
	this.audio.addEventListener("loadedmetadata", function()
	{
		// wait to have the actual audio duration (not NaN)
		self.beatDuration = self.audio.duration * self.bpm / 60.0
		self.timeline = new Timeline(self.beatDuration)
	})
	
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
			self.seek((downEvent.clientX - downEvent.delegateTarget.offsetLeft) * self.beatDuration / this.clientWidth)
			
			// start dragging
			$("#timeline .content").mousemove(function(moveEvent)
			{
				self.seek((moveEvent.clientX - moveEvent.delegateTarget.offsetLeft) * self.beatDuration / this.clientWidth)
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
	
	var demoTime = this.audio.currentTime * this.bpm / 60.0
	
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
	this.audio.currentTime = time * 60.0 / this.bpm
	
	// update time cursor
	this._updateCursor(time)
}

Demo.prototype._updateCursor = function(time)
{
	var cursorPosition = time * $("#timeline .content").width() / this.beatDuration;
	
	$("#cursor").css("left", cursorPosition)
}
