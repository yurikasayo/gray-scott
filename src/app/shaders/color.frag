#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 vUv2;

out vec4 outColor;

uniform sampler2D map;
uniform bool binalize;
uniform vec3 color1;
uniform vec3 color2;

void main() {
    float u = texture(map, vUv2).x;
    if (binalize) {
        u = step(0.5, u);
    }
    outColor = vec4(mix(color1, color2, u), 1.0);
}