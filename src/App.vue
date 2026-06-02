<script setup>
import { ref, provide } from "vue";
import DroneParts from "@/components/DroneParts.vue";
import MyDropMenu from "@/components/MyDropMenu.vue";

const showDroneParts = ref(false);
const dropMenu = ref(null);

provide('dropMenu', dropMenu);
</script>

<template>
    <button
        v-if="!showDroneParts"
        @click="showDroneParts = true"
        class="show-parts-btn"
    >
        <img src="/images/drone.png" alt="menu" class="btn-icon" />
    </button>

    <MyDropMenu v-if="!showDroneParts" ref="dropMenu" />
    <DroneParts v-if="showDroneParts" @back="showDroneParts = false" />
    <router-view v-if="!showDroneParts" />
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

.show-parts-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    width: 50px;
    height: 50px;
    padding: 0;
    background: rgba(12, 12, 12, 0.034);
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.btn-icon {
    width: 90%;
    height: 90%;
    object-fit: cover;
}

.show-parts-btn:hover {
    transform: scale(1.05);
}
</style>
