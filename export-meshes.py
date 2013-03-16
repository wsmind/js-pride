import bpy
import random
import math
import os

f = open("build/" + os.path.basename(bpy.data.filepath) + ".js", "w")

for mesh in bpy.data.meshes:
	f.write("var " + mesh.name + "MeshBuffer=")
	f.write('{"positions":[')
	for i in range(0, len(mesh.vertices)):
		f.write(str(mesh.vertices[i].co.x))
		f.write(',')
		f.write(str(mesh.vertices[i].co.z))
		f.write(',')
		f.write(str(-mesh.vertices[i].co.y))
		if i != len(mesh.vertices) - 1:
			f.write(',')
	f.write('],')
	
	f.write('"normals":[')
	for i in range(0, len(mesh.vertices)):
		f.write(str(mesh.vertices[i].normal.x))
		f.write(',')
		f.write(str(mesh.vertices[i].normal.z))
		f.write(',')
		f.write(str(-mesh.vertices[i].normal.y))
		if i != len(mesh.vertices) - 1:
			f.write(',')
	f.write('],')
	
	mesh.update(calc_tessface = True)
	f.write('"indices":[')
	for i in range(0, len(mesh.tessfaces)):
		f.write(str(mesh.tessfaces[i].vertices[0]))
		f.write(',')
		f.write(str(mesh.tessfaces[i].vertices[2]))
		f.write(',')
		f.write(str(mesh.tessfaces[i].vertices[1]))
		if (len(mesh.tessfaces[i].vertices) > 3):
			f.write(',')
			f.write(str(mesh.tessfaces[i].vertices[2]))
			f.write(',')
			f.write(str(mesh.tessfaces[i].vertices[0]))
			f.write(',')
			f.write(str(mesh.tessfaces[i].vertices[3]))
		if i != len(mesh.tessfaces) - 1:
			f.write(',')
	f.write(']}\n')

f.close()
