<template>
  <div class="content has-text-centered">
    <h1 class="is-title is-bold">Welcome NUE-UI</h1>

    <p>
      <strong></strong>
    </p>

    <p>from vue-admin</p>
  </div>
</template>

<script>
export default {

  data () {
    return this.$store.state.pkg
  }

}
</script>

<style lang="scss" scoped>
.is-title {
  text-transform: capitalize;
}
</style>
