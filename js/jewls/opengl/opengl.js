"use strict";

let _programs = [];
let _gl = null;
let _textures = null;
let _cameras = null;
let _actors = null;

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
    _textures = new Map();
    _actors = new Map();
    _cameras = new Map();

    if (!_gl) {
        return false;
    }

    let vertexShaderSource = await fetch("shaders/default_vertex_shader.glsl").then(b => b.text());
    let fragmentShaderSource = await fetch("shaders/default_fragment_shader.glsl").then(b => b.text());

    let vertexShader = createShader(_gl, _gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(_gl, _gl.FRAGMENT_SHADER, fragmentShaderSource);
    let program = createProgram(_gl, vertexShader, fragmentShader);

    let positionAttributeLocation = _gl.getAttribLocation(program, "a_vertexPosition");
    let uvAttributeLocation = _gl.getAttribLocation(program, "a_uvCoord");

    let priorityUniformLocation = _gl.getUniformLocation(program, "u_priority");
    let resolutionUniformLocation = _gl.getUniformLocation(program, "u_resolution");
    let translationUniformLocation = _gl.getUniformLocation(program, "u_translation");
    let rotationUniformLocation = _gl.getUniformLocation(program, "u_rotation");
    let scaleUniformLocation = _gl.getUniformLocation(program, "u_scale");
    let modifierUniformLocation = _gl.getUniformLocation(program, "u_uvModifier");
    let translatorUniformLocation = _gl.getUniformLocation(program, "u_uvTranslator");
    let imageUniformLocation = _gl.getUniformLocation(program, "u_image");

    _programs.push({
        program: program,
        attributes: {
            vertexPosition: positionAttributeLocation,
            uvCoords: uvAttributeLocation,
        },
        uniforms: {
            priority: priorityUniformLocation,
            resolution: resolutionUniformLocation,
            translation: translationUniformLocation,
            rotation: rotationUniformLocation,
            scale: scaleUniformLocation,
            uvModifier: modifierUniformLocation,
            uvTranslator: translatorUniformLocation,
            image: imageUniformLocation,
        },
    });

    return true;
}

export function createTexture(name, image) {
    let texture = _gl.createTexture();

    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, image);

    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
    _gl.bindTexture(_gl.TEXTURE_2D, null);

    _textures.set(name, {
        texture: texture,
        width: image.width,
        height: image.height,
    });
}

export function createActor(name, texture, priority = 0) {
    let tex = _textures.get(texture);
    let vertexPosition = _programs[0].attributes.vertexPosition;

    let positionBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, positionBuffer);

    let offsetX = _gl.canvas.width / 2 - tex.width / 2;
    let offsetY = _gl.canvas.height / 2 - tex.height / 2;

    let positions = [
        offsetX, offsetY,
        offsetX, offsetY + tex.height,
        offsetX + tex.width, offsetY,
        offsetX, offsetY + tex.height,
        offsetX + tex.width, offsetY,
        offsetX + tex.width, offsetY + tex.height,
    ];
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(positions), _gl.STATIC_DRAW);

    let vao = _gl.createVertexArray();
    _gl.bindVertexArray(vao);
    _gl.enableVertexAttribArray(vertexPosition);

    let size = 2;
    let type = _gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    _gl.vertexAttribPointer(vertexPosition, size, type, normalize, stride, offset);

    let uvCoords = _programs[0].attributes.uvCoords;

    let coordBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, coordBuffer);
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]), _gl.STATIC_DRAW);

    _gl.vertexAttribPointer(uvCoords, size, type, normalize, stride, offset);
    _gl.enableVertexAttribArray(uvCoords);

    _actors.set(name, {
        texture: texture.texture,
        vertexArray: vao,
        uvBuffer: coordBuffer,
        width: texture.width,
        height: texture.height,
        x_translation: 0,
        y_translation: 0,
        x_scale: 1,
        y_scale: 1,
        angle: 0,
        priority: priority,
    });
}

export function clear(r, g, b, a) {
    _gl.clearColor(r, g, b, a)
    _gl.clear(_gl.COLOR_BUFFER_BIT);
}

function toRad(deg) {
    return deg / 360 * 2 * Math.PI;
}

export function rotate(actor, degrees) {
    _actors.get(actor).angle = degrees;
}

export function translate(actor, x, y) {
    _actors.get(actor).x_translation = x;
    _actors.get(actor).y_translation = y;
}

export function scale(actor, x, y) {
    _actors.get(actor).x_scale = x;
    _actors.get(actor).y_scale = y;
}

export function render(r, g, b, a) {

    let programData = _programs[0];

    _gl.viewport(0, 0, _gl.canvas.width, _gl.canvas.height);

    clear(r, g, b, a);

    _gl.useProgram(programData.program);

    for (var actor of _actors.values()) {
        _gl.bindVertexArray(actor.vertexArray);

        _gl.activeTexture(_gl.TEXTURE0);
        _gl.bindTexture(_gl.TEXTURE_2D, actor.texture);

        _gl.uniform1i(programData.uniforms.image, 0);
        _gl.uniform2f(programData.uniforms.resolution, _gl.canvas.width, _gl.canvas.height);
        _gl.uniform2f(programData.uniforms.translation, actor.x_translation, actor.y_translation);
        _gl.uniform2f(programData.uniforms.rotation, Math.sin(toRad(actor.angle)), Math.cos(toRad(actor.angle)));
        _gl.uniform2f(programData.uniforms.scale, actor.x_scale, actor.y_scale);
        _gl.uniform2f(programData.uniforms.uvModifier, 1.0, 1.0);
        _gl.uniform2f(programData.uniforms.uvTranslator, 0.0, 0.0);

        _gl.drawArrays(_gl.TRIANGLES, 0, 6);
    }
}