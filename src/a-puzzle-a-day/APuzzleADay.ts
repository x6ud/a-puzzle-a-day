import {defineComponent, onMounted, onUnmounted, ref} from 'vue';
import Renderer from '../common/render/Renderer';
import RenderLoop from '../common/utils/RenderLoop';
import Input from './Input';
import Puzzle from './Puzzle';

export default defineComponent({
    setup() {
        const canvas = ref<HTMLCanvasElement>();

        const input = new Input();
        const renderLoop = new RenderLoop(update);
        let renderer: Renderer;
        const puzzle = new Puzzle();

        // =========================== mounted ===========================
        onMounted(function () {
            if (!canvas.value) {
                throw new Error('Failed to create canvas');
            }
            document.title = 'A Puzzle A Day';
            input.setup(canvas.value);
            renderer = new Renderer(canvas.value);
            autoResizeCanvas();
            puzzle.init(renderer);
            renderLoop.start();
        });

        // =========================== unmounted ===========================
        onUnmounted(function () {
            renderLoop.stop();
            input.unload(renderer.canvas);
        });

        // =========================== auto resize canvas ===========================
        function autoResizeCanvas() {
            if (renderer) {
                const rect = document.body.getBoundingClientRect();
                renderer.resizeCanvas(rect.width, rect.height);
            }
        }

        const autoResizeCanvasTid = setInterval(autoResizeCanvas, 100);
        onUnmounted(function () {
            clearInterval(autoResizeCanvasTid);
        });

        // =========================== update ===========================
        function update(dt: number) {
            puzzle.update(renderer, input, dt);
            input.update();
        }

        return {canvas};
    }
});