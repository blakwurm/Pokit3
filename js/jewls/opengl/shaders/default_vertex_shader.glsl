#version 300 es

in vec2 a_vertexPosition;
in vec2 a_uvCoord;

uniform float u_priority;
uniform float u_flip_y;
uniform vec2 u_size;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
uniform vec2 u_uvModifier;
uniform vec2 u_uvTranslator;

out vec2 v_uvCoord;

void main() {
	vec2 rotatedOrigin = vec2(
		a_vertexPosition.x * u_rotation.y + a_vertexPosition.y * u_rotation.x,
		a_vertexPosition.y * u_rotation.y - a_vertexPosition.x * u_rotation.x);
	vec2 position = rotatedOrigin + u_translation;
	vec2 zto = position / u_resolution;
	vec2 ztt = zto * 2.0;
	vec2 clip = ztt - 1.0;
	vec2 scaledClip = clip * u_scale;

	gl_Position = vec4(scaledClip * vec2(1, u_flip_y), u_priority / 100.0, 1);
	v_uvCoord = a_uvCoord * u_uvModifier + u_uvTranslator;
}