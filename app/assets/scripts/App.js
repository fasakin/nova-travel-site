import "../styles/styles.css";
import MobileMenu from './modules/MobileMenu'
import RevealOnScroll from './modules/RevealOnScroll'
import StickyHeader from './modules/sticky-header'

if (module.hot) {
  module.hot.accept();
}
new StickyHeader()
new MobileMenu()
new RevealOnScroll(document.querySelectorAll('.feature-item'), 75)
new RevealOnScroll(document.querySelectorAll('.testimonial'), 60)

