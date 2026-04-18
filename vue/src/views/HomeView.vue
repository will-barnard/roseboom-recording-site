<template>
  <div class="home" :class="{ 'loaded': isLoaded }">
    <img src="/img/homepage_photo.jpeg" class="responsive-img fade-in" />
    <p v-html="homeContent" class="content-text fade-in-delay"></p>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'HomeView',
  data() {
    return {
      homeContent: '',
      isLoaded: false
    };
  },
  async created() {
    await this.loadHomeContent();
  },
  mounted() {
    // Trigger fade-in animation after component is mounted
    setTimeout(() => {
      this.isLoaded = true;
    }, 50);
  },
  methods: {
    async loadHomeContent() {
      try {
        const response = await ApiService.getHomeContent();
        if (response.data.content) {
          this.homeContent = response.data.content;
        }
      } catch (error) {
        console.error('Failed to load home content:', error);
        // Keep default content if fetch fails
      }
    }
  }
};
</script>

<style scoped>
.home {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0 20px 20px;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in-delay {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s;
}

.home.loaded .fade-in,
.home.loaded .fade-in-delay {
  opacity: 1;
  transform: translateY(0);
}

.responsive-img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.content-text {
  line-height: 1.6;
  max-width: 700px;
}

@media (min-width: 769px) {
  .responsive-img {
    max-width: 44vw;
  }
  .home {
    padding-bottom: 40px;
  }
}
</style>
