<template>
  <div class="admin-settings">
    <h2>Settings</h2>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <div class="settings-section">
      <h3>Export Content</h3>
      <p>Download all site content (projects, videos, text) and uploaded images as a zip file.</p>
      <button @click="exportContent" :disabled="exporting" class="btn-primary">
        {{ exporting ? 'Exporting...' : 'Download Content' }}
      </button>
    </div>

    <div class="settings-section">
      <h3>Import Content</h3>
      <p>Upload a previously exported zip file to restore content. This will replace all existing content.</p>
      <div class="import-controls">
        <input
          type="file"
          ref="fileInput"
          accept=".zip"
          @change="onFileSelected"
          class="file-input"
        />
        <button
          @click="importContent"
          :disabled="!selectedFile || importing"
          class="btn-primary"
        >
          {{ importing ? 'Importing...' : 'Upload Content' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'AdminSettings',
  data() {
    return {
      message: '',
      messageType: '',
      exporting: false,
      importing: false,
      selectedFile: null
    };
  },
  methods: {
    async exportContent() {
      this.message = '';
      this.exporting = true;
      try {
        const response = await ApiService.exportContent();
        const blob = new Blob([response.data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'site-content-export.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.message = 'Content exported successfully';
        this.messageType = 'success';
      } catch (error) {
        this.message = 'Failed to export content';
        this.messageType = 'error';
      } finally {
        this.exporting = false;
      }
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0] || null;
    },
    async importContent() {
      if (!this.selectedFile) return;

      if (!confirm('This will replace all existing content. Are you sure?')) {
        return;
      }

      this.message = '';
      this.importing = true;
      try {
        const response = await ApiService.importContent(this.selectedFile);
        const { imported } = response.data;
        this.message = `Imported ${imported.projects} projects, ${imported.videos} videos, ${imported.content} content entries`;
        this.messageType = 'success';
        this.selectedFile = null;
        this.$refs.fileInput.value = '';
      } catch (error) {
        const msg = error.response?.data?.error || 'Failed to import content';
        this.message = msg;
        this.messageType = 'error';
      } finally {
        this.importing = false;
      }
    }
  }
};
</script>

<style scoped>
.admin-settings {
  padding: 20px 0;
}

.admin-settings h2 {
  margin-bottom: 20px;
  color: #333;
}

.message {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
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

.settings-section {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.settings-section h3 {
  margin: 0 0 8px;
  color: #333;
}

.settings-section p {
  margin: 0 0 16px;
  color: #666;
  font-size: 14px;
}

.btn-primary {
  padding: 10px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #999;
  cursor: not-allowed;
}

.import-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-input {
  font-size: 14px;
}
</style>
