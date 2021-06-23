import {createRouter, createWebHashHistory} from 'vue-router';
import APuzzleADay from './a-puzzle-a-day/APuzzleADay.vue';

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: APuzzleADay
        }
    ]
});

export default router;
