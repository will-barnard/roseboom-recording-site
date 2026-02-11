<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <button @click="logout" class="btn-logout">Logout</button>
    </div>

    <div class="dashboard-nav">
      <button 
        @click="activeTab = 'home'" 
        :class="{ active: activeTab === 'home' }"
        class="tab-btn"
      >
        Home Content
      </button>
      <button 
        @click="activeTab = 'projects'" 
        :class="{ active: activeTab === 'projects' }"
        class="tab-btn"
      >
        Manage Projects
      </button>
      <button 
        @click="activeTab = 'videos'" 
        :class="{ active: activeTab === 'videos' }"
        class="tab-btn"
      >
        Manage Videos
      </button>
      <button 
        @click="activeTab = 'password'" 
        :class="{ active: activeTab === 'password' }"
        class="tab-btn"
      >
        Change Password
      </button>
    </div>

    <div class="dashboard-content">
      <AdminHomeContent v-if="activeTab === 'home'" />
      <AdminProjects v-if="activeTab === 'projects'" />
      <AdminVideos v-if="activeTab === 'videos'" />
      <AdminChangePassword v-if="activeTab === 'password'" />
    </div>
  </div>
</template>

<script>
import AdminHomeContent from '../components/AdminHomeContent.vue';
import AdminProjects from '../components/AdminProjects.vue';
import AdminVideos from '../components/AdminVideos.vue';
import AdminChangePassword from '../components/AdminChangePassword.vue';

export default {
  name: 'AdminDashboardView',
  components: {
    AdminHomeContent,
    AdminProjects,
    AdminVideos,
    AdminChangePassword
  },
  data() {
    return {
      activeTab: 'home'
    };
  },
  methods: {
    logout() {
      this.$store.commit('LOGOUT');
      this.$router.push({ name: 'home' });
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.dashboard-header h1 {
  margin: 0;
  color: #333;
}

.btn-logout {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c82333;
}

.dashboard-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tab-btn {
  padding: 12px 24px;
  background: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: #e0e0e0;
}

.tab-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.dashboard-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
