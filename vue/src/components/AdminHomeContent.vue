<template>
  <div class="admin-home-content">
    <h2>Edit Home Page Content</h2>
    
    <div class="editor-container">
      <label>Home Page Text:</label>
      <textarea 
        v-model="content" 
        rows="10"
        placeholder="Enter home page content. Use &lt;br&gt;&lt;br&gt; for line breaks."
      ></textarea>
      
      <div class="preview">
        <h3>Preview:</h3>
        <p v-html="content"></p>
      </div>
      
      <div class="actions">
        <button @click="saveContent" class="btn-save" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
      
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'AdminHomeContent',
  data() {
    return {
      content: '',
      saving: false,
      message: '',
      messageType: ''
    };
  },
  async created() {
    await this.loadContent();
  },
  methods: {
    async loadContent() {
      try {
        const response = await ApiService.getHomeContent();
        this.content = response.data.content || '';
      } catch (error) {
        console.error('Failed to load content:', error);
        this.showMessage('Failed to load content', 'error');
      }
    },
    async saveContent() {
      this.saving = true;
      this.message = '';
      
      try {
        await ApiService.updateHomeContent(this.content);
        this.showMessage('Content saved successfully!', 'success');
      } catch (error) {
        console.error('Failed to save content:', error);
        this.showMessage('Failed to save content', 'error');
      } finally {
        this.saving = false;
      }
    },
    showMessage(msg, type) {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
};
</script>

<style scoped>
.admin-home-content {
  padding: 20px;
}

.editor-container {
  max-width: 800px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 20px;
}

.preview {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.preview h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
  text-transform: uppercase;
}

.preview p {
  margin: 0;
  line-height: 1.6;
}

.actions {
  margin-bottom: 15px;
}

.btn-save {
  padding: 12px 24px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: #218838;
}

.btn-save:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 4px;
  margin-top: 15px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
