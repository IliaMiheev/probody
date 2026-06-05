<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CodeView from '@/components/CodeView.vue'
import { useFlightCode } from '@/composables/useFlightCode'

const router = useRouter()
const { finallyText } = useFlightCode()

onMounted(() => {
    if (!finallyText.value.trim()) {
        router.replace({ name: 'planner' })
    }
})

function goBack() {
    router.push({ name: 'planner' })
}
</script>

<template>
    <CodeView v-if="finallyText" :code="finallyText" @back="goBack" />
</template>
