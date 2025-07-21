import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useWebGPUStore = defineStore('webgpu', () => {
    const gpudevice = shallowRef(null);
    const isWebGPUSupported = ref(false);

    async function initWebGPU() {
        try {
            const adapter = await navigator.gpu?.requestAdapter();
            const device = await adapter?.requestDevice();
            if (adapter && device) {
                gpudevice.value = device;
                isWebGPUSupported.value = true;
            } else {
                isWebGPUSupported.value = false;
            }
        } catch (error) {
            console.error('WebGPU 初始化失败:', error);
            isWebGPUSupported.value = false;
        }
    }

    // 清理资源
    function destroyWebGPU() {
        if (gpudevice.value) {
            gpudevice.value.destroy();
            gpudevice.value = null;
        }
    };

    return {
        gpudevice,
        isWebGPUSupported,
        initWebGPU,
        destroyWebGPU,
    }
}, {
    persist: {
        paths: ['isWebGPUSupported'],
        storage: localStorage,
    },
});