<template>
  <div>
    <v-banner
      v-model="wikiPanelVisible"
      tile
      single-line
      transition="slide-y-transition"
    >
      <v-row>
        <v-col cols="4">
          <wikiCategories />
        </v-col>
        <v-col cols="8">
          <wikiLastArticles />
          <wikiFavoriteArticles />
        </v-col>
      </v-row>
    </v-banner>
    <v-row>
      <v-col>
        <wikiArticlesGrid />
      </v-col>
    </v-row>
    <newWikiCategory />
    <editWikiCategory />
    <newWikiArticleAdd />
  </div>
</template>

<script>
// import kanban from './Kanban'
import { mapFields } from 'vuex-map-fields'
import utils from '../../config/utils'
import wikiCategories from './WikiCategories'
import newWikiCategory from './dialogs/NewWikiCategory'
import editWikiCategory from './dialogs/EditWikiCategory'
import wikiArticlesGrid from './WikiArticlesGrid'
import newWikiArticleAdd from './dialogs/NewWikiArticleAdd'
import wikiLastArticles from './WikiLastArticles'
import wikiFavoriteArticles from './WikiFavoriteArticles'

export default {
  components: {
    // kanban,
    wikiCategories,
    newWikiCategory,
    editWikiCategory,
    wikiArticlesGrid,
    newWikiArticleAdd,
    wikiLastArticles,
    wikiFavoriteArticles
  },
  data: () => ({
    // panelVisible: true
  }),
  computed: {
    ...mapFields([
      'wikiPanelVisible'
    ])
  },
  mounted () {
    console.log('mounted')
    this.$store.dispatch('setWikiLoading', true)
    utils.getWikiCategories()
      .then(r => {
        this.$store.dispatch('setWikiCategories', r.data)
        this.$store.dispatch('setWikiFlatCategories', r.flat)
        // console.log(this.wikiFlatCategories)
      })
      .catch(e => console.log(e))
    const text = `SELECT id::INTEGER, category::INTEGER, name, description, icon, color, creator::INTEGER, updater::INTEGER, "dateCreated"::VARCHAR, "dateUpdated"::VARCHAR, false as hover FROM public.articles;`
    const values = []
    utils.getWikiArticles({ text, values })
      .then(r => {
        // this.wikiCategories = r.data
        this.$store.dispatch('setWikiArticles', r.data)
        console.log(r.data)
        this.$store.dispatch('setWikiLoading', false)
      })
      .catch(e => {
        console.log(e)
        this.$store.dispatch('setWikiLoading', false)
      })
  }
  // watch: {
  //   $route (to, from) {
  //     if (!to.query['page']) {
  //       this.$route.replace({ query: { page: '1', pages: '8' } })
  //     }
  //     console.log(to)
  //   }
  // }
}
</script>
