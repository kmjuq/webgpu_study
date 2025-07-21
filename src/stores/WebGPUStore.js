import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'

export const useWebGPUStore = defineStore('webgpu', () => {
    const gpudevice = shallowRef(null);

    const isWebGPUSupported = computed(() => {
        return gpudevice.value instanceof GPUDevice
    })

    async function initWebGPU() {
        try {
            const adapter = await navigator.gpu?.requestAdapter();
            const device = await adapter?.requestDevice();

            // 直接检查对象是否存在，而不是使用 isEmpty
            const hasAdapter = adapter !== null && adapter !== undefined;
            const hasDevice = device !== null && device !== undefined;

            if (hasAdapter && hasDevice) {
                gpudevice.value = device;
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