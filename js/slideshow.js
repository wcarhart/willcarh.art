{{sys:headerjs}}

// set up and control markdown slideshow

// initial slide setup
let slideIndex = 1
$(document).ready(() => {
    showSlides(slideIndex)
})

// show selected slide
const showSlides = (n) => {
    let i
    let slides = document.getElementsByClassName('markdown-slideshow-slide')
    let dots = document.getElementsByClassName('markdown-slideshow-dot')

    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none'
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' markdown-slideshow-active-slide', '')
    }
    slides[slideIndex-1].style.display = 'block'
    dots[slideIndex-1].className += ' markdown-slideshow-active-slide'
}

// next/previous controls
const plusSlides = (n) => {
    showSlides(slideIndex += n)
}

// thumbnail image controls
const currentSlide = (n) => {
    showSlides(slideIndex = n)
}
