<script setup>
import CustomButton from '@/components/UI/CustomButton.vue'
import CodeBlock from "./CodeBlock.vue";
import MovementButtons from "./MovementButtons.vue";

defineProps({
    code: {
        required: true,
        type: String
    },
})

defineEmits(['back'])
</script>

<template>
    <div class="code-view">
        <CustomButton @click="$emit('back')">
            Вернуться к генерации маршрута
        </CustomButton>
        <CodeBlock :code="code" />

        <CustomButton @click="$emit('back')">
            Вернуться к генерации маршрута
        </CustomButton>
        <MovementButtons/>
    </div>
</template>

<style scoped>
.code-view {
    background-color: #222222;
    overflow: auto;
    color: #eeeeee;
    width: 100%;
    min-height: 100vh;
    z-index: 999;
}
</style>
