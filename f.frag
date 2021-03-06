#version 300 es
precision mediump float;
layout(location = 0) out vec4 outputColor;

uniform float u_time;
uniform sampler2D u_fb;
uniform float u_random;
uniform vec4 u_randomCol;
uniform vec2 u_resolution;

void main() {

    vec2 nc = gl_FragCoord.xy/u_resolution;
    //ar = aspect ratio
    float ar = u_resolution.x / u_resolution.y;
    //nc.x = nc.x * ar;
    vec4 col = vec4(0.0, 1.0, 0.0, 1.0);
    vec4 lastFrame = texture(u_fb, nc);
  
    nc = (vec2(0.5) - nc) * 2.0;
    //FOUND ASPECT RATIO FIX: Apparantly I need to fix aspect ratio AFTER
    //I remap the coordinate system to -1 <> 1 !
    nc.x = nc.x * ar;
    float angle = u_random;
    float speed = u_time / 10.0;
    nc.x += cos(angle) * speed;
    nc.y += sin(angle) * speed;

    float d = distance(nc, vec2(0.0));
    float circle = smoothstep(d, d + 0.02, 0.1);
    circle = step(d, 0.15);
    //circle = smoothstep(d - 0.025, d, 0.1);
    vec4 newFrame = vec4(0.0);
    if (lastFrame.a == 0.0) {
        newFrame = circle * u_randomCol;
    }
    //vec4 newFrame = circle * u_randomCol; //* vec4(0.0, 1.0, 0.0, 1.0);

    //if (newFrame != lastFrame) {
        //newFrame.a = newFrame.a - 0.005; 
        //lastFrame.r = lastFrame.r - 0.02;
    //}

    //if (newFrame != u_randomCol) {
        //lastFrame.a = lastFrame.a - 0.005; 
        //lastFrame.r = lastFrame.r - 0.02;
        //newFrame = newFrame - 0.2; 
    //}

    outputColor = (newFrame) + lastFrame;//vec4(vColor, 1.0);//vec4(0.0824, 0.8392, 0.0824, 0.356);

}