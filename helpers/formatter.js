function formatHashtag(content) {
    if (!content) return ""    
    return content.replace(/#(\w+)/g, (match, tagName) => {
    return `<a href="/hashtags/${tagName.toLowerCase()}" class="text-decoration-none text-pop">#${tagName}</a>`
    })
}

module.exports = formatHashtag