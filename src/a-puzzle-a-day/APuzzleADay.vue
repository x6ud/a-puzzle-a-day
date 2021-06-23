<template>
    <div class="a-puzzle-a-day">
        <canvas ref="canvas"></canvas>

        <div class="link">
            Original: <a href="https://www.dragonfjord.com/product/a-puzzle-a-day/" target="_blank">https://www.dragonfjord.com/product/a-puzzle-a-day/</a>
        </div>
    </div>
</template>

<script lang="ts" src="./APuzzleADay.ts"></script>

<style lang="scss" scoped>
.a-puzzle-a-day {
    width: 100%;
    height: 100%;
    background: #f2f2f2;

    .link {
        position: fixed;
        z-index: 1;
        left: 8px;
        top: 8px;
        color: rgba(0, 0, 0, .5);
        user-select: none;

        a {
            text-decoration: none;
            color: #409eff;
        }
    }
}
</style>