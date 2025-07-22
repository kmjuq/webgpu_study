<script setup>
import HelloWebGPU from '@/components/HelloWebGPU.vue';
import HelloGPGPU from '@/components/HelloGPGPU.vue';
import { useWebGPUStore } from '@/stores/WebGPUStore';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

const webgpuStore = useWebGPUStore();
const { isWebGPUSupported } = storeToRefs(webgpuStore)

if (!isWebGPUSupported.value) {
    router.push({ name: 'EMPTY' })
}
</script>

<template>
    <div class="flex">
        <HelloWebGPU />
        <HelloGPGPU />
    </div>
</template>