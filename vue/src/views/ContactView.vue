<template>
  <div class="contact-container" :class="{ 'loaded': isLoaded }">
    <div class="contact-content">
      <div class="contact-image-wrapper fade-in">
        <img src="/img/contact-image.png" alt="Contact" class="contact-image" />
      </div>
      <div class="contact-info fade-in-delay">
        <h1>Contact</h1>
        <p class="email">nathan@roseboomrecording.com</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      isLoaded: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 50);
  }
};
</script>

<style scoped>
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in-delay {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s;
}

.contact-container.loaded .fade-in,
.contact-container.loaded .fade-in-delay {
  opacity: 1;
  transform: translateY(0);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.contact-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.contact-image-wrapper {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-image {
  width: 100%;
  height: auto;
  display: block;
  max-height: calc(100vh - 340px);
  object-fit: contain;
}

.contact-info {
  text-align: center;
}

.contact-info h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.email {
  font-size: 1.25rem;
  color: #666;
  word-break: break-all;
}

@media (min-width: 768px) {
  .contact-content {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .contact-image-wrapper {
    max-width: 500px;
  }

  .contact-info {
    text-align: left;
  }
}
</style>
