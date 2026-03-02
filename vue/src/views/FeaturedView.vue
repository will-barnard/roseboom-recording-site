<template>
  <div class="featured">
    <div class="featured-cards">
      <FeaturedCard 
        v-for="(featuredWork, index) in featuredWorks" 
        :key="featuredWork.id" 
        :featuredWork="featuredWork" 
        :isExpanded="expandedCardId === featuredWork.id"
        :index="index"
        :isVisible="visibleCards.includes(index)"
        @toggle="handleToggle"
      />
    </div>
  </div>
</template>

<script>
import FeaturedCard from '../components/FeaturedCard.vue';
import ApiService from '../services/ApiService';

export default {
  name: 'FeaturedView',
  components: {
    FeaturedCard
  },
  data() {
    return {
      featuredWorks: [],
      expandedCardId: null,
      visibleCards: []
    };
  },
  created() {
    this.loadProjects();
  },
  mounted() {
    // Add scroll listener for card animations
    window.addEventListener('scroll', this.handleScroll);
    
    // Check initial visibility after DOM is fully rendered
    this.$nextTick(() => {
      setTimeout(() => {
        this.handleScroll();
      }, 100);
    });
    
    // Remove side padding but preserve top margin for fixed header
    const contentDiv = document.getElementById('content');
    const roseboomDiv = document.getElementById('roseboom-recording');
    const body = document.body;
    if (contentDiv) {
      contentDiv.style.paddingLeft = '0';
      contentDiv.style.paddingRight = '0';
      contentDiv.style.paddingBottom = '0';
      // Keep margin-top intact for fixed header
    }
    if (roseboomDiv) {
      roseboomDiv.style.paddingLeft = '0';
      roseboomDiv.style.paddingRight = '0';
    }
    if (body) {
      body.style.margin = '0';
      body.style.padding = '0';
    }
  },
  beforeUnmount() {
    // Remove scroll listener
    window.removeEventListener('scroll', this.handleScroll);
    
    // Restore padding when leaving
    const contentDiv = document.getElementById('content');
    const roseboomDiv = document.getElementById('roseboom-recording');
    const body = document.body;
    if (contentDiv) {
      contentDiv.style.paddingLeft = '';
      contentDiv.style.paddingRight = '';
      contentDiv.style.paddingBottom = '';
    }
    if (roseboomDiv) {
      roseboomDiv.style.paddingLeft = '';
      roseboomDiv.style.paddingRight = '';
    }
    if (body) {
      body.style.margin = '';
      body.style.padding = '';
    }
  },
  methods: {
    handleScroll() {
      const cards = document.querySelectorAll('.featured-card');
      cards.forEach((card, index) => {
        if (this.isElementInViewport(card) && !this.visibleCards.includes(index)) {
          setTimeout(() => {
            if (!this.visibleCards.includes(index)) {
              this.visibleCards.push(index);
            }
          }, index * 100); // 100ms delay between each card
        }
      });
    },
    isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      return (
        rect.top < windowHeight &&
        rect.bottom > 0 &&
        rect.left < windowWidth &&
        rect.right > 0
      );
    },
    handleToggle(cardId) {
      if (this.expandedCardId === cardId) {
        this.expandedCardId = null;
      } else {
        this.expandedCardId = cardId;
      }
    },
    async loadProjects() {
      try {
        const response = await ApiService.getProjects();
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');
        this.featuredWorks = response.data.map(project => ({
          ...project,
          // Map backend image paths to work with Vue app
          image: project.image && project.image.startsWith('/uploads/') 
            ? `${baseUrl}${project.image}`
            : project.image
        }));
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
  }
};
</script>

<style scoped>
.featured {
  text-align: center;
  padding: 0;
  margin: 0;
  width: 100%;
}

.featured-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0;
  margin: 0;
  padding: 0;
  width: 100%;
}

.featured-cards > * {
  flex: 1 1 100%; /* 1 card per row on mobile */
  max-width: 100%; /* Ensure cards are the same size on mobile */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

@media (min-width: 769px) {
  .featured-cards > * {
    flex: 1 1 calc(33.333%); /* 3 cards per row */
    max-width: calc(33.333%); /* Ensure cards are the same size */
  }
}

@media (min-width: 1024px) {
  .featured-cards > * {
    flex: 1 1 calc(25%); /* 4 cards per row */
    max-width: calc(25%); /* Ensure cards are the same size */
  }
}

@media (max-width: 768px) {
  .featured {
    margin: 0;
    padding: 0;
    padding-top: 0 !important;
  }
  .featured-cards {
    padding-top: 0;
  }
}
</style>
