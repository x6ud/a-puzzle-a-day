import AnimationTaskDispatcher from '../common/animation/AnimationTaskDispatcher';
import {easeInOutCubic, easeOutCubic} from '../common/animation/easing';
import TransitionValue from '../common/animation/TransitionValue';
import Renderer from '../common/render/Renderer';
import Texture from '../common/render/Texture';
import {GRID_SIZE, PieceDef} from './constants';

export class Piece {

    x = 0;
    y = 0;
    bottomLeftX = 0;
    bottomLeftY = 0;
    rotateOriginX = 0;
    rotateOriginY = 0;
    rotation = 0;
    mask: number[][];
    gridWidth: number;
    gridHeight: number;
    texWidth: number;
    texHeight: number;
    texture?: Texture;
    color: [number, number, number];
    hover = false;
    rotation90 = 0;
    flipX = false;
    scaleX = 1;
    animation = new AnimationTaskDispatcher();

    constructor(def: PieceDef) {
        this.mask = def.mask.map(row => row.slice());
        this.gridWidth = def.mask[0].length;
        this.gridHeight = def.mask.length;
        this.texWidth = this.gridWidth * GRID_SIZE;
        this.texHeight = this.gridHeight * GRID_SIZE;
        this.color = def.color;
    }

    init(renderer: Renderer) {
        const width = this.gridWidth;
        const height = this.gridHeight;
        const texWidth = width * GRID_SIZE;
        const texHeight = height * GRID_SIZE;
        const mask = this.mask;

        const pixels = new Uint8Array(texWidth * texHeight * 4);
        for (let i = 0, len = texWidth * texHeight; i < len; ++i) {
            const y = Math.floor(i / texWidth);
            const x = i - y * texWidth;
            const yi = Math.floor(y / GRID_SIZE);
            const xi = Math.floor(x / GRID_SIZE);
            const val = mask[yi][xi] * 0xff;
            pixels[i * 4] = val;
            pixels[i * 4 + 1] = val;
            pixels[i * 4 + 2] = val;
            pixels[i * 4 + 3] = val;
        }

        this.texture = renderer.createTextureFromRgbaPixels(
            texWidth,
            texHeight,
            pixels
        );
    }

    update(dt: number) {
        this.animation.update(dt);
        this.updatePosition();
    }

    updatePosition() {
        let bottomLeftX = this.x;
        let bottomLeftY = this.y;
        switch (this.rotation90) {
            case 1:
                bottomLeftY += this.texHeight;
                break;
            case 2:
                bottomLeftX += this.texWidth;
                bottomLeftY += this.texHeight;
                break;
            case 3:
                bottomLeftX += this.texWidth;
                break;
        }
        bottomLeftX -= this.rotateOriginX + this.x;
        bottomLeftY -= this.rotateOriginY + this.y;
        const angle = this.rotation90 * 90 / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        [bottomLeftX, bottomLeftY] = [
            cos * bottomLeftX - sin * bottomLeftY,
            sin * bottomLeftX + cos * bottomLeftY
        ];
        bottomLeftX += this.rotateOriginX + this.x;
        bottomLeftY += this.rotateOriginY + this.y;
        this.bottomLeftX = bottomLeftX;
        this.bottomLeftY = bottomLeftY;
    }

    isMouseOver(mouseX: number, mouseY: number) {
        const bottomLeftX = this.bottomLeftX;
        const bottomLeftY = this.bottomLeftY;
        if (mouseX < bottomLeftX || mouseX > bottomLeftX + this.gridWidth * GRID_SIZE
            || mouseY < bottomLeftY || mouseY > bottomLeftY + this.gridHeight * GRID_SIZE
        ) {
            return false;
        }
        const mask = this.mask;
        for (let yi = 0, rows = mask.length; yi < rows; ++yi) {
            const row = mask[yi];
            for (let xi = 0, cols = row.length; xi < cols; ++xi) {
                const val = row[xi];
                if (!val) {
                    continue;
                }
                const gridBottomLeftX = bottomLeftX + xi * GRID_SIZE;
                const gridBottomLeftY = bottomLeftY + (rows - 1 - yi) * GRID_SIZE;
                if (mouseX >= gridBottomLeftX
                    && mouseX <= gridBottomLeftX + GRID_SIZE
                    && mouseY >= gridBottomLeftY
                    && mouseY <= gridBottomLeftY + GRID_SIZE) {
                    return true;
                }
            }
        }
        return false;
    }

    rotate90(mouseX: number, mouseY: number) {
        const gridWidth = this.gridWidth;
        const gridHeight = this.gridHeight;
        const mask = this.mask;
        const newMask: number[][] = [];
        for (let yi1 = 0, rows = mask.length; yi1 < rows; ++yi1) {
            const row = mask[yi1];
            for (let xi1 = 0, cols = row.length; xi1 < cols; ++xi1) {
                const val = row[xi1];
                const xi2 = yi1;
                const yi2 = gridWidth - 1 - xi1;
                newMask[yi2] = newMask[yi2] || [];
                newMask[yi2][xi2] = val;
            }
        }
        this.mask = newMask;
        [this.gridWidth, this.gridHeight] = [gridHeight, gridWidth];

        let x0 = -this.rotateOriginX;
        let y0 = -this.rotateOriginY;
        const angle = this.rotation90 * 90 / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        [x0, y0] = [
            x0 * cos - y0 * sin,
            x0 * sin + y0 * cos
        ];
        x0 += this.rotateOriginX;
        y0 += this.rotateOriginY;
        x0 += this.x;
        y0 += this.y;

        x0 -= mouseX;
        y0 -= mouseY;
        [x0, y0] = [
            x0 * cos - y0 * (-sin),
            x0 * (-sin) + y0 * cos
        ];
        x0 += mouseX;
        y0 += mouseY;
        this.x = x0;
        this.y = y0;

        this.rotation90 = (this.rotation90 + 1) % 4;
        let cx = mouseX - this.x;
        let cy = mouseY - this.y;
        this.rotateOriginX = cx;
        this.rotateOriginY = cy;

        const transition = new TransitionValue(
            .3,
            (this.rotation90 - 1) * 90 / 180 * Math.PI,
            this.rotation90 * 90 / 180 * Math.PI,
            easeOutCubic
        );
        return this.animation
            .cancel('rotation')
            .create('rotation', dt => {
                this.rotation = transition.step(dt);
                return transition.finished;
            });
    }

    setBottomLeftPosition(x: number, y: number) {
        const x0 = this.x;
        const y0 = this.y;
        x -= this.rotateOriginX + this.x;
        y -= this.rotateOriginY + this.y;
        const angle = -this.rotation90 * 90 / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        [x, y] = [
            x * cos - y * sin,
            x * sin + y * cos
        ];
        x += this.rotateOriginX + this.x;
        y += this.rotateOriginY + this.y;
        switch (this.rotation90) {
            case 1:
                y -= this.texHeight;
                break;
            case 2:
                x -= this.texWidth;
                y -= this.texHeight;
                break;
            case 3:
                x -= this.texWidth;
                break;
        }
        this.x = x;
        this.y = y;
        const detX = x - x0;
        const detY = y - y0;
        this.rotateOriginX -= detX;
        this.rotateOriginY -= detY;
    }

    flip() {
        if (this.rotation90 % 2) {
            this.mask.reverse();
        } else {
            this.mask.forEach(row => row.reverse());
        }
        const flipX = this.flipX;
        const transition = new TransitionValue(
            .3,
            -1,
            1,
            easeInOutCubic
        );
        return this.animation
            .cancel('scaleX')
            .create('scaleX', dt => {
                const t = transition.step(dt);
                this.scaleX = Math.abs(t);
                if (t > 0) {
                    this.flipX = !flipX;
                }
                return transition.finished;
            });
    }

}