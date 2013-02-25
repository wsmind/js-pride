import bpy
import random
import math

f = open("build/meshes.js", "w")

for mesh in bpy.data.meshes:
	#f.write(mesh.name + "MeshBuffer=")
	#f.write("[")
	#for vertex in mesh.vertices:
	#	f.write(str(vertex.co.x) + ", " + str(vertex.co.y) + ", " + str(vertex.co.z) + ", ")
	#f.write("]\n")
	
	f.write(mesh.name + "MeshBuffer=")
	f.write("[")
	for edge in mesh.edges:
		vertex0 = mesh.vertices[edge.vertices[0]]
		vertex1 = mesh.vertices[edge.vertices[1]]
		coords = [vertex0.co.x, vertex0.co.y, vertex0.co.z, vertex1.co.x, vertex1.co.y, vertex1.co.z]
		for value in coords:
			value = math.floor(value * 100)
			f.write(str(value) + ",")
		
		#f.write(str(vertex0.co.x)[:precision] + ", " + str(vertex0.co.y)[:precision] + ", " + str(vertex0.co.z)[:precision] + ", ")
		#f.write(str(vertex1.co.x)[:precision] + ", " + str(vertex1.co.y)[:precision] + ", " + str(vertex1.co.z)[:precision] + ", ")
	f.write("]\n")
	
    #file.write("[")
    #for item in mesh.vertex_colors["Col"].data:
    #    file.write(str(item.color1.r) + ", " + str(item.color1.g) + ", " + str(item.color1.b) + ", ")
    #file.write("]\n")

f.close()
