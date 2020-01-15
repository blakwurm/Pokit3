#version 300 es

precision mediump float;

in vec2 v_uvCoord;

uniform sampler2D u_image;

out vec4 pixel;

void main() {
	pixel = texture(u_image, v_uvCoord);
}