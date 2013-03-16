"use strict";

function IndexBuffer(data)
{
	this.ibo = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
}

IndexBuffer.prototype.bind = function()
{
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
}
