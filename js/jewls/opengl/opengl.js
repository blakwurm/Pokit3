let _programs = [];
let _gl = null;

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export async function InitializeContext(canvas) {
    _gl = canvas.getContext("webgl2");
    if (!_gl) {
        return false;
    }

    let vertexShaderSource = await fetch("shaders/default_vertex_shader.glsl").then(b => b.text());
    let fragmentShaderSource = await fetch("shaders/default_fragment_shader.glsl").then(b => b.text());

    let vertexShader = createShader(_gl, _gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(_gl, _gl.FRAGMENT_SHADER, fragmentShaderSource);
    let program = createProgram(_gl, vertexShader, fragmentShader);
}