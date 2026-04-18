<template>
  <div class="admin-users">
    <h2>Manage Users</h2>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <!-- Create User Form -->
    <div class="create-user-section">
      <h3>Create New User</h3>
      <form @submit.prevent="createUser" class="create-form">
        <div class="form-row">
          <div class="form-group">
            <label for="newUsername">Username</label>
            <input id="newUsername" v-model="newUser.username" required />
          </div>
          <div class="form-group">
            <label for="newEmail">Email</label>
            <input id="newEmail" v-model="newUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label for="newPassword">Password</label>
            <input id="newPassword" v-model="newUser.password" type="password" required minlength="6" />
          </div>
          <button type="submit" :disabled="creating" class="btn-create">
            {{ creating ? 'Creating...' : 'Create User' }}
          </button>
        </div>
      </form>
    </div>

    <!-- User List -->
    <div class="users-list">
      <h3>Users</h3>
      <div v-if="loading" class="loading">Loading users...</div>
      <table v-else-if="users.length">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <!-- Username cell -->
            <td>
              <template v-if="editingId === user.id">
                <input v-model="editFields.username" class="edit-input" />
              </template>
              <template v-else>{{ user.username }}</template>
            </td>
            <!-- Email cell -->
            <td>
              <template v-if="editingId === user.id">
                <input v-model="editFields.email" type="email" class="edit-input" />
              </template>
              <template v-else>{{ user.email }}</template>
            </td>
            <td>
              <span class="badge" :class="user.is_admin ? 'badge-admin' : 'badge-user'">
                {{ user.is_admin ? 'Admin' : 'User' }}
              </span>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td class="actions-cell">
              <!-- Edit / Save / Cancel -->
              <template v-if="editingId === user.id">
                <button @click="saveEdit(user)" class="btn-save">Save</button>
                <button @click="cancelEdit" class="btn-cancel">Cancel</button>
              </template>
              <button v-else @click="startEdit(user)" class="btn-edit">Edit</button>

              <div class="reset-password-inline">
                <input
                  v-model="resetPasswords[user.id]"
                  type="password"
                  placeholder="New password"
                  minlength="6"
                  class="reset-input"
                />
                <button
                  @click="resetPassword(user)"
                  :disabled="!resetPasswords[user.id] || resetPasswords[user.id].length < 6"
                  class="btn-reset"
                >
                  Reset
                </button>
              </div>
              <button
                v-if="user.id !== currentUserId"
                @click="deleteUser(user)"
                class="btn-delete"
              >
                Delete
              </button>
              <span v-else class="you-label">(you)</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No users found.</p>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'AdminUsers',
  data() {
    return {
      users: [],
      loading: false,
      creating: false,
      message: '',
      messageType: '',
      newUser: {
        username: '',
        email: '',
        password: ''
      },
      resetPasswords: {},
      editingId: null,
      editFields: { username: '', email: '' }
    };
  },
  computed: {
    currentUserId() {
      return this.$store.state.user?.id;
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await ApiService.getUsers();
        this.users = response.data;
      } catch (error) {
        this.showMessage('Failed to load users', 'error');
      } finally {
        this.loading = false;
      }
    },
    async createUser() {
      this.creating = true;
      this.message = '';
      try {
        await ApiService.createUser(this.newUser);
        this.showMessage(`User "${this.newUser.username}" created`, 'success');
        this.newUser = { username: '', email: '', password: '' };
        await this.fetchUsers();
      } catch (error) {
        const msg = error.response?.data?.error || 'Failed to create user';
        this.showMessage(msg, 'error');
      } finally {
        this.creating = false;
      }
    },
    async resetPassword(user) {
      const password = this.resetPasswords[user.id];
      if (!password || password.length < 6) return;

      try {
        await ApiService.resetUserPassword(user.id, password);
        this.showMessage(`Password reset for "${user.username}"`, 'success');
        this.resetPasswords[user.id] = '';
      } catch (error) {
        const msg = error.response?.data?.error || 'Failed to reset password';
        this.showMessage(msg, 'error');
      }
    },
    async deleteUser(user) {
      if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;

      try {
        await ApiService.deleteUser(user.id);
        this.showMessage(`User "${user.username}" deleted`, 'success');
        await this.fetchUsers();
      } catch (error) {
        const msg = error.response?.data?.error || 'Failed to delete user';
        this.showMessage(msg, 'error');
      }
    },
    startEdit(user) {
      this.editingId = user.id;
      this.editFields = { username: user.username, email: user.email };
    },
    cancelEdit() {
      this.editingId = null;
      this.editFields = { username: '', email: '' };
    },
    async saveEdit(user) {
      const { username, email } = this.editFields;
      if (!username || !email) {
        this.showMessage('Username and email cannot be empty', 'error');
        return;
      }
      try {
        const response = await ApiService.updateUser(user.id, { username, email });
        this.showMessage(`User updated`, 'success');
        // Update local list
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
          this.users[idx] = { ...this.users[idx], ...response.data };
        }
        this.cancelEdit();
      } catch (error) {
        const msg = error.response?.data?.error || 'Failed to update user';
        this.showMessage(msg, 'error');
      }
    },
    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.admin-users {
  padding: 20px 0;
}

.admin-users h2 {
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

.create-user-section {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.create-user-section h3 {
  margin: 0 0 12px;
  color: #333;
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.btn-create {
  padding: 8px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  height: 36px;
}

.btn-create:hover:not(:disabled) {
  background: #218838;
}

.btn-create:disabled {
  background: #999;
  cursor: not-allowed;
}

.users-list {
  margin-top: 8px;
}

.users-list h3 {
  margin: 0 0 12px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background: #f5f5f5;
  font-weight: 600;
  font-size: 13px;
  color: #555;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-admin {
  background: #007bff;
  color: white;
}

.badge-user {
  background: #e0e0e0;
  color: #555;
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.reset-password-inline {
  display: flex;
  gap: 4px;
  align-items: center;
}

.reset-input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  width: 130px;
}

.btn-reset {
  padding: 4px 12px;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-reset:hover:not(:disabled) {
  background: #e0a800;
}

.btn-reset:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete {
  padding: 4px 12px;
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

.you-label {
  font-size: 13px;
  color: #999;
  font-style: italic;
}

.btn-edit {
  padding: 4px 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-edit:hover {
  background: #5a6268;
}

.btn-save {
  padding: 4px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-save:hover {
  background: #218838;
}

.btn-cancel {
  padding: 4px 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-cancel:hover {
  background: #5a6268;
}

.edit-input {
  padding: 4px 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 13px;
  width: 140px;
}

.loading {
  color: #666;
  padding: 20px 0;
}
</style>
