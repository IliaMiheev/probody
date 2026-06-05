import { ref } from 'vue'
import partsItems from '@/data/parts.js'

const parts = ref([...partsItems])

export function usePartsCatalog() {
    async function loadParts() {
        return parts.value
    }

    function getPartById(id) {
        return parts.value.find((part) => part.id === id) ?? null
    }

    return { parts, loadParts, getPartById }
}
