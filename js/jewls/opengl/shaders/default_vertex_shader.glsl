#version 300 es

in vec2 vertexPosition;
in vec2 uvCoords;

out uvCoord;

uniform vec2 resolution;
uniform vec2 uvModifier;
uniform vec2 uvTranslator;

void main() {
	vec2 zto = vertexPosition / resolution;
	vec2 ztt = zto * 2.0;
	vec2 clip = ztt - 1.0;

	gl_Position = vec4(clip * vec2(1, -1), 0, 1);
	uvCoord = uvCoords * uvModifier + uvTranslator;
}