#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 vUv2;

out vec4 outColor;

uniform sampler2D map;
uniform vec2 resolution;

uniform vec2 center;
uniform float sourceSize;

void main() {
    vec2 d = vUv2 - center;
    d.x *= resolution.x / resolution.y;
    float intencity = 0.5 * exp(-dot(d, d) / sourceSize);

    vec2 s = texture(map, vUv2).xy;
    s.x = max(0.0, s.x - intencity);
    s.y = min(1.0, s.y + intencity);

    outColor = vec4(s, 0.0, 1.0);
}