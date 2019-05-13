const { expect } = require('chai')
const convertHTMLToMarkdown = require('./convertHTMLToMarkdown')

describe('Link conversion', () => {
  it('Puts the url in parentheses after the text', () => {
    expect(
      convertHTMLToMarkdown('<a href="unsongbook.com">Unsong</a>')
    ).to.equal('Unsong (unsongbook.com)')
  })

  it("Doesn't put the url in parentheses after the text if they're the same", () => {
    expect(
      convertHTMLToMarkdown(
        '<a href="overcomingbias.com">overcomingbias.com</a>'
      )
    ).to.equal('overcomingbias.com')
  })

  it("Doesn't put the url in parentheses after the text if they differ only by case", () => {
    expect(
      convertHTMLToMarkdown('<a href="lesswrong.com">LessWrong.com</a>')
    ).to.equal('LessWrong.com')
  })

  it('Doesn\'t put the url in parentheses after the text even if one has "www." at the start', () => {
    expect(
      convertHTMLToMarkdown('<a href="www.hpmor.com">hpmor.com</a>')
    ).to.equal('hpmor.com')
  })

  it('Doesn\'t put the url in parentheses after the text even if one has "https://" at the start', () => {
    expect(
      convertHTMLToMarkdown(
        '<a href="https://www.slatestarcodex.com">www.slatestarcodex.com</a>'
      )
    ).to.equal('www.slatestarcodex.com')
  })
})
