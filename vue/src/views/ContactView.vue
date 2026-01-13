<template>
  <div class="contact-container">
    <div class="contact-content">
      <div class="contact-image-wrapper">
        <img src="/img/contact-image.png" alt="Contact" class="contact-image" />
      </div>
      <div class="contact-info">
        <h1>Contact</h1>
        <p class="email">nathan@roseboomrecording.com</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView'
};
</script>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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
