<script setup>
import HelloWebGPUwgsl from '@/assets/HelloWebGPU.wgsl?raw';
import RenderSimpleTriangle from './RenderSimpleTriangle.vue';
</script>

<template>
    <RenderSimpleTriangle :shader="HelloWebGPUwgsl" />
</template>
