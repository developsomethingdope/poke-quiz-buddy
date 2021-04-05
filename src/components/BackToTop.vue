<template>
  <div class="button button-top" @click="topClickHandler">Back to top</div>
</template>

<script>
export default {
  name: 'BackToTop',
  setup()
  {
    const topClickHandler = () =>
    {
      window.scrollTo(
      {
        top: 0,
        behavior: 'smooth'
      });
    };

    return { topClickHandler };
  }
}
</script>
