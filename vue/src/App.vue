<template>
  <div id="roseboom-recording" @click="closeMenu">
    <div id="header" :style="headerStyle">
      <div id="nav-left" class="nav-desktop" :style="navLeftStyle">
        <p :class="{ active: $route.name === 'featured' }" @click="$router.push({ name: 'featured' })">Featured Work</p>
      </div>
      <div id="logo-container">
        <div id="logo" @click="$router.push({ name: 'home' })">
          <img src="/img/logo.png" alt="Logo" :style="logoStyle" />
        </div>
      </div>
      <div id="nav-right" class="nav-desktop" :style="navRightStyle">
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
      menuOpen: false,
      scrollProgress: 0,
      isMobile: false
    };
  },
  computed: {
    headerStyle() {
      if (this.isMobile) return {};
      const t = this.scrollProgress;
      const padTop = 80 - 70 * t;
      const padBot = 40 - 28 * t;
      return {
        paddingTop: padTop + 'px',
        paddingBottom: padBot + 'px'
      };
    },
    logoStyle() {
      if (this.isMobile) return {};
      const size = 120 - 50 * this.scrollProgress;
      return { maxWidth: size + 'px' };
    },
    navLeftStyle() {
      if (this.isMobile) return {};
      const pad = 60 - 30 * this.scrollProgress;
      return { paddingRight: pad + 'px' };
    },
    navRightStyle() {
      if (this.isMobile) return {};
      const pad = 60 - 30 * this.scrollProgress;
      return { paddingLeft: pad + 'px' };
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.checkMobile);
    this.checkMobile();
    this.handleScroll();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    handleScroll() {
      this.scrollProgress = Math.min(window.scrollY / 150, 1);
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
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
body {
  background-color: #e7e2de;
  margin: 0;
  padding: 0;
}

#roseboom-recording {
  margin-top: 0;
  text-align: center;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #e7e2de;
  min-height: 100vh;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 40px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #e7e2de;
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
  background-color: #e7e2de;
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
  margin-top: 200px;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  #content {
    margin-top: 240px;
    min-height: calc(100vh - 240px);
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
    margin: 0 0 0 10px;
  }
  #logo img {
    max-width: 60px;
  }
  #nav-left,
  #nav-right {
    display: none;
  }
  #nav-mobile {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 0;
    margin-left: auto;
  }
  #nav-mobile button {
    font-size: 36px;
  }
  #header {
    justify-content: space-between;
    padding: 10px 15px;
  }
  #content {
    margin-top: 90px;
  }
}

img {
  border-radius: 5px; /* Rounded edges for all images */
}
</style>
