<script setup>
import HelloWebGPU from '@/components/HelloWebGPU.vue';
import HelloGPGPU from '@/components/HelloGPGPU.vue';
import { useWebGPUStore } from '@/stores/WebGPUStore';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { isEmpty } from 'lodash-es';

const router = useRouter()

const webgpuStore = useWebGPUStore();
const { isWebGPUSupported } = storeToRefs(webgpuStore)

if (!isWebGPUSupported.value) {
    router.push({ name: 'EMPTY' })
}
</script>

<template>
    <HelloWebGPU />
    <HelloGPGPU />
</template>