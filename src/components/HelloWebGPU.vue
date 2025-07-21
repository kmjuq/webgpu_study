<template>
    <canvas ref="canvasRef"></canvas>
</template>
<script setup>
import HelloWebGPUWgsl from '@/assets/HelloWebGPU.wgsl?raw';
import { onMounted, ref } from 'vue';
import { useWebGPUStore } from '@/stores/WebGPUStore';
import { storeToRefs } from 'pinia'

const webgpuStore = useWebGPUStore();
const { gpudevice, isWebGPUSupported } = storeToRefs(webgpuStore)
// 创建 canvas 引用
const canvasRef = ref(null);

onMounted(() => {
    const canvas = canvasRef.value;
    const device = gpudevice.value;
    if (isWebGPUSupported.value) {
        const context = canvas.getContext('webgpu');
        const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device,
            format: presentationFormat,
        });

        const module = device.createShaderModule({
            label: 'our hardcoded red triangle shaders',
            code: HelloWebGPUWgsl,
        });

        const pipeline = device.createRenderPipeline({
            label: 'our hardcoded red triangle pipeline',
            layout: 'auto',
            vertex: {
                module,
                entryPoint: 'vs',
            },
            fragment: {
                module,
                entryPoint: 'fs',
                targets: [{ format: presentationFormat }],
            },
        });

        const renderPassDescriptor = {
            label: 'our basic canvas renderPass',
            colorAttachments: [
                {
                    // view: <- 当我们渲染时再设置
                    clearValue: [0.3, 0.3, 0.3, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        };

        // 从当前画布上下文获取纹理并设置为目标纹理
        renderPassDescriptor.colorAttachments[0].view = context
            .getCurrentTexture()
            .createView();

        // 创建命令编码器以开始编码命令
        const encoder = device.createCommandEncoder({ label: 'our encoder' });

        // 创建一个 render pass 编码器来编码特定的命令
        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(pipeline);
        pass.draw(3); // 3次调用我们的顶点着色器
        pass.end();

        const commandBuffer = encoder.finish();
        device.queue.submit([commandBuffer]);
    }
});



</script>