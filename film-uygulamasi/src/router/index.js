import {createRouter, createWebHistory, useRoute} from 'vue-router'
import Home from '@/views/Home.vue'
import sourceData from '@/data.json'

const routes = [
  {path: '/', name: 'Home', component: Home, alias: "/home"},

  {
    path: '/movie/:id/:slug', 
    name: 'movie.show', 
    component: ()=>import('@/views/MoviesShow.vue'),
    props: route=> ({...route.params, id: parseInt(route.params.id)}),
    beforeEnter(to, from){
      const exists = sourceData.movies.find(
        movie => movie.id === parseInt(to.params.id)
      )
      if(!exists) return {
        name: 'NotFound',
        params: { pathMatch: to.path.split('/').slice(1) },
        query: to.query,
        hash: to.hash,
      }
    },
    children:[
      {
        path: ':actorSlug',
        name: 'actor.show',
        component: () => import('@/views/actorShow.vue'),
        props: route=> ({...route.params, id: parseInt(route.params.id)})
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ()=> import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || new Promise((resolve)=>{
      setTimeout(()=> resolve({ top:0 }), 300)
    })
  }
})

export default router