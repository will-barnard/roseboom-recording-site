<template>
  <div class="admin-projects">
    <div class="section-header">
      <h2>Manage Featured Projects</h2>
      <button @click="showAddForm = true" class="btn-add">+ Add New Project</button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="showAddForm || editingProject" class="project-form">
      <h3>{{ editingProject ? 'Edit Project' : 'Add New Project' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>Title *</label>
            <input type="text" v-model="formData.title" required />
          </div>
          <div class="form-group">
            <label>Year</label>
            <input type="text" v-model="formData.year" />
          </div>
        </div>

        <div class="form-group">
          <label>Role</label>
          <input type="text" v-model="formData.role" placeholder="e.g., Engineer, Mix, Producer" />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="formData.description" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label>URL</label>
          <input type="url" v-model="formData.url" placeholder="https://..." />
        </div>

        <div class="form-group">
          <label>Cover Image</label>
          <input type="file" @change="handleFileChange" accept="image/*" />
          <div v-if="formData.currentImage" class="current-image">
            <p>Current image: {{ formData.currentImage }}</p>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editingProject ? 'Update' : 'Create' }} Project
          </button>
          <button type="button" @click="cancelForm" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Projects List -->
    <div class="projects-list">
      <div v-if="projects.length === 0" class="no-data">
        No projects yet. Add your first project above!
      </div>
      <div v-else class="project-items">
        <div v-for="(project, index) in projects" :key="project.id" class="project-item">
          <div class="project-image">
            <img :src="getImageUrl(project.image)" :alt="project.title" />
          </div>
          <div class="project-details">
            <h3>{{ project.title }}</h3>
            <p v-if="project.role"><strong>Role:</strong> {{ project.role }}</p>
            <p v-if="project.year"><strong>Year:</strong> {{ project.year }}</p>
            <p v-if="project.description" class="description">{{ project.description }}</p>
          </div>
          <div class="project-actions">
            <button @click="moveUp(index)" :disabled="index === 0" class="btn-icon">↑</button>
            <button @click="moveDown(index)" :disabled="index === projects.length - 1" class="btn-icon">↓</button>
            <button @click="startEdit(project)" class="btn-edit">Edit</button>
            <button @click="deleteProject(project.id)" class="btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'AdminProjects',
  data() {
    return {
      projects: [],
      showAddForm: false,
      editingProject: null,
      formData: {
        title: '',
        description: '',
        role: '',
        year: '',
        url: '',
        currentImage: ''
      },
      selectedFile: null,
      errorMessage: ''
    };
  },
  created() {
    this.loadProjects();
  },
  methods: {
    async loadProjects() {
      try {
        const response = await ApiService.getProjects();
        this.projects = response.data;
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async handleSubmit() {
      try {
        this.errorMessage = '';
        const formData = new FormData();
        
        formData.append('title', this.formData.title);
        formData.append('description', this.formData.description || '');
        formData.append('role', this.formData.role || '');
        formData.append('year', this.formData.year || '');
        formData.append('url', this.formData.url || '');
        
        if (this.selectedFile) {
          formData.append('image', this.selectedFile);
        }

        if (this.editingProject) {
          await ApiService.updateProject(this.editingProject.id, formData);
        } else {
          formData.append('display_order', this.projects.length);
          await ApiService.createProject(formData);
        }

        await this.loadProjects();
        this.cancelForm();
      } catch (error) {
        console.error('Failed to save project:', error);
        this.errorMessage = error.response?.data?.error || 'Failed to save project';
      }
    },
    startEdit(project) {
      this.editingProject = project;
      this.formData = {
        title: project.title,
        description: project.description || '',
        role: project.role || '',
        year: project.year || '',
        url: project.url || '',
        currentImage: project.image
      };
      this.showAddForm = false;
      this.selectedFile = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    cancelForm() {
      this.showAddForm = false;
      this.editingProject = null;
      this.formData = {
        title: '',
        description: '',
        role: '',
        year: '',
        url: '',
        currentImage: ''
      };
      this.selectedFile = null;
      this.errorMessage = '';
    },
    async deleteProject(id) {
      if (!confirm('Are you sure you want to delete this project?')) {
        return;
      }

      try {
        await ApiService.deleteProject(id);
        await this.loadProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      }
    },
    async moveUp(index) {
      if (index === 0) return;
      
      const newOrder = [...this.projects];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      
      await this.saveOrder(newOrder);
    },
    async moveDown(index) {
      if (index === this.projects.length - 1) return;
      
      const newOrder = [...this.projects];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      
      await this.saveOrder(newOrder);
    },
    async saveOrder(newOrder) {
      try {
        const projectIds = newOrder.map(p => p.id);
        await ApiService.reorderProjects(projectIds);
        this.projects = newOrder;
      } catch (error) {
        console.error('Failed to reorder projects:', error);
        alert('Failed to reorder projects');
      }
    },
    getImageUrl(image) {
      if (!image) return 'https://via.placeholder.com/150';
      if (image.startsWith('http')) return image;
      if (image.startsWith('/uploads/')) {
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');
        return `${baseUrl}${image}`;
      }
      return image;
    }
  }
};
</script>

<style scoped>
.admin-projects {
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

.project-form {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.project-form h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.current-image {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
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

.projects-list {
  margin-top: 30px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

.project-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-item {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  align-items: start;
}

.project-image img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.project-details h3 {
  margin: 0 0 10px 0;
}

.project-details p {
  margin: 5px 0;
  color: #666;
}

.description {
  margin-top: 10px;
  line-height: 1.5;
}

.project-actions {
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
  .form-row {
    grid-template-columns: 1fr;
  }

  .project-item {
    grid-template-columns: 1fr;
  }

  .project-actions {
    flex-direction: row;
  }
}
</style>
