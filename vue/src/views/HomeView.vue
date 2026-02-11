<template>
  <div class="home">
    <img src="/img/homepage_photo.jpeg" class="responsive-img" />
    <p v-html="homeContent"></p>
    <div class="bottom-images">
      <img src="/img/remjag.jpg" class="responsive" />
      <img src="/img/goddesspainting.jpg" class="responsive" />
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'HomeView',
  data() {
    return {
      homeContent: 'Hi, thanks for dropping by! Roseboom Recording is the name I have given to my home studio in Chicago.<br><br>We have an amazing community of creatives helping run the show over here, including but not limited to: studio musicians, composers, photographers, videographers, producers, visual artists, film directors, etc. Remi the cat also lives in the studio as a heads up - she rocks.<br><br>The studio is semi-portable / remote recording is an option if you\'d like to book a location away from the city for a few days.<br><br>Please send project inquiries to nathan@roseboomrecording.com'
    };
  },
  async created() {
    await this.loadHomeContent();
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
  text-align: center; /* Center align all text */
}

.responsive-img {
  width: 100%;
  height: auto;
  border-radius: 5px; /* Rounded edges */
}

.bottom-images {
  display: flex;
  justify-content: center;
  gap: 10px; /* Add some space between images */
}

.bottom-images img {
  flex: 1;
  max-width: 50%; /* Ensure images are equally sized */
  height: auto;
  border-radius: 5px; /* Rounded edges */
}

@media (min-width: 769px) {
  .responsive-img {
    max-width: 50vw;
  }
}
</style>
