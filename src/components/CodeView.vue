<script setup>
import CustomButton from '@/components/UI/CustomButton.vue'
import CodeBlock from "./CodeBlock.vue";
import MovementButtons from "./MovementButtons.vue";
const props = defineProps({
    code: {
        required: true,
        type: String
    },
    show: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div class="code-view" v-if="show">
        <CustomButton
            @click.stop="$emit('update:show', false)">
            Вернуться к сохранению сгенерированного кода
        </CustomButton>
        <CodeBlock :code="code" />

        <CustomButton
            @click.stop="$emit('update:show', false)">
            Вернуться к сохранению сгенерированного кода
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
    height: 100%;
    z-index: 999;
}
</style>