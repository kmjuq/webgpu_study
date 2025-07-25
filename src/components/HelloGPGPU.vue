<template>
  <WebGPU :setupCanvasCtx="canvasCtx" :setupGPUPipeline="gpuRender" />
</template>

<script setup>
import HelloGPGPUwgsl from '@/assets/HelloGPGPU.wgsl?raw'
import WebGPU from '@/components/WebGPU.vue';

const canvasCtx = (canvas) => {
  // 获取设备像素比
  const dpr = window.devicePixelRatio || 1;

  // 获取 CSS 设置的宽高
  const rect = canvas.getBoundingClientRect();

  // 设置 Canvas 的实际像素尺寸（考虑 DPR）
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // 重置 CSS 尺寸（避免因实际尺寸改变导致元素变大）
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  // 获取绘图上下文并缩放，确保 1 个 CSS 像素对应 1 个物理像素
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font = "48px serif";
  return ctx;
};

const gpuRender = async (device, canvasCtx) => {

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

  const input = new Float32Array([2, 3, 1]);

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

  canvasCtx.fillText(`[${Array.from(input).join(', ')}]`, 10, 50);
  canvasCtx.fillText(`[${Array.from(result).join(', ')}]`, 10, 100);

  resultBuffer.unmap();
}
</script>
