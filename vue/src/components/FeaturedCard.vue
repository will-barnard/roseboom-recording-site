<template>
  <div class="featured-card" :class="{ 'card-visible': isVisible }" :data-card-index="index" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="image-container">
      <img :src="featuredWork.image" alt="Featured Image" />
      <div v-if="showOverlay" class="image-overlay"></div>
      <transition name="slide-fade">
        <div v-if="showInfo" class="info-panel">
          <h3>{{ featuredWork.title }}</h3>
          <p v-if="featuredWork.description" class="description">{{ featuredWork.description }}</p>
          <p v-if="featuredWork.role" class="role"><strong>Role:</strong> {{ featuredWork.role }}</p>
          <p v-if="featuredWork.year" class="year"><strong>Year:</strong> {{ featuredWork.year }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    featuredWork: {
      type: Object,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isHovering: false,
      isMobile: false
    };
  },
  computed: {
    showInfo() {
      if (this.isMobile) {
        return this.isExpanded;
      } else {
        return this.isHovering;
      }
    },
    showOverlay() {
      return this.showInfo;
    }
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    handleClick() {
      if (this.isMobile) {
        this.$emit('toggle', this.featuredWork.id);
      }
    },
    handleMouseEnter() {
      if (!this.isMobile) {
        this.isHovering = true;
      }
    },
    handleMouseLeave() {
      if (!this.isMobile) {
        this.isHovering = false;
      }
    }
  }
};
</script>

<style scoped>
.featured-card {
  text-align: center;
  margin: 0;
  padding: 0;
  position: relative;
  border: none;
  display: block;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.featured-card.card-visible {
  opacity: 1;
}

.featured-card:hover {
  z-index: 100;
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
  display: block;
  margin: 0;
  padding: 0;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  pointer-events: none;
}

.info-panel {
  position: absolute;
  top: 50%;
  left: 5%;
  right: 5%;
  transform: translateY(-50%);
  padding: 12px 18px;
  text-align: center;
  z-index: 10;
  max-height: 90%;
  overflow-y: auto;
  color: white;
  box-sizing: border-box;
}

.info-panel h3 {
  margin: 0 0 10px 0;
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.3;
  word-break: normal;
  overflow-wrap: break-word;
  hyphens: none;
}

.info-panel .description {
  margin: 8px 0;
  line-height: 1.5;
  color: #f0f0f0;
  font-size: 0.95rem;
  word-break: normal;
  overflow-wrap: break-word;
}

.info-panel .role,
.info-panel .year {
  margin: 5px 0;
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.slide-fade-enter-active {
  transition: opacity 0.5s ease;
}

.slide-fade-leave-active {
  transition: opacity 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
}

.slide-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .featured-card {
    cursor: pointer;
  }
  
  .info-panel {
    max-width: 90%;
    max-height: 90%;
    padding: 15px;
  }
}

@media (min-width: 769px) {
  .featured-card {
    cursor: default;
  }
}
</style>