<template>
    <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useWebGPUStore } from '@/stores/WebGPUStore';
import { storeToRefs } from 'pinia'
import { getCurrentInstance } from 'vue';

const webgpuStore = useWebGPUStore();
const { gpudevice, isWebGPUSupported } = storeToRefs(webgpuStore)
// 创建 canvas 引用
const canvasRef = ref(null);

const props = defineProps({
    setupCanvasCtx: {
        type: Function,
        required: true
    },
    setupGPUPipeline: {
        type: Function,
        required: true
    }
});

onMounted(async () => {
    const canvas = canvasRef.value;
    const device = gpudevice.value;
    try {
        if (isWebGPUSupported.value) {
            // 调用传入的 canvas 设置函数
            const canvasCtx = props.setupCanvasCtx(canvas);

            // 调用传入的 GPU 渲染函数
            await props.setupGPUPipeline(device, canvasCtx);
        }
    } catch (error) {
        console.error(getCurrentInstance().type.__name, 'GPU 流水线过程失败:', error);
    }
});
</script>