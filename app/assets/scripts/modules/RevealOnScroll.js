import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class RevealOnScroll {
  constructor(els, thresholdPercent) {
    this.thresholdPercent = thresholdPercent
    this.itemToReveal = els
    this.browserHeight = window.innerHeight
    this.hideInitial();
    this.scrollThrottle = throttle(this.calcCaller, 200).bind(this)
    this.events()
  }
calcCaller(){
    this.itemToReveal.forEach(el => {
       if(!el.isRevealed){
        this.calculateIfScrollTo(el)
       }
    })
  }
  calculateIfScrollTo(el){

    if (window.scrollY + this.browserHeight > el.offsetTop) {
      let scrollPercent = (el.getBoundingClientRect().y/this.browserHeight) * 100
     if(scrollPercent < this.thresholdPercent){
          el.classList.add('reveal-item--is-visible')
          el.isRevealed = true
 
          if(el.isLastItem){
             window.removeEventListener('scroll', this.scrollThrottle)
          }
      }
    }
  }

  hideInitial() {
    this.itemToReveal.forEach((el) => {

        el.classList.add("reveal-item")
        el.isRevealed = false
    });

    this.itemToReveal[this.itemToReveal.length - 1].isLastItem = true
  }
  

  events() {
    window.addEventListener('scroll', this.scrollThrottle)
    window.addEventListener('resize', debounce(()=> {
      this.browserHeight = window.innerHeight
    }, 333))
  }
}

export default RevealOnScroll;
