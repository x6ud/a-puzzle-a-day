import Label from '../common/render/Label';
import Renderer from '../common/render/Renderer';
import {BOARD, COLS, FONT_SIZE, GRID_SIZE, MONTHS, PIECES, ROWS} from './constants';
import Input from './Input';
import {Piece} from './Piece';

export default class Puzzle {

    tips: Label;
    grids: Label[][] = BOARD.map(row => row.map(text => {
        const label = new Label();
        label.text = text;
        label.color = 'black';
        label.fontSize = FONT_SIZE;
        return label;
    }));
    pieces: Piece[] = PIECES.map(def => new Piece(def));

    draggingPieceIndex = -1;
    dragStartMouseX = 0;
    dragStartMouseY = 0;
    dragStartDx = 0;
    dragStartDy = 0;

    todayMonth: string;
    todayDay: string;

    constructor() {
        // =========================== tips ===========================
        const tips = this.tips = new Label();
        tips.multiline = true;
        tips.text = 'Right Click: Rotate\n\tDouble Click: Flip';
        tips.color = 'rgba(0,0,0,.5)';
        tips.fontSize = 12;

        // =========================== today ===========================
        const today = new Date();
        const month = this.todayMonth = MONTHS[today.getMonth()];
        const day = this.todayDay = today.getDate().toString();
        this.grids.forEach(row => row.forEach(label => {
            if (label.text === month || label.text === day) {
                label.fontWeight = 'bold';
                label.color = 'black';
            } else {
                label.color = 'rgba(0,0,0,.5)';
            }
        }));

        // =========================== arrange pieces ===========================
        const width = ROWS * GRID_SIZE;
        const height = COLS * GRID_SIZE;
        let hl = 0;
        let hr = 0;
        const marginY = .5;
        this.pieces.forEach((piece, index) => {
            if (index < PIECES.length / 2) {
                piece.x = -GRID_SIZE - piece.gridWidth * GRID_SIZE;
                hl += piece.gridHeight + marginY;
            } else {
                piece.x = width + GRID_SIZE;
                hr += piece.gridHeight + marginY;
            }
        });
        hl -= marginY;
        hr -= marginY;
        const dyl = (height - hl * GRID_SIZE) / 2;
        const dyr = (height - hr * GRID_SIZE) / 2;
        let yl = 0;
        let yri = 0;
        this.pieces.forEach((piece, index) => {
            if (index < PIECES.length / 2) {
                piece.y = yl * GRID_SIZE + dyl;
                yl += piece.gridHeight + marginY;
            } else {
                piece.y = yri * GRID_SIZE + dyr;
                yri += piece.gridHeight + marginY;
            }
        });
    }

    init(renderer: Renderer) {
        // =========================== create texture ===========================
        this.pieces.forEach(piece => piece.init(renderer));
    }

    update(renderer: Renderer, input: Input, dt: number) {
        const boardWidth = ROWS * GRID_SIZE;
        const boardHeight = COLS * GRID_SIZE;
        const boardX = (renderer.state.width - boardWidth) / 2;
        const boardY = (renderer.state.height - boardHeight) / 2;
        const boardRelatedMouseX = input.mouseX - boardX;
        const boardRelatedMouseY = renderer.state.height - input.mouseY - boardY;
        const pieces = this.pieces;

        let hoverPieceIndex = -1;

        if (this.draggingPieceIndex >= 0) {
            const draggingPiece = pieces[this.draggingPieceIndex];

            if (input.mouseLeft) {
                // =========================== dragging ===========================
                hoverPieceIndex = this.draggingPieceIndex;
                draggingPiece.x = this.dragStartDx + boardRelatedMouseX - this.dragStartMouseX;
                draggingPiece.y = this.dragStartDy + boardRelatedMouseY - this.dragStartMouseY;
            } else {
                // =========================== drag end ===========================
                this.draggingPieceIndex = -1;
                this.snapToGrid(draggingPiece);
            }

            // =========================== flip ===========================
            if (input.dblClickThisFrame) {
                draggingPiece.flip().onFinished(() => {
                    this.snapToGrid(draggingPiece);
                });
            }
        } else {
            // =========================== hover ===========================
            for (let i = 0, len = pieces.length; i < len; ++i) {
                const piece = pieces[i];
                if (hoverPieceIndex >= 0) {
                    piece.hover = false;
                } else {
                    piece.hover = piece.isMouseOver(boardRelatedMouseX, boardRelatedMouseY);
                    if (piece.hover) {
                        hoverPieceIndex = i;
                    }
                }
            }

            // =========================== drag start ===========================
            if (hoverPieceIndex >= 0 && input.mouseLeft) {
                this.draggingPieceIndex = hoverPieceIndex;
                this.dragStartMouseX = boardRelatedMouseX;
                this.dragStartMouseY = boardRelatedMouseY;
                const draggingPiece = pieces[hoverPieceIndex];
                this.dragStartDx = draggingPiece.x;
                this.dragStartDy = draggingPiece.y;
            }
        }

        // =========================== rotate ===========================
        if (hoverPieceIndex >= 0 && input.mouseRightDownThisFrame) {
            const piece = pieces[hoverPieceIndex];
            piece.rotate90(boardRelatedMouseX, boardRelatedMouseY)
                .onFinished(() => {
                    this.snapToGrid(piece);
                });
        }

        // =========================== update ===========================
        for (let i = 0, len = pieces.length; i < len; ++i) {
            const piece = pieces[i];
            piece.update(dt);
        }

        // =========================== render ===========================
        renderer.centerCamera();
        renderer.clearColor(1, 1, 1, 1);
        renderer.clear(true, false, false);

        renderer.begin2D();

        renderer.blendMode(renderer.BLEND_MODE_PIGMENT);

        // =========================== tips ===========================
        renderer.setColor(1, 1, 1, 1);
        renderer.drawLabel(
            this.tips,
            boardX,
            boardY + boardHeight + 4
        );

        // =========================== board grids ===========================
        renderer.setColor(0xf2 / 0xff, 0xf2 / 0xff, 0xf2 / 0xff, 1);
        const grids = this.grids;
        for (let yi = 0; yi < ROWS; ++yi) {
            const row = grids[yi];
            for (let xi = 0, cols = row.length; xi < cols; ++xi) {
                renderer.drawRect(
                    renderer.BLANK_WHITE,
                    boardX + xi * GRID_SIZE,
                    boardY + boardHeight - (yi + 1) * GRID_SIZE,
                    GRID_SIZE,
                    GRID_SIZE
                );
            }
        }

        // =========================== board text ===========================
        renderer.setColor(1, 1, 1, 1);
        for (let yi = 0; yi < ROWS; ++yi) {
            const row = grids[yi];
            for (let xi = 0, cols = row.length; xi < cols; ++xi) {
                const label = row[xi];
                renderer.drawLabel(
                    label,
                    boardX + xi * GRID_SIZE + (GRID_SIZE - label.width) / 2,
                    boardY + boardHeight - (yi + 1) * GRID_SIZE + (GRID_SIZE - label.height) / 2,
                );
            }
        }

        // =========================== pieces ===========================
        for (let i = 0, len = pieces.length; i < len; ++i) {
            const piece = pieces[i];
            if (piece.texture) {
                renderer.setColor(piece.color[0], piece.color[1], piece.color[2], piece.hover ? .75 : .5);
                renderer.draw(
                    piece.texture,
                    boardX + piece.x,
                    boardY + piece.y,
                    piece.texture.width,
                    piece.texture.height,
                    piece.flipX,
                    false,
                    0,
                    0,
                    piece.texture.width,
                    piece.texture.height,
                    0,
                    0,
                    boardX + piece.x + piece.rotateOriginX,
                    boardY + piece.y + piece.rotateOriginY,
                    piece.rotation,
                    piece.scaleX,
                    1
                );
            }
        }

        renderer.end2D();
    }

    snapToGrid(piece: Piece) {
        const xi = Math.round(piece.bottomLeftX / GRID_SIZE);
        const yi = Math.round(piece.bottomLeftY / GRID_SIZE);
        if (xi >= 0 && xi + piece.gridWidth <= COLS
            && yi >= 0 && yi + piece.gridHeight <= ROWS
        ) {
            piece.setBottomLeftPosition(xi * GRID_SIZE, yi * GRID_SIZE);
        }
    }

}