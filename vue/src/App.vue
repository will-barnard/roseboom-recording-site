<template>
  <div id="roseboom-recording" @click="closeMenu">
    <div id="header">
      <div id="nav-left" class="nav-desktop">
        <p :class="{ active: $route.name === 'featured' }" @click="$router.push({ name: 'featured' })">Featured Work</p>
      </div>
      <div id="logo-container">
        <div id="logo" @click="$router.push({ name: 'home' })">
          <img src="/img/logo.png" alt="Logo" />
        </div>
      </div>
      <div id="nav-right" class="nav-desktop">
        <p :class="{ active: $route.name === 'video' }" @click="$router.push({ name: 'video' })">Video</p>
        <div class="spacer"></div>
        <p :class="{ active: $route.name === 'contact' }" @click="$router.push({ name: 'contact' })">Contact</p>
        <div class="flex-spacer"></div>
        <template v-if="$store.state.token != ''">
          <p :class="{ active: $route.name === 'admin-dashboard' }" @click="$router.push({ name: 'admin-dashboard' })">Admin</p>
          <div class="spacer"></div>
          <p :class="{ active: $route.name === 'logout' }" @click="$router.push({ name: 'logout' })">Logout</p>
        </template>
      </div>
      <div id="nav-mobile" class="nav-mobile" @click.stop>
        <button @click="toggleMenu">☰</button>
      </div>
    </div>
    <div :class="{'dropdown-menu': true, 'open': menuOpen}">
      <p @click="$router.push({ name: 'featured' })">Featured Work</p>
      <p @click="$router.push({ name: 'video' })">Video</p>
      <p @click="$router.push({ name: 'contact' })">Contact</p>
      <template v-if="$store.state.token != ''">
        <p @click="$router.push({ name: 'admin-dashboard' })">Admin</p>
        <p @click="$router.push({ name: 'logout' })">Logout</p>
      </template>
    </div>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      if (this.menuOpen) {
        this.menuOpen = false;
      }
    }
  }
};
</script>

<style>
#roseboom-recording {
  margin-top: 40px; /* Increased top margin */
  text-align: center; /* Center align all text */
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Set site font */
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 20px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1001;
  box-sizing: border-box;
}

#logo-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
}

#logo {
  cursor: pointer;
}

#logo img {
  max-width: 120px;
  border-radius: 5px;
}

#nav-left {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-right: 60px;
}

#nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  padding-left: 60px;
}

#nav-left p,
#nav-right p {
  cursor: pointer;
  color: inherit; /* Normal text color */
  text-decoration: none; /* No underline */
}

#nav-left p:hover,
#nav-left p:active,
#nav-right p:hover,
#nav-right p:active {
  text-decoration: underline; /* Underline on hover and click */
}

#nav-left p.active,
#nav-right p.active {
  text-decoration: underline; /* Underline for active page */
}

.spacer {
  width: 20px; /* Spacer div of 20px width */
}

.flex-spacer {
  flex-grow: 1; /* Grows to fill available space */
}

#nav-mobile {
  display: none;
  justify-content: flex-end;
  align-items: center; /* Center align the hamburger button */
  z-index: 1002; /* Ensure it overlays the top nav */
}

#nav-mobile button {
  font-size: 48px; /* Increased size for hamburger button */
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0; /* Closer to the right edge */
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  width: 40%;
  height: 100%;
  z-index: 1003; /* Ensure it overlays the hamburger button */
  padding: 20px;
  overflow-y: auto; /* Allow scrolling if content overflows */
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.dropdown-menu.open {
  transform: translateX(0);
}

.dropdown-menu p {
  cursor: pointer;
  color: inherit; /* Normal text color */
  text-decoration: none; /* No underline */
}

.dropdown-menu p:hover,
.dropdown-menu p:active {
  text-decoration: underline; /* Underline on hover and click */
}

#content {
  margin-top: 200px; /* Added more margin to account for fixed header with larger logo */
}

@media (min-width: 769px) {
  #header {
    padding-top: 80px; /* Move top area down even more on desktop */
  }
  #content {
    margin-top: 240px; /* Extra margin on desktop for larger header */
  }
}

@media (max-width: 768px) {
  #logo-container {
    justify-content: flex-start;
    position: static;
    transform: none;
    margin: 0;
  }
  #logo {
    margin: 5px 0 0 10px; /* Less top margin and closer to the left */
  }
  #logo img {
    max-width: 90px; /* Increased size for mobile */
  }
  #nav-left,
  #nav-right {
    display: none;
  }
  #nav-mobile {
    display: flex;
    justify-content: flex-end;
    align-items: center; /* Center align the hamburger button */
    margin-right: 0; /* Closer to the right edge */
    margin-left: auto;
  }
  #header {
    justify-content: space-between;
  }
}

img {
  border-radius: 5px; /* Rounded edges for all images */
}
</style>
