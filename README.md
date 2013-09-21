JS Pride
========

Invitation demo for DemoJS 2013.

Released at Revision 2013, ranked 2nd place in WebGL compo.

* 3D: titeiko
* Code: wsmind
* Music: modraw

[Watch it here!](http://share.titeiko.com/js_pride/release/js-pride.html)

[Pouet link](http://www.pouet.net/prod.php?which=61280)

Note: this demo requires the OES_element_index_uint WebGL extension (a.k.a vertex buffers with more than 64k vertices).
This extension is currently available in Chrome desktop, and just landed in Firefox nightly (should arrive to stable branch in a few release cycles).

License
-------

All the code (javascript or shader) you can find in this repository is licensed under the MIT license, with the exception of
[jQuery](http://jquery.com/), [glMatrix](https://github.com/toji/gl-matrix),
and [seedrandom](http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html),
wich are the property of their respective owners (see individual files for details).

Music ("Pissaladiere") is the property of Modraw, and should not be used without his approval.

Graphics (everything in meshes/) are the property of TiteiKo, and should not be used without her approval.

Other tools and middleware used in this demo:
 * [NodeJS](http://nodejs.org/)
 * [GLSL-Unit](http://code.google.com/p/glsl-unit/)
 * [line-reader](https://github.com/nickewing/line-reader)
 * [rimraf](https://github.com/isaacs/rimraf/)

Build
-----

Unfortunately, the build system has a bit suffered from production constraints, so
it is not as straightforward and clean as one would expect ;)

However, it should still be possible to build the demo if you have the right combination
of tools installed on your machine :)

### Side note: this is Javascript, why are you even building this?

This is good question, normal JS programs don't require building. What we use building for:
 * Compiling assets (shaders and meshes) directly into JS code. The goal is twofold:
   * Avoid dynamically loading these data at runtime, they are directly built into the source code. This is not required for a typical
     application, but is quite practical for a demo (actually, any external request is usually stricly forbidden by party rules).
   * Building assets allows complex optimization to be done at this step. This was not used for JS Pride, but we could be quantizing mesh
     vertices, minifying shader code, or whatever might be necessary to get better performance or lower final output size.
 * Concatenating and minifying/compressing the whole source code. This allows:
   * To fit in small sizes (not used in JS Pride, but compression was used for CRTeCK)
   * Protecting the source code, but we don't really mind (open source is cool :p)
   * A cleaner distribution package, with only a few files, not a big folder full of .js classes.

### Environment

You need installed:
 * NodeJS >= 0.8.x
 * NPM
 * Blender, specifically in 'C:/Program Files/Blender Foundation/Blender/blender.exe', or modify build.js to point somewhere else

### Steps

Run in a command prompt:
```sh
npm install
build.bat
```

Then copy the contents of the music/ directory to the build/ directory.

You should be able to run build/unpacked.html.
