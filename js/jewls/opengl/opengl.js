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
    _gl = canvas.getContext("webgl2", { premultipliedAlpha: false, alpha: false });
    _textures = new Map();
    _actors = new Map();
    _cameras = new Map();

    if (!_gl) {
        return false;
    }

    _gl.depthFunc(_gl.LEQUAL);
    _gl.blendFunc(_gl.ONE, _gl.ONE_MINUS_SRC_ALPHA);
    _gl.enable(_gl.BLEND);
    _gl.enable(_gl.DEPTH_TEST);

    let vertexShaderSource = await fetch("/js/jewls/opengl/shaders/default_vertex_shader.glsl").then(b => b.text());
    let fragmentShaderSource = await fetch("/js/jewls/opengl/shaders/default_fragment_shader.glsl").then(b => b.text());

    let vertexShader = createShader(_gl, _gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(_gl, _gl.FRAGMENT_SHADER, fragmentShaderSource);
    let program = createProgram(_gl, vertexShader, fragmentShader);

    let positionAttributeLocation = _gl.getAttribLocation(program, "a_vertexPosition");
    let uvAttributeLocation = _gl.getAttribLocation(program, "a_uvCoord");

    let priorityUniformLocation = _gl.getUniformLocation(program, "u_priority");
    let yFlipUnifomLocation = _gl.getUniformLocation(program, "u_flip_y");
    let resolutionUniformLocation = _gl.getUniformLocation(program, "u_resolution");
    let translationUniformLocation = _gl.getUniformLocation(program, "u_translation");
    let rotationUniformLocation = _gl.getUniformLocation(program, "u_rotation");
    let scaleUniformLocation = _gl.getUniformLocation(program, "u_scale");
    let modifierUniformLocation = _gl.getUniformLocation(program, "u_uvModifier");
    let translatorUniformLocation = _gl.getUniformLocation(program, "u_uvTranslator");
    let imageUniformLocation = _gl.getUniformLocation(program, "u_image");

    _cameras.set("_main", {
        x: 0,
        y: 0,
        angle: 0,
        width: canvas.width,
        height: canvas.height,
        frameBuffer: null,
        texture: null,
        clear: null,
    });

    _programs.push({
        program: program,
        attributes: {
            vertexPosition: positionAttributeLocation,
            uvCoords: uvAttributeLocation,
        },
        uniforms: {
            priority: priorityUniformLocation,
            yFlip: yFlipUnifomLocation,
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

export function createImageTexture(name, image) {
    let tex = createTexture(image.width, image.height, image);
    _textures.set(name, tex);
}

export function createRawTexture(name, width, height, data) {
    let tex = createTexture(width, height, data);
    _textures.set(name, tex);
}

function createTexture(width, height, data) {
    let texture = _gl.createTexture();

    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, width, height, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, data);

    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);
    _gl.bindTexture(_gl.TEXTURE_2D, null);

    return {
        texture: texture,
        width: width,
        height: height,
    };
}


export function createActor(name, texture, width, height, textureLiteral = false) {
    let tex = _textures.get(texture);
    if (textureLiteral) tex = texture;
    let vertexPosition = _programs[0].attributes.vertexPosition;

    let positionBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, positionBuffer);

    let offsetX = tex.width / 2;
    let offsetY = tex.height / 2;

    let positions = [
        -offsetX, -offsetY,
        -offsetX, offsetY,
        offsetX, -offsetY,
        -offsetX, offsetY,
        offsetX, -offsetY,
        offsetX, offsetY,
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

    width = width || tex.width;
    height = height || tex.height;

    _actors.set(name, {
        texture: tex.texture,
        vertexBuffer: positionBuffer,
        vertexArray: vao,
        uvBuffer: coordBuffer,
        width: width,
        height: height,
        sheetWidth: tex.width,
        sheetHeight: tex.height,
        spriteWidth: width / tex.width, 
        spriteHeight: height / tex.height,
        sprite_x: 0,
        sprite_y: 0,
        x_translation: 0,
        y_translation: 0,
        x_scale: 1,
        y_scale: 1,
        angle: 0,
        priority: 0,
    });
}

export function deleteActor(name) {
    let actor = _actors.get(name);
    _gl.deleteVertexArray(actor.vertexArray);
    _gl.deleteBuffer(actor.vertexBuffer);
    _gl.deleteBuffer(actor.uvBuffer);
    _actors.delete(name);
}

export function setActorSprite(actor, x, y) {
    _actors.get(actor).sprite_x = x;
    _actors.get(actor).sprite_y = y;
}

export function createCamera(name, width, height, clearR, clearG, clearB, clearA) {
    const fb = _gl.createFramebuffer();
    _gl.bindFramebuffer(_gl.FRAMEBUFFER, fb);

    let tex = createTexture(width, height, null);
    _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D, tex.texture, 0);

    _cameras.set(name, {
        x: 0,
        y: 0,
        angle: 0,
        width: width,
        height: height,
        frameBuffer: fb,
        texture: tex,
        clear: {
            r: clearR,
            g: clearG,
            b: clearB,
            a: clearA,
        },
    })
}

export function createCameraView(name, camera) {
    let tex = _cameras.get(camera).texture;
    createActor(name, tex, tex.width, tex.height, true);
}

export function clear(r, g, b, a) {
    _gl.clearColor(r, g, b, a)
    _gl.clear(_gl.COLOR_BUFFER_BIT);
}

function toRad(deg) {
    return deg / 360 * 2 * Math.PI;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function rotateActor(actor, degrees) {
    _actors.get(actor).angle = degrees;
}

export function rotateCamera(camera, degrees) {
    _cameras.get(camera).angle = degrees;
}

export function translateActor(actor, x = 0, y = 0, z = 0) {
    _actors.get(actor).x_translation = x;
    _actors.get(actor).y_translation = y;
    _actors.get(actor).priority = z;
}

export function translateCamera(camera, x = 0, y = 0) {
    _cameras.get(camera).x = x;
    _cameras.get(camera).y = y;
}

export function scaleActor(actor, x, y) {
    _actors.get(actor).x_scale = x;
    _actors.get(actor).y_scale = y;
}

function checkOverlap(ox1, oy1, w1, h1, ox2, oy2, w2, h2) {
    let lx1 = ox1 - w1 / 2;
    let ly1 = oy1 - h1 / 2;
    let rx1 = lx1 + w1;
    let ry1 = ly1 + h1;

    let lx2 = ox2 - w2 / 2;
    let ly2 = oy2 - h2 / 2;
    let rx2 = lx2 + w2;
    let ry2 = ly2 + h2;

    if (lx1 > rx2 || ly1 > ry2 ||
        lx2 > rx1 || ly2 > ry1) return false;
    return true;
}

function filterMap(mapValues, filter) {
    let r = [];
    for (let v of mapValues) {
        //console.log(v);
        if (filter(v)) {
            console.log("through");
            r.push(v);
        }
    }
    return r;
}

export function render(r, g, b, a) {
    _gl.colorMask(true, true, true, true);

    let programData = _programs[0];

    for (let cameraID of _cameras.keys()) {
        if (cameraID === '_main')
            continue;
        let camera = _cameras.get(cameraID);

        _gl.bindFramebuffer(_gl.FRAMEBUFFER, camera.frameBuffer);

        _gl.viewport(0, 0, _gl.canvas.width, _gl.canvas.height);

        clear(camera.clear.r, camera.clear.g, camera.clear.b, camera.clear.a);

        _gl.useProgram(programData.program);

        for (let actor of _actors.values()) {//filterMap(_actors.values(), x => checkOverlap(camera.x, camera.y, camera.width, camera.height, x.x_translation, x.y_translation, x.width, x.height))) {
            if (actor.texture === camera.texture.texture) continue;

            _gl.bindVertexArray(actor.vertexArray);

            _gl.activeTexture(_gl.TEXTURE0);
            _gl.bindTexture(_gl.TEXTURE_2D, actor.texture);

            _gl.uniform1i(programData.uniforms.image, 0);
            _gl.uniform1f(programData.uniforms.priority, actor.priority);
            _gl.uniform1f(programData.uniforms.yFlip, 1.0);
            _gl.uniform2f(programData.uniforms.resolution, _gl.canvas.width, _gl.canvas.height);
            _gl.uniform2f(programData.uniforms.translation, actor.x_translation - camera.x, actor.y_translation - camera.y);
            _gl.uniform2f(programData.uniforms.rotation, Math.sin(toRad(actor.angle - camera.angle)), Math.cos(toRad(actor.angle - camera.angle)));
            _gl.uniform2f(programData.uniforms.scale, actor.x_scale, actor.y_scale);
            _gl.uniform2f(programData.uniforms.uvModifier, actor.spriteWidth, actor.spriteHeight);
            _gl.uniform2f(programData.uniforms.uvTranslator, actor.sprite_x * actor.spriteWidth, actor.sprite_y * actor.spriteHeight);

            _gl.drawArrays(_gl.TRIANGLES, 0, 6);
        }
    }
    _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

    let mainCamera = _cameras.get("_main");

    _gl.viewport(0, 0, _gl.canvas.width, _gl.canvas.height);

    clear(r, g, b, a);

    _gl.useProgram(programData.program);

    for (let actor of _actors.values()) {
        _gl.bindVertexArray(actor.vertexArray);

        _gl.activeTexture(_gl.TEXTURE0);
        _gl.bindTexture(_gl.TEXTURE_2D, actor.texture);

        _gl.uniform1i(programData.uniforms.image, 0);
        _gl.uniform1f(programData.uniforms.priority, actor.priority);
        _gl.uniform1f(programData.uniforms.yFlip, -1.0);
        _gl.uniform2f(programData.uniforms.resolution, _gl.canvas.width, _gl.canvas.height);
        _gl.uniform2f(programData.uniforms.translation, actor.x_translation - mainCamera.x, actor.y_translation - mainCamera.y);
        _gl.uniform2f(programData.uniforms.rotation, Math.sin(toRad(actor.angle - mainCamera.angle)), Math.cos(toRad(actor.angle - mainCamera.angle)));
        _gl.uniform2f(programData.uniforms.scale, actor.x_scale, actor.y_scale);
        _gl.uniform2f(programData.uniforms.uvModifier, actor.spriteWidth, actor.spriteHeight);
        _gl.uniform2f(programData.uniforms.uvTranslator, actor.sprite_x * actor.spriteWidth, actor.sprite_y * actor.spriteHeight);
        _gl.drawArrays(_gl.TRIANGLES, 0, 6);
    }


    _gl.colorMask(false, false, false, true);
    clear(1, 1, 1, 1);
}