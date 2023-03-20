import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
import SimplexNoise from 'simplex-noise';
import hsl from 'hsl-to-hex';
import debounce from 'debounce';

// Random number function
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Map function
function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

// Orb class
class Orb {
    constructor(fill = 0x000000) {
        this.bounds = this.setBounds();
        this.x = random(this.bounds['x'].min, this.bounds['x'].max);
        this.y = random(this.bounds['y'].min, this.bounds['y'].max);
        this.scale = 1;
        this.fill = fill;
        this.radius = random(window.innerHeight / 6, window.innerHeight / 3);
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);
        this.inc = 0.002;
        this.graphics = new Graphics();
        this.graphics.alpha = 0.825;
        window.addEventListener(
            'resize',
            () => {
                this.bounds = this.setBounds();
            }, 
            { passive: true }
        );
    }

    setBounds() {
        const maxDist = window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
        const originX = window.innerWidth / 1.25;
        const originY = window.innerWidth < 1000
            ? window.innerHeight
            : window.innerHeight / 1.375;
        return {
            x: {
                min: originX - maxDist,
                max: originX + maxDist
            },
            y: {
                min: originY - maxDist,
                max: originY + maxDist
            }
        };
    }

    update() {
        const xNoise = simplex.noise2D(this.xOff, this.xOff);
        const yNoise = simplex.noise2D(this.yOff, this.yOff);
        const scaleNoise = simplex.noise2D(this.xOff, this.yOff);
        this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
        this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
        this.scale = map(scaleNoise, -1, 1, 0.5, 1);
        this.xOff += this.inc;
        this.yOff += this.inc;
    }

    render() {
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.scale.set(this.scale);
        this.graphics.clear();
        this.graphics.beginFill(this.fill);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
    }
}

// Create a new simplex noise instance
const simplex = new SimplexNoise();

// PixiJS app
const app = new Application({
    view: document.querySelector('.orb-canvas'),
    resizeTo: window,
    transparent: true,
});

// Create orbs
const orbs = [];

for (let i = 0; i < 10; i++) {
  const orb = new Orb(0x000000);
  app.stage.addChild(orb.graphics);
  orbs.push(orb);
}

// Animate orbs
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    app.ticker.add(() => {
      orbs.forEach((orb) => {
        orb.update();
        orb.render();
      });
    });
} else {
    orbs.forEach((orb) => {
      orb.update();
      orb.render();
    });
}

// Add blur filter to stage
app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

const PixiOrbs = () => {

    useEffect(() => {
        return () => {
            app.destroy(true)
        }
    }, [])

    return (
        <div className="orb-canvas"></div>
    )
}

export default PixiOrbs;