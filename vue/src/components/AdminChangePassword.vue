<template>
  <div class="change-password">
    <h2>Change Password</h2>
    
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <form @submit.prevent="changePassword">
      <div class="form-group">
        <label for="currentPassword">Current Password:</label>
        <input
          type="password"
          id="currentPassword"
          v-model="formData.currentPassword"
          required
          minlength="6"
        />
      </div>

      <div class="form-group">
        <label for="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          v-model="formData.newPassword"
          required
          minlength="6"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm New Password:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="formData.confirmPassword"
          required
          minlength="6"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Changing...' : 'Change Password' }}
      </button>
    </form>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'AdminChangePassword',
  data() {
    return {
      formData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      message: '',
      messageType: '',
      loading: false
    };
  },
  methods: {
    async changePassword() {
      // Clear previous message
      this.message = '';
      
      // Validate passwords match
      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.message = 'New passwords do not match';
        this.messageType = 'error';
        return;
      }

      // Validate password length
      if (this.formData.newPassword.length < 6) {
        this.message = 'New password must be at least 6 characters';
        this.messageType = 'error';
        return;
      }

      this.loading = true;

      try {
        await ApiService.changePassword({
          currentPassword: this.formData.currentPassword,
          newPassword: this.formData.newPassword
        });

        this.message = 'Password changed successfully!';
        this.messageType = 'success';
        
        // Clear form
        this.formData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };

      } catch (error) {
        console.error('Error changing password:', error);
        this.message = error.response?.data?.error || 'Failed to change password';
        this.messageType = 'error';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.change-password {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.message {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

button {
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

button:hover:not(:disabled) {
  background-color: #357abd;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
