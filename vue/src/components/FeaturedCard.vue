<template>
  <div class="featured-card" @click="toggleExpand">
    <div class="image-container">
      <img :src="featuredWork.image" alt="Featured Image" />
      <h4 class="desktop-title">{{ featuredWork.title }}</h4>
    </div>
    <transition name="slide-fade">
      <div v-if="expanded" class="info-panel">
        <h3>{{ featuredWork.title }}</h3>
        <p class="description">{{ featuredWork.description }}</p>
        <p class="role"><strong>Role:</strong> {{ featuredWork.role }}</p>
        <p class="year"><strong>Year:</strong> {{ featuredWork.year }}</p>
        <a v-if="featuredWork.url" :href="featuredWork.url" target="_blank" @click.stop>View Project</a>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    featuredWork: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      expanded: false
    };
  },
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded;
    }
  }
};
</script>

<style scoped>
.featured-card {
  text-align: center;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  border: none;
  display: block;
}

.featured-card:hover {
  transform: translateY(-5px);
}

.image-container {
  position: relative;
  margin: 0;
  padding: 0;
  display: block;
}

.featured-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0;
  transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out;
  display: block;
  margin: 0;
  padding: 0;
}

.info-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  padding: 20px;
  border-radius: 0;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 10;
  max-height: 100%;
  overflow-y: auto;
}

.info-panel h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.info-panel .description {
  margin: 10px 0;
  line-height: 1.6;
  color: #555;
}

.info-panel .role,
.info-panel .year {
  margin: 8px 0;
  color: #666;
}

.info-panel a {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.info-panel a:hover {
  background-color: #357abd;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .featured-card img {
    max-width: 100%;
  }
  .desktop-title {
    display: none;
  }
}

@media (min-width: 769px) {
  .desktop-title {
    display: none;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 0;
    opacity: 0;
    transition: opacity 0.8s ease-in-out, transform 0.3s ease-in-out;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }

  .image-container:hover .desktop-title {
    display: block;
    opacity: 1;
  }

  .image-container:hover img {
    transform: scale(1.05);
    filter: brightness(0.7);
  }
}
</style>