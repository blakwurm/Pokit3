#version 300 es

in vec2 a_vertexPosition;
in vec2 a_uvCoord;

uniform vec2 u_resolution;
uniform vec2 u_uvModifier;
uniform vec2 u_uvTranslator;

out vec2 v_uvCoord;

void main() {
	vec2 zto = a_vertexPosition / u_resolution;
	vec2 ztt = zto * 2.0;
	vec2 clip = ztt - 1.0;

	gl_Position = vec4(clip * vec2(1, -1), 0, 1);
	v_uvCoord = a_uvCoord; //* u_uvModifier + u_uvTranslator;
}