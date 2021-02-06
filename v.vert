#version 300 es
precision mediump float;
in vec2 a_position;
//uniform int u_numberOfVertices;
uniform float u_time;


#define PI 3.141592653589793238462643383

void main() {
    

    gl_Position = vec4(a_position, 0.0, 1.0);

}