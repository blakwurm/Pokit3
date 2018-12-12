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

export async function initContext(canvas) {
    _gl = canvas.getContext("webgl2");
    if (!_gl) {
        return false;
    }

    let vertexShaderSource = await fetch("shaders/default_vertex_shader.glsl").then(b => b.text());
    let fragmentShaderSource = await fetch("shaders/default_fragment_shader.glsl").then(b => b.text());

    let vertexShader = createShader(_gl, _gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(_gl, _gl.FRAGMENT_SHADER, fragmentShaderSource);
    let program = createProgram(_gl, vertexShader, fragmentShader);

    let positionAttributeLocation = _gl.getAttribLocation(program, "vertexPosition");
    let resolutionUniformLocation = _gl.getUniformLocation(program, "resolution");

    programs.push({
        program: program,
        attributes: {
            vertexPosition: positionAttributeLocation,
        },
        uniforms: {
            resolution: resolutionUniformLocation,
        },
    });

    _gl.viewport(0, 0, canvas.width, canvas.height);
}

function initBuffers() {
    let vertexPosition = programs[0].attributes.vertexPosition;

    let positionBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, positionBuffer);

    let positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
    ];
    _gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), _gl.STATIC_DRAW);

    let vao = _gl.createVertexArray();
    _gl.bindVertexArray(vao);
    _gl.enableVertexAttribArray(vertexPosition);

    let size = 2;
    let type = _gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    _gl.vertexAttribPointer(vertexPosition, size, type, normalize, stride, offset);
}

export function clear(r, g, b, a) {
    _gl.clearColor(r, g, b, a)
    _gl.clear(_gl.COLOR_BUFFER_BIT);
}

export function render() {
    _gl.useProgram(programs[0].program);
    _gl.uniform2f(programs[0].uniforms.resolution, _gl.canvas.width, _gl.canvas.height);
}