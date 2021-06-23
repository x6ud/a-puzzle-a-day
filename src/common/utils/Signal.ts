interface Listener<T> {
    (obj: T): void;
}

export default class Signal<T> {

    private listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>) {
        this.listeners.push(listener);
    }

    removeListener(listener: Listener<T>) {
        const index = this.listeners.findIndex(curr => curr === listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }

    dispatch(obj: T) {
        this.listeners.forEach(listener => listener(obj));
    }

}
