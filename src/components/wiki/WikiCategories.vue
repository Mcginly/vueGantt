<template>
  <div v-if="wikiCategories">
    <v-row
      dense
      class="pa-2"
    >
      <v-card
        width="600"
        rounded
      >
        <v-app-bar
          flat
          dense
          color="blue-grey lighten-5"
          @mouseover="hover = true"
          @mouseleave="hover = false"
        >
          <!-- <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon> -->
          <v-toolbar-title class="body-1 font-weight-bold pl-0">
            Категории
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="hover"
            color="blue-grey lighten-1"
            small
            icon
            @click="dialogNewCatWiki = true"
          >
            <v-icon small>fa fa-plus-square-o</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text class="pa-1" v-if="wikiCategories && wikiCategories.length > 0">
          <v-treeview
            :items="wikiCategories"
            :active.sync="wikiActiveCategory"
            item-key="id"
            hoverable
            activatable
            selection-type="leaf"
            color="wasdlight"
            dense
            open-all
          >
            <template v-slot:prepend="{ item }">
              <v-icon
                v-if="(item.children && item.children.length > 0) || item.icon"
                v-text="`${item.icon ? item.icon : 'fa fa-folder-open'}`"
                :color="item.color"
              ></v-icon>
            </template>
            <template v-slot:label="{ item }">
              <div
                @mouseover="item.hover = true"
                @mouseleave="item.hover = false"
                @click="log(item)"
              >
                {{ item.name }}
                <v-btn
                  v-if="item.hover"
                  color="blue-grey lighten-1"
                  small
                  icon
                  @click="editCategory(item)"
                >
                  <v-icon small>fa fa-pencil</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:append="{ item }">
              <div :class="item.articles && item.articles > 0 ? '' : 'caption'">({{ item.articles }})</div>
            </template>
          </v-treeview>
        </v-card-text>
        <!-- <v-divider />
        <v-card-actions class="pa-0">
          <v-spacer />
          <v-btn
            color="blue-grey lighten-1"
            small
            icon
          >
            <v-icon small>fa fa-plus-square-o</v-icon>
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-row>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import utils from '../../config/utils'

export default {
  name: 'wikiCategories',
  data: () => ({
    // tree: [],
    hover: false
  }),
  computed: {
    // ...mapGetters([
    //   'dialogBeforeCreate'
    // ]),
    ...mapFields([
      'wikiCategories',
      'wikiFlatCategories',
      'dialogNewCatWiki',
      'dialogEditCatWiki',
      'wikiActiveCategory',
      'editedWikiCategory',
      'wikiArticles',
      'wikiLoading',
      'wikiSelectedTree',
      'wikiGridTitle'
    ])
  },
  beforeCreate () {
    // utils.getWikiCategories()
    //   .then(r => {
    //     this.wikiCategories = r.data
    //     this.wikiFlatCategories = r.flat
    //     // console.log(this.wikiFlatCategories)
    //   })
    //   .catch(e => console.log(e))
  },
  methods: {
    editCategory (item) {
      this.editedWikiCategory = { ...item }
      // console.log(this.editedWikiCategory)
      this.dialogEditCatWiki = true
    },
    log (item) {
      function addChildren (child, selected) {
        for (let i = 0; i < child.length; i++) {
          selected.push(child[i].id)
          if (child[i].children.length > 0) {
            addChildren(child[i].children, selected)
          }
        }
        return selected
      }
      let selected = []
      selected.push(item.id)
      if (item.children.length > 0) {
        addChildren(item.children, selected)
      }
      this.wikiSelectedTree = selected.sort((a, b) => a - b)
      // this.wikiActiveCategory = this.wikiSelectedTree
      console.log(item, this.wikiSelectedTree)
      this.getArticleByCategory(item)
    },
    getArticleByCategory (item) {
      this.$store.dispatch('setWikiLoading', true)
      let text = ''
      let values = []
      if (item.id === 1) {
        text = `SELECT id::INTEGER, category::INTEGER, name, description, icon, color, creator::INTEGER, updater::INTEGER, "dateCreated"::VARCHAR, "dateUpdated"::VARCHAR, false as hover FROM public.articles;`
        values = []
        this.wikiGridTitle = 'Все категории'
      } else {
        let params = ''
        for (let p = 0; p < this.wikiSelectedTree.length; p++) {
          params += `$${p + 1}${this.wikiSelectedTree.length > 0 && this.wikiSelectedTree.length !== p + 1 ? ',' : ''}`
        }
        text = `SELECT id::INTEGER, category::INTEGER, name, description, icon, color, creator::INTEGER, updater::INTEGER, "dateCreated"::VARCHAR, "dateUpdated"::VARCHAR, false as hover FROM public.articles where category in (${params});`
        values = this.wikiSelectedTree
        this.wikiGridTitle = item.name
      }
      utils.getWikiArticles({ text, values })
        .then(r => {
          // this.wikiCategories = r.data
          this.$store.dispatch('setWikiArticles', r.data)
          // console.log(r.data)
          this.$store.dispatch('setWikiLoading', false)
        })
        .catch(e => {
          console.log(e)
          this.$store.dispatch('setWikiLoading', false)
        })
    }
  }
}
</script>
