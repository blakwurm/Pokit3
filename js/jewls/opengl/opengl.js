let _programs = [];
let _gl = null;
let _actors = null;
let _texture = -1;

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
    _actors = new Map();

    if (!_gl) {
        return false;
    }

    let vertexShaderSource = await fetch("shaders/default_vertex_shader.glsl").then(b => b.text());
    let fragmentShaderSource = await fetch("shaders/default_fragment_shader.glsl").then(b => b.text());

    let vertexShader = createShader(_gl, _gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(_gl, _gl.FRAGMENT_SHADER, fragmentShaderSource);
    let program = createProgram(_gl, vertexShader, fragmentShader);

    let positionAttributeLocation = _gl.getAttribLocation(program, "vertexPosition");
    let uvAttributeLocation = _gl.getAttribLocation(program, "uvCoords");

    let resolutionUniformLocation = _gl.getUniformLocation(program, "resolution");
    let modifierUniformLocation = _gl.getUniformLocation(program, "uvModifier");
    let translatorUniformLocation = _gl.getUniformLocation(program, "uvTranslator");

    programs.push({
        program: program,
        attributes: {
            vertexPosition: positionAttributeLocation,
            uvCoords: uvAttributeLocation,
        },
        uniforms: {
            resolution: resolutionUniformLocation,
            uvModifier: modifierUniformLocation,
            uvTranslator: translatorUniformLocation,
        },
    });

    _gl.viewport(0, 0, canvas.width, canvas.height);
}

function createActor(texture) {
    let vertexPosition = programs[0].attributes.vertexPosition;

    let positionBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, positionBuffer);

    let positions = [
        0, 0,
        0, texture.height,
        texture.width, 0,
        texture.width, 0,
        texture.width, texture.height,
        0, 0,
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

    let uvCoords = programs[0].attributes.uvCoords;
}

export function clear(r, g, b, a) {
    _gl.clearColor(r, g, b, a)
    _gl.clear(_gl.COLOR_BUFFER_BIT);
}

export function render() {
    _gl.useProgram(programs[0].program);
    _gl.uniform2f(programs[0].uniforms.resolution, _gl.canvas.width, _gl.canvas.height);
}

export function createTexture(img) {
    _texture += 1;

    let texture = _gl.createTexture();
    _gl.bindTexture(_gl.TEXTURE_2D, texture);

    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);

    let mipLevel = 0;
    let internalFormat = _gl.RGBA;
    let srcFormat = _gl.RGBA;
    let srcType = _gl.UNSIGNED_BYTE;
    _gl.texImage2D(_gl.TEXTURE_2D, mipLevel, internalForamt, srcFormat, srcType, img);

    return {
        texture: texture,
        width: img.width,
        height: img.height,
    };
}