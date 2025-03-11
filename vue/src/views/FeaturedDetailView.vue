<template>
  <div>
    test
    <img :src="featuredWork.image" />
    <h1>{{ featuredWork.title }}</h1>
    <p>{{ featuredWork.description }}</p>
    <p>{{ featuredWork.role }}</p>
    <p>{{ featuredWork.year }}</p>
    <a :href="featuredWork.url" target="_blank">View Project</a>>
  </div>
</template>

<script>
import FeaturedWork from '../assets/FeaturedWork.js';
import FeaturedDetail from '../components/FeaturedDetail.vue';

export default {
  data() {
    return {
      featuredWork: {}
    };
  },
  created() {
    const id = parseInt(this.$route.params.id);
    this.featuredWork = FeaturedWork.featuredWork.find(featuredWork => featuredWork.id === id);
    console.log(this.featuredWork.image)
  }
};
</script>

<style scoped>
/* Add styles here if needed */
</style>