<template>
  <div>
    <section v-if="movie" class="movie">
      <GoBack />
      <h1>{{ movie.name }}</h1>
      <div class="movie-details">
        <img :src="`/images/${movie.image}`" :alt="movie.name" style="width: 175px; height: 330px;"/>
        <p>{{ movie.description }}</p>
      </div>
    </section>
    <section class="actors">
      <h2>{{ movie.name }} Filmindeki Oyuncular  </h2>
      <div class="cards">
        <router-link
          v-for="actor in movie.actors"
          :key="actor.slug"
          :to="{ name: 'actor.show', params: { actorSlug: actor.slug } }"
        >
          <actorCard :actor="actor" />
        </router-link>
      </div>
      <router-view />
    </section>
    
    <Comments v-if="movie && movie.comments" :comments="movie.comments" />
  </div>
</template>

<script>
import sourceData from "@/data.json";
import actorCard from "@/components/ActorCard.vue";
import GoBack from '@/components/GoBack.vue';
import Comments from '@/components/Comments.vue';

export default {
  components: { actorCard, GoBack, Comments },
  props: {
    id: { type: Number, required: true },
  },
  computed: {
    movie() {
      return sourceData.movies.find(
        (movie) => movie.id === this.id
      );
    },
  },
};
</script>
