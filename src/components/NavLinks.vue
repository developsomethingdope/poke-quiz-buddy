<template>
  <div class="nav-links">
    <div v-if="link_type == 'NO_HOME_LINK'">
      <router-link :to="{ name: 'FavoritePage' }">Favorite</router-link> | 
      <router-link :to="{ name: 'QuizPage' }">Quiz</router-link> | 
      <router-link :to="{ name: 'AboutPage' }">About</router-link>
    </div>
    <div v-else-if="link_type == 'NO_FAVORITE_LINK'">
      <router-link :to="{ name: 'HomePage' }">Home</router-link> | 
      <router-link :to="{ name: 'QuizPage' }">Quiz</router-link> | 
      <router-link :to="{ name: 'AboutPage' }">About</router-link>
    </div>
    <div v-else-if="link_type == 'NO_QUIZ_LINK'">
      <router-link :to="{ name: 'HomePage' }">Home</router-link> | 
      <router-link :to="{ name: 'FavoritePage' }">Favorite</router-link> | 
      <router-link :to="{ name: 'AboutPage' }">About</router-link>
    </div>
    <div v-else-if="link_type == 'NO_ABOUT_LINK'">
      <router-link :to="{ name: 'HomePage' }">Home</router-link> | 
      <router-link :to="{ name: 'FavoritePage' }">Favorite</router-link> | 
      <router-link :to="{ name: 'QuizPage' }">Quiz</router-link>
    </div>
    <div v-else-if="link_type == 'HOME_ABOUT_LINK'">
      <router-link :to="{ name: 'HomePage' }">Home</router-link> | 
      <router-link :to="{ name: 'AboutPage' }">About</router-link>
    </div>
    <div v-else>
      <router-link :to="{ name: 'HomePage' }">Home</router-link> | 
      <router-link :to="{ name: 'FavoritePage' }">Favorite</router-link> | 
      <router-link :to="{ name: 'QuizPage' }">Quiz</router-link> | 
      <router-link :to="{ name: 'AboutPage' }">About</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavLinks',
  props: 
  {
    //// link_type: NO_HOME_LINK, NO_FAVORITE_LINK, NO_QUIZ_LINK, NO_ABOUT_LINK, HOME_ABOUT_LINK, ALL_LINK
    link_type: String
  }
}
</script>
