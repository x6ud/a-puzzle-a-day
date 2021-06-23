<template>
    <router-view/>
    <div class="dialog-mask" v-if="errorMessageWindowVisible">
        <div class="dialog">
            <div style="margin-bottom: .25em">An error occurred.</div>
            <textarea readonly>{{errorMessage}}</textarea>
            <div style="text-align: right;">
                <button @click="errorMessageWindowVisible = false">Close</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./App.ts"></script>

<style lang="css">
html {
    width: 100%;
    height: 100%;
}

body {
    width: 100%;
    height: 100%;
    margin: 0;
}

#app {
    width: 100%;
    height: 100%;
    font-size: 14px;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-corner {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, .1);
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, .2);
}
</style>

<style lang="scss" scoped>
#app > .dialog-mask {
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    .dialog {
        margin: auto;
        padding: 12px;
        background: #666;
        border: solid 1px #444;
        box-shadow: 0 0 5px rgba(0, 0, 0, .2);
        color: #fff;

        textarea {
            width: 480px;
            height: 260px;
            outline: none;
            resize: none;
            border: none;
            background: #444;
            color: #fff;
        }

        button {
            box-sizing: border-box;
            padding: 4px 12px;
            border: none;
            background: #444;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: background-color .3s;

            &:hover {
                background-color: #555;
            }

            &:active {
                background-color: #222;
            }
        }
    }
}
</style>
