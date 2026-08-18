import { supabase } from './supabase'
import { icons } from './icons'

const SCHOOL_NAME = 'Almanza Baptist Christian Academy'
const SCHOOL_ABBR = 'ABCA'
const SCHOOL_ADDRESS = 'Blk 1 Lot 6 & 7 San Francisco Subd. Almanza 1, Las Piñas City'
const SCHOOL_EMAIL = 'almanzabaptistchristianacademy@gmail.com'
const SCHOOL_PHONE = '(02) 8403 - 2599'
const SCHOOL_FB = 'https://www.facebook.com/ABCAwarriorsofficial'
const SOT_LINK = 'https://www.schooloftomorrow.ph/'
const NSC_LINK = 'https://www.schooloftomorrow.ph/events/nsc'

const NAV = [
  { href: 'index.html', label: 'Home', icon: 'home' },
  { href: 'about.html', label: 'About', icon: 'info' },
  { href: 'history.html', label: 'History', icon: 'history' },
  { href: 'admissions.html', label: 'Admissions', icon: 'book' },
  { href: 'contact.html', label: 'Contact', icon: 'mail' }
]

function icon(name: keyof typeof icons): string {
  return icons[name] || ''
}

export function renderHeader(active: string): string {
  const navLinks = NAV.map(n =>
    `<a href="${n.href}" class="${active === n.href ? 'active' : ''}">${n.label}</a>`
  ).join('')

  return `
  <header class="site-header">
    <div class="header-inner">
      <a href="index.html" class="brand" aria-label="${SCHOOL_NAME} home">
        <img src="assets/logo.png" alt="${SCHOOL_NAME} logo" />
        <span class="brand-text">
          <span class="brand-name">${SCHOOL_NAME}</span>
          <span class="brand-abbr">${SCHOOL_ABBR}</span>
        </span>
      </a>
      <nav class="nav" aria-label="Primary">
        ${navLinks}
        <a href="login.html" class="btn--login">${icon('lock')} School Login</a>
      </nav>
      <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false" aria-controls="sidenav">
        ${icon('menu')}
      </button>
    </div>
  </header>
  <div class="sidenav" id="sidenav" aria-label="Mobile navigation">
    <div class="sidenav-header">
      <a href="index.html" class="brand">
        <img src="assets/logo.png" alt="${SCHOOL_NAME} logo" />
        <span class="brand-text">
          <span class="brand-name">${SCHOOL_NAME}</span>
          <span class="brand-abbr">${SCHOOL_ABBR}</span>
        </span>
      </a>
      <button class="sidenav-close" id="sidenavClose" aria-label="Close menu">${icon('close')}</button>
    </div>
    <nav aria-label="Mobile primary">
      ${NAV.map(n => `<a href="${n.href}" class="${active === n.href ? 'active' : ''}">${icon(n.icon as keyof typeof icons)} ${n.label}</a>`).join('')}
      <a href="login.html" class="btn--login">${icon('lock')} School Login</a>
    </nav>
  </div>
  <div class="overlay" id="navOverlay"></div>
  `
}

export function renderFooter(): string {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="assets/logo.png" alt="${SCHOOL_NAME} logo" />
          <p>${SCHOOL_NAME} is a church-based Christian school providing Biblical Christian Education through the School of Tomorrow PACE learning system in Las Piñas City.</p>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="history.html">History</a></li>
            <li><a href="admissions.html">Admissions</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul class="footer-contact">
            <li>${icon('mapPin')}<span>${SCHOOL_ADDRESS}</span></li>
            <li>${icon('mail')}<a href="mailto:${SCHOOL_EMAIL}">${SCHOOL_EMAIL}</a></li>
            <li>${icon('phone')}<span>${SCHOOL_PHONE}</span></li>
            <li>${icon('facebook')}<a href="${SCHOOL_FB}" target="_blank" rel="noopener noreferrer">Facebook Page</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="${SOT_LINK}" target="_blank" rel="noopener noreferrer">School of Tomorrow</a></li>
            <li><a href="${NSC_LINK}" target="_blank" rel="noopener noreferrer">National Student Conventions</a></li>
            <li><a href="login.html">School Login</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</span>
        <button class="feedback-pill" id="feedbackPillBtn">${icon('messageSquare')} Got Feedback?</button>
      </div>
    </div>
  </footer>
  ${renderFeedbackModal()}
  `
}

function renderFeedbackModal(): string {
  return `
  <div class="modal" id="feedbackModal" role="dialog" aria-modal="true" aria-labelledby="feedbackModalTitle">
    <div class="modal-overlay" data-close-feedback></div>
    <div class="modal-dialog">
      <button class="modal-close" data-close-feedback aria-label="Close feedback">${icon('close')}</button>
      <h2 id="feedbackModalTitle">Got Feedback?</h2>
      <p class="modal-sub">We value your thoughts. Share your feedback with us below.</p>
      <div class="form-msg" id="feedbackFormMsg"></div>
      <form id="feedbackForm" novalidate>
        <div class="form-group">
          <label for="fbName">Name <span style="color:#888">(Optional)</span></label>
          <input type="text" id="fbName" class="form-control" maxlength="120" autocomplete="name" />
        </div>
        <div class="form-group">
          <label for="fbMessage">Feedback <span class="req">*</span></label>
          <textarea id="fbMessage" class="form-control" required maxlength="2000" placeholder="Tell us what you think..."></textarea>
          <div class="field-error" id="fbMessageErr">Please enter your feedback.</div>
        </div>
        <button type="submit" class="btn btn--primary btn--block" id="fbSubmit">${icon('send')} Submit Feedback</button>
      </form>
    </div>
  </div>
  `
}

export function initFeedback(): void {
  const modal = document.getElementById('feedbackModal')
  if (!modal) return
  const openBtn = document.getElementById('feedbackPillBtn')
  const closeEls = modal.querySelectorAll('[data-close-feedback]')

  const open = () => {
    modal.classList.add('open')
    const firstInput = modal.querySelector('input, textarea') as HTMLElement | null
    if (firstInput) firstInput.focus()
  }
  const close = () => modal.classList.remove('open')

  openBtn?.addEventListener('click', open)
  closeEls.forEach(el => el.addEventListener('click', close))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })

  const form = document.getElementById('feedbackForm') as HTMLFormElement | null
  const msg = document.getElementById('feedbackFormMsg')
  const submitBtn = document.getElementById('fbSubmit') as HTMLButtonElement | null
  const messageInput = document.getElementById('fbMessage') as HTMLTextAreaElement | null
  const messageErr = document.getElementById('fbMessageErr')

  form?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = (document.getElementById('fbName') as HTMLInputElement).value.trim()
    const message = messageInput?.value.trim() || ''
    messageErr?.classList.remove('show')
    messageInput?.classList.remove('error')
    if (!message) {
      messageErr?.classList.add('show')
      messageInput?.classList.add('error')
      return
    }
    if (submitBtn) submitBtn.disabled = true
    try {
      const { error } = await supabase.from('feedback').insert({
        name: name || null,
        message,
        status: 'new'
      })
      if (error) throw error
      showFormMsg(msg, 'Thank you! Your feedback has been received.', 'success')
      form.reset()
      setTimeout(close, 1800)
    } catch (err) {
      console.error('feedback submit failed', err)
      showFormMsg(msg, 'Sorry, we could not submit your feedback right now. Please try again later.', 'error')
    } finally {
      if (submitBtn) submitBtn.disabled = false
    }
  })
}

function showFormMsg(el: Element | null, text: string, type: 'success' | 'error'): void {
  if (!el) return
  el.textContent = text
  el.className = `form-msg show ${type}`
  setTimeout(() => { el.className = 'form-msg' }, 4000)
}

export function initNav(): void {
  const toggle = document.getElementById('menuToggle')
  const sidenav = document.getElementById('sidenav')
  const overlay = document.getElementById('navOverlay')
  const closeBtn = document.getElementById('sidenavClose')

  const open = () => {
    sidenav?.classList.add('open')
    overlay?.classList.add('open')
    toggle?.setAttribute('aria-expanded', 'true')
  }
  const close = () => {
    sidenav?.classList.remove('open')
    overlay?.classList.remove('open')
    toggle?.setAttribute('aria-expanded', 'false')
  }

  toggle?.addEventListener('click', () => {
    sidenav?.classList.contains('open') ? close() : open()
  })
  closeBtn?.addEventListener('click', close)
  overlay?.addEventListener('click', close)
  sidenav?.querySelectorAll('a').forEach(a => a.addEventListener('click', close))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
}

export function initReveal(): void {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade')
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'))
    return
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in')
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  els.forEach(el => obs.observe(el))
}

export interface CarouselOptions {
  trackSelector: string
  prevSelector: string
  nextSelector: string
  dotsSelector: string
  interval?: number
  pauseOnHover?: boolean
}

export function initCarousel(opts: CarouselOptions): void {
  const track = document.querySelector(opts.trackSelector) as HTMLElement | null
  if (!track) return
  const slides = Array.from(track.children) as HTMLElement[]
  const prevBtn = document.querySelector(opts.prevSelector)
  const nextBtn = document.querySelector(opts.nextSelector)
  const dotsWrap = document.querySelector(opts.dotsSelector)
  const interval = opts.interval ?? 5000
  let index = 0
  let timer: number | undefined
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (dotsWrap) {
    dotsWrap.innerHTML = slides.map((_, i) =>
      `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Go to slide ${i + 1}"></button>`
    ).join('')
    dotsWrap.querySelectorAll('.carousel-dot').forEach(d => {
      d.addEventListener('click', () => go(parseInt((d as HTMLElement).dataset.i || '0')))
    })
  }

  function go(i: number): void {
    index = (i + slides.length) % slides.length
    track.style.transform = `translateX(-${index * 100}%)`
    dotsWrap?.querySelectorAll('.carousel-dot').forEach((d, di) =>
      d.classList.toggle('active', di === index)
    )
  }

  function next(): void { go(index + 1) }
  function prev(): void { go(index - 1) }

  prevBtn?.addEventListener('click', () => { prev(); restart() })
  nextBtn?.addEventListener('click', () => { next(); restart() })

  function start(): void {
    if (reduce || slides.length <= 1) return
    timer = window.setInterval(next, interval)
  }
  function stop(): void { if (timer) window.clearInterval(timer) }
  function restart(): void { stop(); start() }

  if (opts.pauseOnHover !== false) {
    track.parentElement?.addEventListener('mouseenter', stop)
    track.parentElement?.addEventListener('mouseleave', start)
  }

  let startX = 0, deltaX = 0, swiping = false
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX
    deltaX = 0
    swiping = true
    stop()
  }, { passive: true })
  track.addEventListener('touchmove', (e) => {
    if (!swiping) return
    deltaX = e.touches[0].clientX - startX
  }, { passive: true })
  track.addEventListener('touchend', () => {
    if (!swiping) return
    swiping = false
    if (Math.abs(deltaX) > 40) {
      deltaX < 0 ? next() : prev()
    }
    restart()
  })

  track.addEventListener('mouseenter', () => track.style.cursor = 'grab')
  start()
}

export const siteInfo = {
  name: SCHOOL_NAME,
  abbr: SCHOOL_ABBR,
  address: SCHOOL_ADDRESS,
  email: SCHOOL_EMAIL,
  phone: SCHOOL_PHONE,
  facebook: SCHOOL_FB,
  sotLink: SOT_LINK,
  nscLink: NSC_LINK
}
