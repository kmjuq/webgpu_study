<script setup>
import HelloWebGPU from '@/components/HelloWebGPU.vue';
import HelloGPGPU from '@/components/HelloGPGPU.vue';
import { useWebGPUStore } from '@/stores/WebGPUStore';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import ChessboardTriangle from '@/components/ChessboardTriangle.vue';
import RGBTriangle from '@/components/RGBTriangle.vue';

const router = useRouter()

const webgpuStore = useWebGPUStore();
const { isWebGPUSupported } = storeToRefs(webgpuStore)

if (!isWebGPUSupported.value) {
    router.push({ name: 'EMPTY' })
}
</script>

<template>
    <div class="flex gap-1 p-1 m-1">
        <HelloWebGPU />
        <HelloGPGPU />
        <RGBTriangle />
        <ChessboardTriangle />
    </div>
</template>