import { ref } from 'vue'

const numbers = ref([])
const clickCount = ref(1)
const listOfTrips = ref([])

function createEmptyGrid() {
    return Array.from({ length: 100 }, (_, i) => ({
        variable: [],
        x: i % 10,
        y: 9 - Math.floor(i / 10),
        index: i,
        isPlatform: false,
        isQR: false,
        BgImg: 'images/ArUco-marker.jpg',
    }))
}

function ensureGridInitialized() {
    if (numbers.value.length === 0) {
        numbers.value = createEmptyGrid()
    }
}

export function usePlannerState() {
    ensureGridInitialized()

    return {
        numbers,
        clickCount,
        listOfTrips,
    }
}
