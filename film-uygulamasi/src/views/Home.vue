<template>
  <div class="home">
    <div style="text-align: center;">
      <h1>Tüm Filmler</h1>
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Film arayın..." 
        class="search-input"
      />
    </div>
    <div class="movies">
      <div
        v-for="movie in filteredMovies"
        :key="movie.id"
        class="movie-card"
      >
        <router-link
          :to="{ name: 'movie.show', params: { id: movie.id, slug: movie.slug } }"
        >
          <h2 class="movie-title">{{ movie.name }}</h2>
          <img :src="`/images/${movie.image}`" :alt="movie.name" class="movie-image" />
          <p class="rating">
            <span v-for="n in 10" :key="n" class="star" :class="{ filled: n <= Math.floor(movie.score) }">
              &#9733;
              <span 
                v-if="n === Math.ceil(movie.score)" 
                class="partial-star" 
                :style="{ width: (movie.score % 1) * 100 + '%' }"
              >
                &#9733;
              </span>
            </span>
            <p>{{ movie.score }}</p>
          </p>
          <p>Yorum Sayısı: {{ movie.commentCount }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import sourceData from "@/data.json";

export default {
  data() {
    return {
      movies: this.addCommentCounts(sourceData.movies),
      searchQuery: '',
    };
  },
  computed: {
    filteredMovies() {
      const query = this.searchQuery.toLowerCase();
      return this.movies.filter(movie => 
        movie.name.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    addCommentCounts(movies) {
      return movies.map(movie => {
        const commentCount = movie.comments ? movie.comments.length : 0;
        return { ...movie, commentCount };
      });
    }
  }
};
</script>

<style scoped>
.movies {
  display: flex;
  flex-wrap: wrap; 
  justify-content: space-between; 
}
.movie-card {
  width: calc(25% - 10px); 
  margin: 5px; 
  padding: 10px;
  border: 1px solid #444;
  border-radius: 5px;
  text-align: center;
  background-color: #333; 
  color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); 
}
.movie-title {
  margin-bottom: 10px; 
  font-size: 1.2em;
  line-height: 1.3;
  color: #fff;
}
.movie-image {
  width: 100%; 
  height: 250px;
  object-fit: cover;
  border-radius: 5px;
}
.search-input {
  width: 60%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #444;
  color: #fff;
}
.rating {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  position: relative;
}
.star {
  font-size: 1.5em;
  color: #999;
  position: relative;
}
.star.filled {
  color: #ff0;
}
.partial-star {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  display: inline-block;
  height: 100%;
  color: #ff0;
}
</style>
