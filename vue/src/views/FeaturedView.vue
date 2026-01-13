<template>
  <div class="featured">
    <div class="featured-cards">
      <FeaturedCard v-for="featuredWork in featuredWorks" :key="featuredWork.id" :featuredWork="featuredWork" />
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
      featuredWorks: []
    };
  },
  created() {
    this.loadProjects();
  },
  methods: {
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
  text-align: center; /* Center align all text */
}

.featured-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px; /* Add space between cards */
}

.featured-cards > * {
  flex: 1 1 100%; /* 1 card per row on mobile */
  max-width: 100%; /* Ensure cards are the same size on mobile */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

@media (min-width: 769px) {
  .featured-cards > * {
    flex: 1 1 calc(33.333% - 20px); /* 3 cards per row */
    max-width: calc(33.333% - 20px); /* Ensure cards are the same size */
  }
}

@media (min-width: 1024px) {
  .featured-cards > * {
    flex: 1 1 calc(25% - 20px); /* 4 cards per row */
    max-width: calc(25% - 20px); /* Ensure cards are the same size */
  }
}
</style>
