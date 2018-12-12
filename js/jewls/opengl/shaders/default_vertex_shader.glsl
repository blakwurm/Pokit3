#version 300 es

in vec2 vertexPosition;

uniform vec2 resolution;

void main() {
	vec2 zto = vertexPosition / resolution;
	vec2 ztt = zto * 2.0;
	vec2 clip = ztt - 1.0;

	gl_Position = vec4(clip, 0, 1);
}