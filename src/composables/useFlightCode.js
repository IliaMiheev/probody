import { ref } from 'vue'

const finallyText = ref('')

export function useFlightCode() {
    return { finallyText }
}
