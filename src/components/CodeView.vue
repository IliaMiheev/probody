<script setup>
import CustomButton from '@/components/UI/CustomButton.vue'

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
console.log(props.code)
</script>

<template>
    <div class="code-view" v-if="show">
        <CustomButton @click.stop="$emit('update:show', false)">Вернуться к сохранению сгенерированного кода</CustomButton>
        <pre>
            {{ code }}
        </pre>
        <CustomButton @click.stop="$emit('update:show', false)">Вернуться к сохранению сгенерированного кода</CustomButton>
    </div>
</template>

<style scoped>
.code-view {
    position: fixed;
    top: 0;
    left: 0;
    //background-image: radial-gradient(#23aae3e2, #222222);
    background-color: #222222;
    overflow: auto;
    color: #eeeeee;
    width: 100%;
    height: 100%;
    z-index: 999;
}
</style>