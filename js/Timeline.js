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
	
	this.tracks = [
		// SECTIONS
		//   Intro             0 - 32 (32)
		//   Construction      32 - 160 (128)
		//   Lonely rainbow    160 - 194 (32)
		//   Party rainbow     194 - 416 (224)
		//   Bastille          416 - 480 (64)
		{
			name: "camera",
			clips: [
				{
					start: 0,
					duration: 32,
					instance: new FixedCamera({
						origin: [0, 2, 10],
						target: [0, 2, 0],
						fov: Math.PI * 0.3
					})
				},
				{
					start: 32,
					duration: 112,
					instance: new StreetCamera({})
				},
				{
					start: 96,
					duration: 32,
					instance: new FixedCamera({
						origin: [0, 7, 40],
						target: [0, 7, 0],
						fov: Math.PI * 0.12,
						shake: 1.0
					})
				},
				{
					start: 144,
					duration: 16,
					instance: new TextCamera({})
				},
				/*{
					start: 160,
					duration: 32,
					instance: new No Camera needed here!({})
				},*/
				{
					start: 194,
					duration: 94,
					instance: new StreetCamera({})
				},
				{
					start: 288,
					duration: 16,
					instance: new TextCamera({})
				},
				{
					start: 304,
					duration: 16,
					instance: new TextCamera({})
				},
				{
					start: 320,
					duration: 16,
					instance: new TextCamera({})
				},
				{
					start: 416,
					duration: 64,
					instance: new GreetsCamera({})
				}
				/*{
					start: 416,
					duration: 64,
					instance: new FixedCamera({
						origin: [0, 120, 3],
						target: [0, 1, 2],
						fov: Math.PI * 0.16
					})
				}*/
			]
		},
		{
			name: "environment",
			clips: [
				{
					start: 0,
					duration: 480,
					instance: new Environment({
						initialTime: 5, // [0-24[
						speed: 24 / 480, // hr/beat, so to say ;)
					})
				}
			]
		},
		{
			name: "ground",
			clips: [
				{
					start: 0,
					duration: 96,
					instance: new Ground()
				}
			]
		},
		{
			name: "background",
			clips: [
				{
					start: 0,
					duration: 96,
					instance: new Sky()
				},
				{
					start: 96,
					duration: 32,
					instance: new Background()
				}
			]
		},
		{
			name: "buildings",
			clips: [
				{
					start: 32,
					duration: 64,
					instance: new Town()
				},
				{
					start: 194,
					duration: 94,
					instance: new Town()
				}
			]
		},
		{
			name: "special buildings",
			clips: [
				{
					start: 416,
					duration: 64,
					instance: new GreetsTower()
				}
			]
		},
		{
			name: "cool fx",
			clips: [
				{
					start: 96,
					duration: 32,
					instance: new Equalizer()
				},
				{
					start: 144,
					duration: 16,
					instance: new BuildingText("JS-PRIDE")
				},
				{
					start: 160,
					duration: 16,
					instance: new Rainbow()
				},
				{
					start: 288,
					duration: 16,
					instance: new BuildingText("TITEIKO")
				},
				{
					start: 304,
					duration: 16,
					instance: new BuildingText("MODRAW")
				},
				{
					start: 320,
					duration: 16,
					instance: new BuildingText("WSMIND")
				}
				/*{
					start: 0,
					duration: 32,
					instance: new Neon({points: neonDemojsPoints, origin: [0, 2, 5], direction: [-0.7, 0, 0.7]})
				},*/
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
