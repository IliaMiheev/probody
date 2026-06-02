<script setup>
import { ref, provide } from "vue";
import MyDropMenu from "@/components/MyDropMenu.vue";

const dropMenu = ref(null);

provide('dropMenu', dropMenu);
</script>

<template>
    <MyDropMenu ref="dropMenu" />
    <router-view />
</template>

<style>
* {
    font-family: 'Courier New', Courier, monospace;
}

html {
    background-image: radial-gradient(#23aae3e2, #222222);
}

body {
    font-size: 18px;
    margin: 0;
}
</style>
