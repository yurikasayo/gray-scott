import { Plane } from './webgl/plane';
import { Shader } from './webgl/shader';
import vertexShader from './shaders/color.vert';
import fragmentShader from './shaders/color.frag';

export class Display {
    constructor(renderer, width, height) {
        this.renderer = renderer;
        this.size = {width, height};

        this.displayPlane = new Plane(this.renderer, 2, 2);

        this.shader = new Shader(this.renderer, vertexShader, fragmentShader);
        this.shader.createAttributes({position: 3, uv2: 2});
        this.shader.createUniforms({
            map: 'sampler2D',
            binalize: 'bool',
            color1: 'vec3',
            color2: 'vec3',
        });

        this.param = {
            binalize: false,
            color1: [0, 0, 0],
            color2: [1, 1, 1],
        };
    }

    resize(width, height) {
        this.size = {width, height};
    }

    setTexture(texture) {
        this.texture = texture;
    }

    render() {
        const uniforms = {
            map: this.texture,
            binalize: this.param.binalize,
            color1: this.param.color1,
            color2: this.param.color2,
        }
        this.renderer.resize(this.size.width, this.size.height);
        this.renderer.set(this.displayPlane, this.shader, uniforms);
        this.renderer.render({
            clearColor: [0.0, 0.0, 0.0, 1.0],
            clearDepth: 1.0,
        });
    }
}