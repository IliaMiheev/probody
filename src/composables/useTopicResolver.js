import { usePartsCatalog } from '@/composables/usePartsCatalog'

export async function resolveTopic(source, id) {
    if (source === 'parts') {
        const { loadParts, getPartById } = usePartsCatalog()
        await loadParts()
        const part = getPartById(Number(id))

        if (!part) {
            return null
        }

        return {
            title: part.name,
            subtitle: part.category,
            image: part.image,
            description: part.description,
        }
    }

    return null
}
