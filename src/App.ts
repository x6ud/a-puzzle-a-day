import {defineComponent, inject, onUnmounted, ref} from 'vue';
import Signal from './common/utils/Signal';

export default defineComponent({
    setup() {
        const errorSignal = inject('errorSignal') as Signal<unknown>;
        const errorMessage = ref('');
        const errorMessageWindowVisible = ref(false);

        const showErrorMessageWindow = (error: unknown) => {
            console.error(error);
            if (error instanceof Error) {
                errorMessage.value = error.stack + '';
            } else {
                errorMessage.value = error + '';
            }
            errorMessageWindowVisible.value = true;
        };
        const onError = (e: ErrorEvent) => {
            showErrorMessageWindow(e.error);
        };
        const onUnhandledRejection = (e: PromiseRejectionEvent) => {
            showErrorMessageWindow(e.reason);
        };

        errorSignal.addListener(showErrorMessageWindow);
        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onUnhandledRejection);
        onUnmounted(() => {
            errorSignal.removeListener(showErrorMessageWindow);
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onUnhandledRejection);
        });

        return {
            errorMessage,
            errorMessageWindowVisible,
        };
    }
});