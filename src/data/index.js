import partsItems from './parts.js'
import termsItems from './terms.js'

export function getMenuGroups() {
    return [
        {
            name: 'Компоненты дрона',
            source: 'parts',
            items: partsItems,
        },
        {
            name: 'Термины',
            source: 'terms',
            items: termsItems,
        },
    ]
}

export { default as partsItems, loadPartsItems } from './parts.js'
export { default as termsItems } from './terms.js'
