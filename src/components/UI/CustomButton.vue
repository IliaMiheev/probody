<script setup>
const props = defineProps({
    isSuccess: {
        type: Boolean,
        required: false
    },
    to: {
        type: String,
        default: null
    }
})
</script>

<template>
    <a v-if="to" :href="props.to" target="_blank" class="btn">
        <slot />
    </a>
    <button v-else class="btn">
        <slot />
    </button>
</template>

<style scoped>
.btn {
    border: 2px solid white;
    cursor: pointer;
    transition: 0.3s;
    padding: 5px;
    background-color: #383838;
    color: white;
    width: 100%;
    font-size: 17px;
    text-decoration: none;
    box-sizing: border-box;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
}

.success {
    background-color: var(--successColor);
}
</style>