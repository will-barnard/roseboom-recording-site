<template>
  <div class="featured">
    <div class="featured-cards">
      <FeaturedCard v-for="featuredWork in featuredWorks" :key="featuredWork.id" :featuredWork="featuredWork" />
    </div>
  </div>
</template>

<script>
import FeaturedWork from '../assets/FeaturedWork.js';
import FeaturedCard from '../components/FeaturedCard.vue';

export default {
  name: 'FeaturedView',
  components: {
    FeaturedCard
  },
  data() {
    return {
      featuredWorks: FeaturedWork.featuredWork
    };
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
