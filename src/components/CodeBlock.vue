<template>
    <pre><code class="language-python" v-html="highlighted"></code></pre>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'

const props = defineProps({
    code: {type: String, required: true},
})

const highlighted = ref('')

function highlight() {
    // безопасно экранируем HTML и подсвечиваем через Prism
    const escaped = props.code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    highlighted.value = Prism.highlight(escaped, Prism.languages['python'], 'python')
}

onMounted(highlight)
</script>