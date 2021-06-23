declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.vert' {
    const content: string;
    export default content;
}

declare module '*.frag' {
    const content: string;
    export default content;
}

declare module '*.wav' {
    const content: ArrayBuffer;
    export default content;
}

declare module '*.vue' {
    import {Component} from '@vue/runtime-core';
    const content: Component;
    export default content;
}

declare module '*.ttf' {
    const content: string;
    export default content;
}
