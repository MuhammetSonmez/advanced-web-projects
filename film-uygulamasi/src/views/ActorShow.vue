<template>
  <section>
    
    <h1>{{actor.name}}</h1>
    <img :src="`/images/${actor.image}`" :alt="actor.name" style="height: 350px;">
    <p>{{actor.description}}</p>
  </section>
</template>
<script>
import sourceData from '@/data.json'
export default {
  props:{
    id: {type: Number, required: true,},
    actorSlug: {type: String, required: true,}
  },
  computed:{
    movie(){
      return sourceData.movies.find(
        movie => movie.id === this.id
      )
    },
    actor(){
      return this.movie.actors.find(
        actor=> actor.slug === this.actorSlug
      )
    }
  }
}
</script>