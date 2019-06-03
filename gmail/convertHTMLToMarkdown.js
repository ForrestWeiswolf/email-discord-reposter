// Turndown is used to convert HTML to markdown.
const Turndown = require('turndown')
const turndownService = new Turndown()
  .addRule('link', {
    // Discord only supports a limited subset of markdown, which doesn't include inline links.
    // So when there's an <a></a> tag we'll put the href URL in parentheses after the content.
    // However, if the content is just the url written out, we don't need to put the URL in parentheses.
    filter: 'a',
    replacement: function(content, node) {
      const location = node.getAttribute('href') || ''

      const stripUrl = url =>
        url
          .replace(/^(https?:\/\/)?(www.)?/, '')
          .replace(/\/$/, '')
          .toLowerCase()

      if (stripUrl(location) === stripUrl(content)) {
        return content
      } else {
        return `${content} (${location})`
      }
    },
  })
  .addRule('linebreak', {
    // Turndown ought to convert <br /> to a newline by default, in my opinion
    // but it doesn't, so we have this rule to handle that.
    filter: 'br',
    replacement: function(content, node) {
      return '\n'
    },
  })
module.exports = html => turndownService.turndown(html)
