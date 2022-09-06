import GUI from 'lil-gui';
import * as Stats from 'stats-js';
import { Renderer } from './webgl/renderer';
import { Display } from './display';
import { Simulator } from './simulator';

export class MyApp {
    constructor(canvas, debug) {
        this.canvas = canvas;
        this.debug = debug;

        this.setSize();

        this.renderer = new Renderer(canvas);
        this.display = new Display(this.renderer, canvas.width, canvas.height);
        this.simulator = new Simulator(this.renderer, this.textureSize);

        this.mouse = {x: 0, y: 0, down: false};
        window.addEventListener('resize', this.resize.bind(this));
        this.canvas.addEventListener('mousemove', e => this.mousemove(e));
        this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseup.bind(this));
        this.canvas.addEventListener('touchmove', e => this.touchmove(e));

        this.setGui();
        if (this.debug) {
            this.setStats();
        }

        this.loop();
    }

    setSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.canvas.width = Math.floor(width * pixelRatio);
        this.canvas.height = Math.floor(height * pixelRatio);

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.textureSize = {
            width: Math.floor(this.canvas.width / 2.0),
            height: Math.floor(this.canvas.height / 2.0)
        };
    }

    resize() {
        this.setSize();
        this.display.resize(this.canvas.width, this.canvas.height);
        this.simulator.resize(this.textureSize);
    }

    mousemove(e) {
        if (this.mouse.down == true) {
            this.mouse.x = e.x;
            this.mouse.y = window.innerHeight - e.y;
            this.simulator.addSource(
                [this.mouse.x / window.innerWidth, this.mouse.y / window.innerHeight]
            )
        }
    }

    mousedown() {
        this.mouse.down = true;
    }

    mouseup() {
        this.mouse.down = false;
    }

    touchmove(e) {
        e.preventDefault();
        const touches = e.touches;

        this.mouse.x = touches[0].pageX;
        this.mouse.y = window.innerHeight - touches[0].pageY;

        this.simulator.addSource(
            [this.mouse.x / window.innerWidth, this.mouse.y / window.innerHeight]
        );
    }

    loop() {
        requestAnimationFrame(this.loop.bind(this));

        if (this.debug) {
            this.stats.end();
            this.stats.begin();
        }
        this.simulator.simulate();
        this.display.setTexture(this.simulator.source.texture);
        this.display.render();
    }

    setGui() {
        this.gui = new GUI();
        this.gui.addColor(this.display.param, "color1", 1.0);
        this.gui.addColor(this.display.param, "color2", 1.0);
        this.gui.add(this.simulator.param, "D1").min(0.1).max(0.2).step(0.001);
        this.gui.add(this.simulator.param, "D2").min(0.05).max(0.15).step(0.001);
        this.gui.add(this.simulator.param, "f").min(0.025).max(0.045).step(0.0001);
        this.gui.add(this.simulator.param, "k").min(0.06).max(0.07).step(0.0001);
        this.gui.add(this.simulator.param, "sourceSize").min(0.0001).max(0.05).step(0.0001);
        this.gui.add(this.simulator.param, "sourceSize").min(0.0001).max(0.05).step(0.0001);
        this.gui.add(this.simulator.param, "reset");
    }

    setStats() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        this.stats.dom.style.pointerEvents = 'none';
        this.stats.dom.style.userSelect = 'none';
        document.body.appendChild(this.stats.dom);
    }
}