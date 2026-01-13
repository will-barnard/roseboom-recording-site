<template>
  <div class="admin-videos">
    <div class="section-header">
      <h2>Manage Videos</h2>
      <button @click="showAddForm = true" class="btn-add">+ Add New Video</button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="showAddForm || editingVideo" class="video-form">
      <h3>{{ editingVideo ? 'Edit Video' : 'Add New Video' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Video URL *</label>
          <input 
            type="url" 
            v-model="formData.url" 
            required 
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          />
          <small>Supported: YouTube, Vimeo, or any embed URL</small>
        </div>

        <div class="form-group">
          <label>Title (optional)</label>
          <input type="text" v-model="formData.title" placeholder="Video title" />
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editingVideo ? 'Update' : 'Add' }} Video
          </button>
          <button type="button" @click="cancelForm" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Videos List -->
    <div class="videos-list">
      <div v-if="videos.length === 0" class="no-data">
        No videos yet. Add your first video above!
      </div>
      <div v-else class="video-items">
        <div v-for="(video, index) in videos" :key="video.id" class="video-item">
          <div class="video-preview">
            <iframe 
              :src="getEmbedUrl(video.url)" 
              frameborder="0" 
              allowfullscreen
            ></iframe>
          </div>
          <div class="video-details">
            <h3 v-if="video.title">{{ video.title }}</h3>
            <p class="video-url">{{ video.url }}</p>
          </div>
          <div class="video-actions">
            <button @click="moveUp(index)" :disabled="index === 0" class="btn-icon">↑</button>
            <button @click="moveDown(index)" :disabled="index === videos.length - 1" class="btn-icon">↓</button>
            <button @click="startEdit(video)" class="btn-edit">Edit</button>
            <button @click="deleteVideo(video.id)" class="btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'AdminVideos',
  data() {
    return {
      videos: [],
      showAddForm: false,
      editingVideo: null,
      formData: {
        url: '',
        title: ''
      },
      errorMessage: ''
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
    async handleSubmit() {
      try {
        this.errorMessage = '';

        if (this.editingVideo) {
          await ApiService.updateVideo(this.editingVideo.id, this.formData);
        } else {
          await ApiService.createVideo({
            ...this.formData,
            display_order: this.videos.length
          });
        }

        await this.loadVideos();
        this.cancelForm();
      } catch (error) {
        console.error('Failed to save video:', error);
        this.errorMessage = error.response?.data?.error || 'Failed to save video';
      }
    },
    startEdit(video) {
      this.editingVideo = video;
      this.formData = {
        url: video.url,
        title: video.title || ''
      };
      this.showAddForm = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    cancelForm() {
      this.showAddForm = false;
      this.editingVideo = null;
      this.formData = {
        url: '',
        title: ''
      };
      this.errorMessage = '';
    },
    async deleteVideo(id) {
      if (!confirm('Are you sure you want to delete this video?')) {
        return;
      }

      try {
        await ApiService.deleteVideo(id);
        await this.loadVideos();
      } catch (error) {
        console.error('Failed to delete video:', error);
        alert('Failed to delete video');
      }
    },
    async moveUp(index) {
      if (index === 0) return;
      
      const newOrder = [...this.videos];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      
      await this.saveOrder(newOrder);
    },
    async moveDown(index) {
      if (index === this.videos.length - 1) return;
      
      const newOrder = [...this.videos];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      
      await this.saveOrder(newOrder);
    },
    async saveOrder(newOrder) {
      try {
        const videoIds = newOrder.map(v => v.id);
        await ApiService.reorderVideos(videoIds);
        this.videos = newOrder;
      } catch (error) {
        console.error('Failed to reorder videos:', error);
        alert('Failed to reorder videos');
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
.admin-videos {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  margin: 0;
}

.btn-add {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-add:hover {
  background: #218838;
}

.video-form {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.video-form h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 12px;
}

.error-message {
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #5a6268;
}

.videos-list {
  margin-top: 30px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

.video-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-item {
  display: grid;
  grid-template-columns: 300px 1fr auto;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  align-items: center;
}

.video-preview iframe {
  width: 300px;
  height: 169px;
  border-radius: 4px;
}

.video-details h3 {
  margin: 0 0 10px 0;
}

.video-url {
  margin: 0;
  color: #666;
  font-size: 14px;
  word-break: break-all;
}

.video-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-icon {
  padding: 5px 10px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-icon:hover:not(:disabled) {
  background: #5a6268;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit {
  padding: 8px 16px;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-edit:hover {
  background: #e0a800;
}

.btn-delete {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-delete:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .video-item {
    grid-template-columns: 1fr;
  }

  .video-preview iframe {
    width: 100%;
  }

  .video-actions {
    flex-direction: row;
  }
}
</style>
