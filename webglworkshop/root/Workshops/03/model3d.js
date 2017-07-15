/** tranformation matrix
 * vertices
 * normals
 * tris
 */
 function Model3d() {
    this.rotation = mat4.create([1,0,0,0,
                                 0,1,0,0,
                                 0,0,1,0,
                                 0,0,0,1]);

    this.position = vec3.create([0,0,0]);
    this.velocity = vec3.create([0,0,0]);
    this.rvelocity = vec3.create([0,0,0]);

    this.mesh = {                                 
        vertexPositions : [],
        vertexNormals : [],
        vertexTextureCoords : [],
        indices : []
    }
    this.vertexPositionBuffer;
    this.vertexColorBuffer;
    this.vertexNormalBuffer;
    this.vertexIndexBuffer;
    this.vertexTextureCoordBuffer;
    this.currentTexture;
    this.name="";
    this.texture = null;
    
    this.scale = vec3.create([1.0,1.0,1.0]);
}

function Scene() {
    this.rotation = mat4.create([1,0,0,0,
                                 0,1,0,0,
                                 0,0,1,0,
                                 0,0,0,1]);

    this.position = vec3.create([0,0,0]);
    this.velocity = vec3.create([0,0,0]);
    this.rvelocity = vec3.create([0,0,0]);
    
    this.models = [];
}