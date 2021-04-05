<template>
  <div>
    <div class="page-top">
      <div class="links">
        <NavLinks link_type="HOME_ABOUT_LINK" />
      </div>
      <div class="title">error</div>
    </div>
    <div class="page-bottom section-error">
      <div class="section-subtitle">Something wrong here</div>
      <p>It's okay. Just click on any of the links above to continue.</p>
    </div>
  </div>
</template>

<script>
import NavLinks from "../components/NavLinks";

export default {
  name: 'ErrorPage',
  components: 
  {
    NavLinks
  }
}
</script>
