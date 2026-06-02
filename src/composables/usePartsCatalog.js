import { ref } from 'vue'

const parts = ref([])
let loadPromise = null

export function usePartsCatalog() {
    async function loadParts() {
        if (parts.value.length) {
            return parts.value
        }

        if (!loadPromise) {
            loadPromise = fetch('/droneComponents/components.json')
                .then((response) => (response.ok ? response.json() : []))
                .then((data) => {
                    parts.value = data
                    return data
                })
                .catch(() => {
                    parts.value = []
                    return []
                })
                .finally(() => {
                    loadPromise = null
                })
        }

        return loadPromise
    }

    function getPartById(id) {
        return parts.value.find((part) => part.id === id) ?? null
    }

    return { parts, loadParts, getPartById }
}
