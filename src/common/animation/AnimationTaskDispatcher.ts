import AnimationTask from './AnimationTask';
import TransitionValue from './TransitionValue';

export default class AnimationTaskDispatcher {

    private animations: AnimationTask[] = [];

    constructor() {
    }

    update(dt: number) {
        this.animations.forEach(animation => animation.update(dt));
        this.animations = this.animations.filter(animation => !(animation.finished || animation.canceled));
    }

    isPlaying(name: string) {
        return this.animations.findIndex(animation => animation.name === name && !(animation.finished || animation.canceled)) >= 0;
    }

    reset() {
        this.animations = [];
    }

    cancel(name: string) {
        this.animations.forEach(animation => {
            if (animation.name === name) {
                animation.cancel();
            }
        });
        return this;
    }

    create(name: string, step: (dt: number) => boolean) {
        const animation = new AnimationTask(name, step);
        this.animations.push(animation);
        return animation;
    }

    /**
     * Create an animation that ends when all children animations ends.
     */
    sync(name: string, ...animations: AnimationTask[]) {
        const combined = new AnimationTask(name, () => false);
        this.animations.push(combined);

        let unfinished = animations.length;
        animations.forEach(animation => {
            animation
                .onFinishedOrCanceled(() => {
                    unfinished -= 1;
                    if (unfinished === 0) {
                        combined.triggerFinished();
                    }
                });
        });
        combined.onCanceled(() => {
            animations.forEach(animation => animation.cancel());
        });
        return combined;
    }

    /**
     * Create an animation that ends after a specified time.
     */
    delay(name: string, time: number) {
        const transition = new TransitionValue(time, 0, 1);
        return this.create(name, (dt) => {
            transition.step(dt);
            return transition.finished;
        });
    }

    isEmpty() {
        return this.animations.length < 1;
    }

}
