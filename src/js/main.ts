import { renderHeader, renderFooter, initNav, initReveal, initFeedback, initCarousel } from './site'

document.addEventListener('DOMContentLoaded', () => {
  const headerEl = document.getElementById('site-header')
  const footerEl = document.getElementById('site-footer')
  if (headerEl) headerEl.innerHTML = renderHeader('index.html')
  if (footerEl) footerEl.innerHTML = renderFooter()
  initNav()
  initReveal()
  initFeedback()

  initCarousel({
    trackSelector: '#conventionTrack',
    prevSelector: '#convPrev',
    nextSelector: '#convNext',
    dotsSelector: '#convDots',
    interval: 5500,
    pauseOnHover: true
  })
})
