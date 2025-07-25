<script setup>

import ChessboardTriangle from '@/assets/ChessboardTriangle.wgsl?raw'
import RenderSimpleTriangle from '@/components/RenderSimpleTriangle.vue';

</script>

<template>
    <RenderSimpleTriangle :shader="ChessboardTriangle" />
</template>
