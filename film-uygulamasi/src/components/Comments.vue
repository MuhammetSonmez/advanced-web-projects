<template>
  <div class="comments">
    <h3>Yorumlar</h3>
    <ul>
      <li v-for="(comment, index) in comments" :key="index">
        <strong>{{ comment.user }}:</strong> {{ comment.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    comments: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.comments {
  margin-top: 20px;
  color: #dcdcdc;
}
.comments h3 {
  color: #ff0;
}
.comments ul {
  list-style: none;
  padding: 0;
}
.comments li {
  background-color: #444;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}
.comments strong {
  color: #ff0;
}
</style>
