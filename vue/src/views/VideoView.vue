<template>
  <div class="video">
    <h1>Video</h1>
    <div v-if="videos.length === 0" class="no-videos">
      <p>No videos available yet.</p>
    </div>
    <div v-else class="video-list">
      <div v-for="video in videos" :key="video.id" class="video-item">
        <iframe 
          :src="getEmbedUrl(video.url)" 
          :title="video.title || 'Video'"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
        <h3 v-if="video.title">{{ video.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'VideoView',
  data() {
    return {
      videos: []
    };
  },
  created() {
    this.loadVideos();
  },
  methods: {
    async loadVideos() {
      try {
        const response = await ApiService.getVideos();
        this.videos = response.data;
      } catch (error) {
        console.error('Failed to load videos:', error);
      }
    },
    getEmbedUrl(url) {
      // Convert YouTube URLs to embed format
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = this.extractYoutubeId(url);
        return `https://www.youtube.com/embed/${videoId}`;
      }
      // Convert Vimeo URLs to embed format
      if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return url;
    },
    extractYoutubeId(url) {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[7].length === 11) ? match[7] : null;
    }
  }
};
</script>

<style scoped>
.video {
  text-align: center;
  padding: 20px;
}

.no-videos {
  margin-top: 40px;
  color: #666;
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 300px));
  gap: 30px;
  margin-top: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
}

.video-item {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.video-item iframe {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 5px;
}

.video-item h3 {
  margin-top: 10px;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .video-list {
    grid-template-columns: 1fr;
  }
}
</style>
