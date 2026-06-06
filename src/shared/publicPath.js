export function publicPath(relativePath) {
    if (!relativePath) {
        return relativePath
    }

    const path = relativePath.replace(/^\.\//, '').replace(/^\//, '')
    return `${import.meta.env.BASE_URL}${path}`
}
