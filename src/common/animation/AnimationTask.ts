export default class AnimationTask {

    name: string;
    step: (dt: number) => boolean;
    finished: boolean = false;
    canceled: boolean = false;
    finishedCallbacks: (() => void)[];
    canceledCallbacks: (() => void)[];

    /**
     * @param name - Can be duplicated.
     * @param step - A function that is called every frame and return true when animation ends.
     */
    constructor(name: string, step: (dt: number) => boolean) {
        this.name = name;
        this.step = step;
        this.finishedCallbacks = [];
        this.canceledCallbacks = [];
    }

    update(dt: number) {
        if (this.canceled) {
            return;
        }
        if (this.step(dt)) {
            this.triggerFinished();
        }
    }

    cancel() {
        if (this.canceled) {
            return;
        }
        this.canceled = true;
        this.canceledCallbacks.forEach(callback => callback());
    }

    triggerFinished() {
        if (this.finished || this.canceled) {
            return;
        }
        this.finished = true;
        this.finishedCallbacks.forEach(callback => callback());
    }

    onFinished(callback: () => void) {
        this.finishedCallbacks.push(callback);
        return this;
    }

    onCanceled(callback: () => void) {
        this.canceledCallbacks.push(callback);
        return this;
    }

    onFinishedOrCanceled(callback: () => void) {
        this.finishedCallbacks.push(callback);
        this.canceledCallbacks.push(callback);
        return this;
    }

}
