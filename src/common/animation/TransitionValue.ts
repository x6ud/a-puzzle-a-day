import {linear} from './easing';

export default class TransitionValue {

    duration: number;
    from: number;
    to: number;
    easingFunction: (progress: number) => number;
    elapsed: number = 0;
    finished: boolean = false;

    constructor(
        duration: number,
        from: number,
        to: number,
        easingFunction: (progress: number) => number = linear
    ) {
        this.duration = duration;
        this.from = from;
        this.to = to;
        this.easingFunction = easingFunction;
    }

    step(dt: number): number {
        if (this.duration <= 0) {
            this.finished = true;
            return this.from;
        }
        this.elapsed += dt;
        const progress = Math.min(this.elapsed / this.duration, 1);
        this.finished = progress === 1;
        return this.easingFunction(progress) * (this.to - this.from) + this.from;
    }

}
