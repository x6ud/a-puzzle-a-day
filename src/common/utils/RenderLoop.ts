export default class RenderLoop {

    private running: boolean = false;
    private keepLoop: boolean = false;
    private lastTimestamp: number = 0;
    private readonly onUpdate: (detSecs: number) => void;

    constructor(onUpdate: (detSecs: number) => void) {
        this.onUpdate = onUpdate;
    }

    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.keepLoop = true;
        this.lastTimestamp = new Date().valueOf();
        requestAnimationFrame(() => this.loop());
    }

    stop() {
        this.keepLoop = false;
    }

    private loop() {
        const now = new Date().valueOf();
        try {
            this.onUpdate(Math.max((now - this.lastTimestamp), 1) / 1000);
        } catch (e) {
            this.running = false;
            this.keepLoop = false;
            throw e;
        }
        this.lastTimestamp = now;
        if (this.keepLoop) {
            requestAnimationFrame(() => this.loop());
        } else {
            this.running = false;
        }
    }

}
