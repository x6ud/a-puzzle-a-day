import {createApp} from 'vue';
import App from './App.vue';
import Signal from './common/utils/Signal';
import router from './router';

const app = createApp(App);
const errorSignal = new Signal();
app.config.errorHandler = function (err, instance, info) {
    errorSignal.dispatch(err);
};
app.provide('errorSignal', errorSignal);
app.use(router).mount('#app');