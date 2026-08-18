import { renderHeader, renderFooter, initNav, initReveal, initFeedback } from './site'

document.addEventListener('DOMContentLoaded', () => {
  const page = (document.body.dataset.page as string) || ''
  const headerEl = document.getElementById('site-header')
  const footerEl = document.getElementById('site-footer')
  if (headerEl) headerEl.innerHTML = renderHeader(page)
  if (footerEl) footerEl.innerHTML = renderFooter()
  initNav()
  initReveal()
  initFeedback()
})
