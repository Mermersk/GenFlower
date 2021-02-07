import * as twgl from "./twgl-full.module.js"//"/twgl.js-4.16.0/dist/4.x/twgl-full.module.js"

const canvas = document.getElementById("c")

canvas.width = document.body.clientWidth - 20
canvas.height = document.body.clientHeight - 20

console.log("w: " + document.body.clientWidth)
console.log("h: " + document.body.clientHeight)

const gl = canvas.getContext("webgl2")
console.log(gl)
twgl.isWebGL2(gl) ? console.log("Webgl2 True") : console.error("Not Webgl2")

const vertexShaderSource = fetch("./v.vert").then((response => {
    return response.text().then( (text) => {
        //console.log(text)
        return text
    
    })
}))

const fragmentShaderSource = fetch("./f.frag").then((response => {
    return response.text().then( (text) => {
        //console.log(text)
        return text
    })
}))

Promise.all([vertexShaderSource, fragmentShaderSource]).then( (values) => {
    console.log(values)

    const glProgram = twgl.createProgramInfo(gl, values)
    
    const arrays = {
            a_position: { numComponents: 2, data: [
                -1, -1,
                -1, 1,
                1, -1,

                1, -1,
                1, 1,
                -1, 1
            ] },

            /*
            a_texCoord: { numComponents: 2, data: [
                0, 0,
                0, 1,
                1, 0,

                1, 0,
                1, 1,
                0, 1
            ]}
            */  
            
        }
        

    const buffers = twgl.createBufferInfoFromArrays(gl, arrays);
    console.log(buffers)

    const fb1 = twgl.createFramebufferInfo(gl);
    const fb2 = twgl.createFramebufferInfo(gl);

    let currentFB = fb1
    let ss = "fb1";

    const uniforms = {
        //u_fb: currentFB.attachments[0]
        //u_random: (Math.random() * 3.14)
        u_resolution: [canvas.width, canvas.height],
        u_randomCol: [0.0, 1.0, 0.0, 1.0]
    }
    let frameCounter = 0

    function draw(time) {

        //console.log("frame number: " + frameCounter)
        const timeInSeconds = time * 0.001;
        //console.log(timeInSeconds)
        uniforms.u_time = timeInSeconds;
        if (frameCounter % 50 == 0) uniforms.u_randomCol = [Math.random() - 0.3, Math.random(), Math.random(), 0.75];
        uniforms.u_random = (Math.random() * (3.14*2))
        //uniforms.u_randomCol = [0.0, 1.0, 0.0, 1.0];

        gl.useProgram(glProgram.program)
        gl.viewport(0, 0, canvas.width, canvas.height)
        twgl.setUniforms(glProgram, uniforms)
        twgl.setBuffersAndAttributes(gl, glProgram, buffers);
        //console.log("current fb: " + ss);

        twgl.bindFramebufferInfo(gl, currentFB)
        twgl.drawBufferInfo(gl, buffers, gl.TRIANGLES, 6);
        twgl.bindFramebufferInfo(gl, null)
        uniforms.u_fb = currentFB.attachments[0]
        twgl.drawBufferInfo(gl, buffers, gl.TRIANGLES, 6);
        //gl.drawArrays(gl.POINTS, 0, uniforms.u_numberOfVertices);

        if (currentFB === fb1) {
            currentFB = fb2
            ss = "fb2"
        } else {
            currentFB = fb1
            ss = "fb1"
        }
        frameCounter = frameCounter + 1

        requestAnimationFrame(draw)

    }

    requestAnimationFrame(draw)

    
    //const [minSize, maxSize] = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    //console.log("Min PointSize: " + minSize)
    //console.log("Min PointSize: " + maxSize)


})

/*
function firstDraw() {

    twgl.setBuffersAndAttributes(gl, glProgram, buffers)

    gl.useProgram(glProgram.program)

    gl.viewport(0, 0, canvas.width, canvas.height)

    twgl.setUniforms(glProgram, uniforms)

    twgl.bindFramebufferInfo(gl, fb1)
    gl.drawBuffers([gl.NONE, gl.COLOR_ATTACHMENT1])
    twgl.drawBufferInfo(gl, buffers)

    //uniforms.u_image = fb1.attachments[0]
    
    function draw(time) {

        let timeInSeconds = time * 0.001
        //console.log(timeInSeconds)

        gl.useProgram(glProgram.program)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        uniforms.u_time = timeInSeconds
        uniforms.u_trails = fb1.attachments[1]
        
        twgl.setUniforms(glProgram, uniforms)
        twgl.bindFramebufferInfo(gl, fb2)
        gl.drawBuffers([gl.NONE, gl.COLOR_ATTACHMENT1])
        twgl.drawBufferInfo(gl, buffers)

        twgl.bindFramebufferInfo(gl, null)
        twgl.drawBufferInfo(gl, buffers)

        let temp = fb1
        fb1 = fb2
        fb2 = temp


        requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)
}

setTimeout(firstDraw, 15)
*/

