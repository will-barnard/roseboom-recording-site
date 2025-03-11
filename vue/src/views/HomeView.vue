<template>
  <div class="home">
    <img src="/img/homepage_photo.jpeg" class="responsive-img" />
    <p>Hi, thanks for dropping by! Roseboom Recording is the name I have given to my home studio in Chicago.<br><br>
      We have an amazing community of creatives helping run the show over here, including but not limited to: studio musicians, composers, photographers, videographers, producers, visual artists, film directors, etc. Remi the cat also lives in the studio as a heads up - she rocks.<br><br>
      The studio is semi-portable / remote recording is an option if you’d like to book a location away from the city for a few days.<br><br>
      Please send project inquiries to nathan@roseboomrecording.com
    </p>
    <div class="bottom-images">
      <img src="/img/remjag.jpg" class="responsive" />
      <img src="/img/goddesspainting.jpg" class="responsive" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
};
</script>

<style scoped>
.home {
  text-align: center; /* Center align all text */
}

.responsive-img {
  width: 100%;
  height: auto;
  border-radius: 5px; /* Rounded edges */
}

.bottom-images {
  display: flex;
  justify-content: center;
  gap: 10px; /* Add some space between images */
}

.bottom-images img {
  flex: 1;
  max-width: 50%; /* Ensure images are equally sized */
  height: auto;
  border-radius: 5px; /* Rounded edges */
}

@media (min-width: 769px) {
  .responsive-img {
    max-width: 50vw;
  }
}
</style>
