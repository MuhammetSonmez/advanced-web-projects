<template>
  <div class="card">
    <img :src="`/images/${actor.image}`" :alt="actor.name" style="height: 350px;"/>
    <span class="card__text">
      {{ actor.name }}
    </span>
  </div>
</template>
<script>
export default {
  props:{
    actor:{type: Object, required: true,}
  }
}
</script>
