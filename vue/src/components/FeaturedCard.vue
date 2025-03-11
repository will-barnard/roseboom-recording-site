<template>
  <div class="featured-card">
    <div class="image-container">
      <img :src="featuredWork.image" alt="Featured Image" @click="$router.push({name: 'featured-detail', params: {id: featuredWork.id}})" />
      <h4 class="desktop-title">{{ featuredWork.title }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    featuredWork: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.featured-card {
  text-align: center;
  margin: 20px;
}

.image-container {
  position: relative;
}

.featured-card img {
  width: 100%;
  height: auto;
  border-radius: 5px; /* Rounded edges */
  transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out; /* Smooth transition for transform and filter */
}

@media (max-width: 768px) {
  .featured-card img {
    max-width: 100%; /* Ensure images fit within the screen on mobile */
  }
  .desktop-title {
    display: none; /* Hide title on mobile */
  }
}

@media (min-width: 769px) {
  .desktop-title {
    display: none; /* Initially hide title on desktop */
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    opacity: 0; /* Start with opacity 0 */
    transition: opacity 0.8s ease-in-out, transform 0.3s ease-in-out; /* Smooth transition for opacity and transform */
    width: 100%; /* Ensure title spans the width of the image */
    text-align: center;
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }

  .image-container:hover .desktop-title {
    display: block; /* Display title on hover */
    opacity: 1; /* Change opacity to 1 on hover */
  }

  .image-container:hover img {
    transform: scale(1.05); /* Slightly enlarge image on hover */
    filter: brightness(0.7); /* Darken image on hover */
  }
}

.featured-card h2 {
  margin: 10px 0;
}

.featured-card p {
  margin: 5px 0;
}

.featured-card a {
  color: blue;
  text-decoration: none;
}

.featured-card a:hover {
  text-decoration: underline;
}
</style>