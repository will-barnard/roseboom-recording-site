<template>
  <div>
    <img v-if="featuredWork.image" :src="featuredWork.image" :alt="featuredWork.title" />
    <h1>{{ featuredWork.title }}</h1>
    <p>{{ featuredWork.description }}</p>
    <p>{{ featuredWork.role }}</p>
    <p>{{ featuredWork.year }}</p>
    <a v-if="featuredWork.url" :href="featuredWork.url" target="_blank">View Project</a>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  data() {
    return {
      featuredWork: {}
    };
  },
  async created() {
    const id = parseInt(this.$route.params.id);
    try {
      const response = await ApiService.getProject(id);
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');
      this.featuredWork = {
        ...response.data,
        image: response.data.image && response.data.image.startsWith('/uploads/') 
          ? `${baseUrl}${response.data.image}`
          : response.data.image
      };
    } catch (error) {
      console.error('Failed to load project:', error);
      this.$router.push({ name: 'featured' });
    }
  }
};
</script>

<style scoped>
/* Add styles here if needed */
</style>