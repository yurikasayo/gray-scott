#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 vUv2;

out vec4 outColor;

uniform sampler2D map;
uniform vec2 resolution;

uniform vec2 D;
uniform float f;
uniform float k;

void main() {
    vec2 pix = 1.0 / resolution;

    vec2 s0 = texture(map, vUv2).xy;
    vec2 s1 = texture(map, vUv2 + vec2(pix.x, 0.0)).xy;
    vec2 s2 = texture(map, vUv2 - vec2(pix.x, 0.0)).xy;
    vec2 s3 = texture(map, vUv2 + vec2(0.0, pix.y)).xy;
    vec2 s4 = texture(map, vUv2 - vec2(0.0, pix.y)).xy;
    
    vec2 lap = (s1 + s2 + s3 + s4 - 4.0 * s0) / 1.0 * 1.0;

    vec2 s;
    s.x = max(0.0, min(1.0, s0.x + D.x * lap.x - s0.x * s0.y * s0.y + f * (1.0 - s0.x)));
    s.y = max(0.0, min(1.0, s0.y + D.y * lap.y + s0.x * s0.y * s0.y - (f + k) * s0.y));

    outColor = vec4(s, 0.0, 1.0);
}