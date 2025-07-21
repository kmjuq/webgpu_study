<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
<script setup>
import HelloGPGPUwgsl from '@/assets/HelloGPGPU.wgsl?raw'
import { onMounted, ref } from 'vue';
import { useWebGPUStore } from '@/stores/WebGPUStore';
import { storeToRefs } from 'pinia'

const webgpuStore = useWebGPUStore();
const { gpudevice, isWebGPUSupported } = storeToRefs(webgpuStore)
// 创建 canvas 引用
const canvasRef = ref(null);

onMounted(async () => {
  const canvas = canvasRef.value;
  const device = gpudevice.value;
  if (isWebGPUSupported.value) {
    const module = device.createShaderModule({
      label: 'doubling compute module',
      code: HelloGPGPUwgsl,
    });

    const pipeline = device.createComputePipeline({
      label: 'doubling compute pipeline',
      layout: 'auto',
      compute: {
        module,
        entryPoint: 'computeSomething',
      },
    });

    const input = new Float32Array([1, 3, 5]);

    // 在 GPU 上创建缓冲区来承载我们的计算
    // input and output
    const workBuffer = device.createBuffer({
      label: 'work buffer',
      size: input.byteLength,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });
    // 把数据复制到缓冲区
    device.queue.writeBuffer(workBuffer, 0, input);

    // 在 GPU 创建缓冲区来复制计算结果
    const resultBuffer = device.createBuffer({
      label: 'result buffer',
      size: input.byteLength,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    // 创建一个 bindGroup 来告诉着色器我们将在哪一个缓冲区上计算
    const bindGroup = device.createBindGroup({
      label: 'bindGroup for work buffer',
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: workBuffer } }],
    });

    // 编码命令，执行计算
    const encoder = device.createCommandEncoder({
      label: 'doubling encoder',
    });
    const pass = encoder.beginComputePass({
      label: 'doubling compute pass',
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(input.length);
    pass.end();

    // 编码命令以复制结果到一个可映射的缓冲区
    encoder.copyBufferToBuffer(workBuffer, 0, resultBuffer, 0, resultBuffer.size);

    // 结束编码，提交命令
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    // 读取结果
    await resultBuffer.mapAsync(GPUMapMode.READ);
    const result = new Float32Array(resultBuffer.getMappedRange());

    console.log('input', input);
    console.log('result', result);

    resultBuffer.unmap();
  }
});
</script>
