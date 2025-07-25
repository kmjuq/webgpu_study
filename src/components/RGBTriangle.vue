<script setup>
import RenderSimpleTriangle from '@/components/RenderSimpleTriangle.vue';
import RGBTrianglewgsl from '@/assets/RGBTriangle.wgsl?raw'
</script>

<template>
    <RenderSimpleTriangle :shader="RGBTrianglewgsl" />
</template>