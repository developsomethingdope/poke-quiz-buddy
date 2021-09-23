<template>
  <div>
    <div class="page-top">
      <div class="links">
        <NavLinks link_type="NO_ABOUT_LINK" />
      </div>
      <div class="title">about</div>
    </div>

    <div class="page-bottom section-about" :class="generalStore.isFavoriteAbout && 'section-about-favorite'">
      <div class="section-subtitle">Poke-Quiz-Buddy v1.2</div>
      <div class="about-favorite">
        <div class="favorite-toggle">
          <div v-if="generalStore.isFavoriteAbout" class="toggle-label">Favorite</div>
          <div v-else class="toggle-label">Not Favorite</div>
          <label class="toggle-switch">
            <input type="checkbox" :checked="generalStore.isFavoriteAbout" @change="toggleChangeHandler" />
            <span class="switch-slider switch-round"></span>
          </label>
        </div>
      </div>
      <p>Features:</p>
      <ul>
        <li>Show random monsters</li>
        <li>Set monster as favorite</li>
        <li>Show favorite monsters</li>
        <li>More info for each monster</li>
        <li>Create quiz</li>
        <li>Data taken from <a href="https://pokeapi.co">API 1</a> and <a href="https://opentdb.com/api_config.php">API 2</a></li>
      </ul>
      <p>
        Source: <a href="https://github.com/developsomethingdope/poke-quiz-buddy">GitHub</a><br />
        See more: <a href="https://develop-something-dope.netlify.app">My Portfolio website</a><br />
        About me: <a href="https://www.linkedin.com/in/edward-kwong-03a783184">Linkedin</a><br /><br />
        Copyright &copy; {{ currentYear }}
      </p>
    </div> <!-- end page-bottom -->
  </div>
</template>

<script>
//// using options api

import NavLinks from "../components/NavLinks";
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AboutPage',
  components: 
  {
    NavLinks
  },
  computed:
  {
    ...mapState(['generalStore']),
    currentYear() { return (new Date()).getFullYear(); }
  },
  methods:
  {
    ...mapActions(['doSetIsFavoriteAbout']),
    toggleChangeHandler()
    {
      this.doSetIsFavoriteAbout(!this.generalStore.isFavoriteAbout);
    }
  }
}
</script>
