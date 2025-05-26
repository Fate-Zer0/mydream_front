import { ref, computed, watch } from 'vue'

export function useCarousel() {
    const slides = ref<HTMLElement[]>([])
    const currentIndex = ref(0)
    const activeIndex = ref(0)
    const direction = ref<'next' | 'prev'>('next') // 区分切换方向

    function updateSlideStyles() {
        const total = slides.value.length
        if (total === 0) return

        slides.value.forEach((slide, index) => {
            if (index === activeIndex.value) {
                slide.style.opacity = '1'
                slide.style.transform = 'translateX(0)'
                slide.style.zIndex = '10'
                slide.style.transition = 'all 0.6s ease-in-out'
            } else if (
                (direction.value === 'next' && index === (activeIndex.value - 1 + total) % total) ||
                (direction.value === 'prev' && index === (activeIndex.value + 1) % total)
            ) {
                // 上一个或下一个幻灯片作为“相邻”项，反向入场
                if (direction.value === 'next') {
                    slide.style.transform = 'translateX(-100%)'
                } else {
                    slide.style.transform = 'translateX(100%)'
                }
                slide.style.opacity = '0'
                slide.style.zIndex = '5'
                slide.style.transition = 'all 0.6s ease-in-out'
            } else {
                // 其他幻灯片隐藏
                slide.style.opacity = '0'
                slide.style.transform = 'translateX(-100%)'
                slide.style.zIndex = '0'
                slide.style.transition = 'none'
            }
        })
    }

    function showSlide(index: number, dir: 'next' | 'prev' = 'next') {
        let realIndex = index
        if (index >= slides.value.length) {
            realIndex = 0
        } else if (index < 0) {
            realIndex = slides.value.length - 1
        }
        direction.value = dir
        currentIndex.value = realIndex
        activeIndex.value = realIndex
    }

    function nextSlide() {
        showSlide(currentIndex.value + 1, 'next')
    }

    function prevSlide() {
        showSlide(currentIndex.value - 1, 'prev')
    }

    function goToSlide(index: number) {
        const diff = index - currentIndex.value
        const dir = diff > 0 || (diff < 0 && Math.abs(diff) > slides.value.length / 2) ? 'next' : 'prev'
        showSlide(index, dir)
    }

    function checkForSlides() {
        const elements = document.querySelectorAll('.carousel-slide') as NodeListOf<HTMLElement>
        if (elements.length === 0) {
            setTimeout(checkForSlides, 100)
        } else {
            slides.value = Array.from(elements)
            updateSlideStyles()
        }
    }

    watch(activeIndex, updateSlideStyles)

    return {
        slides,
        currentIndex,
        currentClass: computed(() => (index: number) =>
            currentIndex.value === index ? 'bg-gray-700' : 'bg-gray-300'
        ),
        nextSlide,
        prevSlide,
        goToSlide,
        checkForSlides
    }
}