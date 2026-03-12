<script setup>
const props = defineProps({
    isSuccess: {
        type: Boolean,
        required: true
    },
    to: {
        type: String,
        default: null
    }
})

</script>

<template>
    <a v-if="to" :href="props.to" class="btn">
        <slot/>
    </a>
    <button v-else class="btn">
        <slot/>
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
}
</style>