import termsItems from '@/data/terms.js'
import partsItems from '@/data/parts.js'

export async function resolveTopic(source, id) {
    const numericId = Number(id)

    if (source === 'terms') {
        const term = termsItems.find((item) => item.id === numericId)
        if (!term) return null

        return {
            title: term.title,
            subtitle: term.subtitle,
            image: term.image,
            description: term.description,
            hrefToCourse: term.hrefToCourse,
            hrefToDoc: term.hrefToDoc,
        }
    }

    if (source === 'parts') {
        const part = partsItems.find((item) => item.id === numericId)
        if (!part) return null

        return {
            title: part.title,
            subtitle: part.subtitle,
            image: part.image,
            description: part.description,
            hrefToCourse: null,
            hrefToDoc: null,
        }
    }

    return null
}
