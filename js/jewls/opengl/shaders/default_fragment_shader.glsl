#version 300 es

precision mediump float;

uniform sampler2D image;

in uvCoord;

out pixel;

void main() {
	pixel = texture(image, uvCoord);
}