// Gallery functionality
function loadGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    fetch('gallery.json')
        .then(response => response.json())
        .then(images => {
            images.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.alt;
                
                const caption = document.createElement('div');
                caption.className = 'gallery-caption';
                caption.textContent = image.caption;
                
                galleryItem.appendChild(img);
                galleryItem.appendChild(caption);
                galleryContainer.appendChild(galleryItem);
            });
        })
        .catch(error => console.error('Error loading gallery:', error));
}

// Carousel functionality
class Carousel {
    constructor() {
        this.slide = document.getElementById('carousel-slide');
        this.pipsContainer = document.getElementById('carousel-pips');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        if (!this.slide) return;
        
        this.currentIndex = 0;
        this.images = [];
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    async init() {
        try {
            const response = await fetch('carousel.json');
            this.images = await response.json();
            this.render();
            this.setupEventListeners();
            this.startAutoPlay();
        } catch (error) {
            console.error('Error loading carousel:', error);
        }
    }
    
    render() {
        // Clear existing content
        this.slide.innerHTML = '';
        this.pipsContainer.innerHTML = '';
        
        // Create slides
        this.images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.style.display = index === 0 ? 'block' : 'none';
            this.slide.appendChild(img);
            
            // Create pips
            const pip = document.createElement('div');
            pip.className = `pip ${index === 0 ? 'active' : ''}`;
            pip.addEventListener('click', () => this.goToSlide(index));
            this.pipsContainer.appendChild(pip);
        });
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Pause autoplay on hover
        this.slide.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slide.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlide();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlide();
    }
    
    updateSlide() {
        const images = this.slide.querySelectorAll('img');
        const pips = this.pipsContainer.querySelectorAll('.pip');
        
        images.forEach((img, index) => {
            img.style.display = index === this.currentIndex ? 'block' : 'none';
        });
        
        pips.forEach((pip, index) => {
            pip.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    new Carousel();
}); 