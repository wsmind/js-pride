"use strict";

// timeline data
// [ tracks ]

// track:
// {
//   name: "",
//   clips: [ clip ]
// }

// clip:
// {
//   start: 0, // seconds
//   duration: 0, // seconds
// }

function Timeline(duration)
{
	this.duration = duration
	
	/*localStorage["plop"] = JSON.stringify({yop: 42})
	alert(JSON.parse(localStorage["plop"]).yop)*/
	this.tracks = [
		/*{
			name: "background",
			clips: [
				{
					start: 0,
					duration: 20,
					instance: new Background()
				},
				{
					start: 20,
					duration: 10,
					instance: new Rainbow()
				},
				{
					start: 30,
					duration: 40,
					instance: new Rainbow()
				}
			]
		},
		{
			name: "cool stuff",
			clips: [
				{
					start: 15,
					duration: 20,
					instance: new WireModel(eiffelMeshBuffer)
				}
			]
		},*/
		{
			name: "camera",
			clips: [
				{
					start: 0,
					duration: 320,
					instance: new GreetsCamera({})
				},
				{
					start: 320,
					duration: 32,
					instance: new FixedCamera({
						origin: [0, 7, 40],
						target: [0, 7, 0],
						fov: Math.PI * 0.12
					})
				},
				{
					start: 384,
					duration: 32,
					instance: new FixedCamera({
						origin: [0, 120, 3],
						target: [0, 1, 2],
						fov: Math.PI * 0.16
					})
				}
			]
		},
		{
			name: "environment",
			clips: [
				{
					start: 0,
					duration: 400,
					instance: new Environment({
						initialTime: 3, // [0-24[
						speed: 0.2, // hr/sec, so to say ;)
					})
				}
			]
		},
		{
			name: "ground",
			clips: [
				{
					start: 0,
					duration: 320,
					instance: new Ground()
				}
			]
		},
		{
			name: "background",
			clips: [
				{
					start: 0,
					duration: 320,
					instance: new Sky()
				},
				{
					start: 320,
					duration: 32,
					instance: new Background()
				}
			]
		},
		{
			name: "buildings",
			clips: [
				{
					start: 0,
					duration: 320,
					instance: new Town()
				}
			]
		},
		{
			name: "special buildings",
			clips: [
				{
					start: 0,
					duration: 320,
					instance: new GreetsTower()
				}
			]
		},
		{
			name: "cool fx",
			clips: [
				{
					start: 0,
					duration: 320,
					instance: new Neon({points: plopVitalmotionPoints})
				},
				{
					start: 320,
					duration: 32,
					instance: new Equalizer()
				},
				{
					start: 384,
					duration: 32,
					instance: new BuildingText("JS-PRIDE")
				}
			]
		}
	]
	
	$(".tracks").empty()
	for (var i = this.tracks.length - 1; i >= 0; i--)
	{
		var track = this.tracks[i]
		var name = $("<li>" + track.name + "</li>")
		$("#timeline .header .tracks").append(name)
		
		var contentTrack = $("<li><ul class=\"clips\"></ul></li>")
		$("#timeline .content .tracks").append(contentTrack)
		
		for (var j = 0; j < track.clips.length; j++)
		{
			var clip = track.clips[j]
			var clipView = $("<li><span class=\"left-handle\"></span>Clip!<span class=\"right-handle\"></span></li>")
			
			clipView.css("left", clip.start * 100 / this.duration + "%")
			clipView.css("width", clip.duration * 100 / this.duration + "%")
			
			contentTrack.children("ul").append(clipView)
		}
	}
}

Timeline.prototype.render = function(time, renderParameters)
{
	for (var i = 0; i < this.tracks.length; i++)
	{
		var track = this.tracks[i]
		
		for (var j = 0; j < track.clips.length; j++)
		{
			var clip = track.clips[j]
			if ((time >= clip.start) && (time < clip.start + clip.duration))
			{
				if (clip.instance)
					clip.instance.render(time - clip.start, renderParameters)
			}
		}
	}
}
