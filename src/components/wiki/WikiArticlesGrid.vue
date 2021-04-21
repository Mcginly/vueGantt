<template>
  <div>
    <v-card
      rounded
    >
      <v-app-bar
        flat
        dense
        color="wasdmedium"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <!-- <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon> -->
        <v-toolbar-title class="body-1 font-weight-bold white--text pl-0">
          Статьи - {{ wikiGridTitle }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-btn
          v-if="hover"
          color="blue-grey lighten-1"
          small
          icon
        >
          <v-icon small>fa fa-plus-square-o</v-icon>
        </v-btn> -->
        <v-fab-transition>
          <v-btn
            color="wasdlight"
            dark
            small
            absolute
            top
            right
            fab
            @click="dialogNewWikiArticle = true"
          >
            <v-icon>fa fa-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-app-bar>
      <v-card-text class="pa-1">
        <v-data-iterator
          v-if="wikiArticles && users"
          :items="wikiArticles"
          :items-per-page.sync="wikiItemsPerPage"
          :page="wikiPage"
          :search="wikiSearch"
          item-key="name"
          hide-default-footer
          single-select
          :loading="wikiLoading"
        >
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.id"
                cols="6"
              >
                <v-card
                  @mouseover="item.hover = true"
                  @mouseleave="item.hover = false"
                >
                  <v-list
                    three-line
                    :color="item.hover ? 'grey lighten-4' : 'grey lighten-5'"
                  >
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-icon
                          class="grey lighten-1"
                          dark
                        >
                          fa fa-file-text
                        </v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title @click="selectThisArticle(item)">
                          <a :href="`/wiki/view/${item.id}`" style="text-decoration: none; color: #025EA1">{{ item.name }}</a>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ categoryName(item.category) }}</v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <v-row dense class="pa-2">
                            <span>{{ new Date(item.dateCreated).toLocaleDateString() }}</span>
                            <v-spacer />
                            <span>{{ creatorName(item.creator) }}</span>
                          </v-row>
                          </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn v-if="item.hover" icon small>
                          <v-icon color="grey lighten-1">fa fa-star-o</v-icon>
                        </v-btn>
                        <v-btn v-if="item.hover" icon small>
                          <a :href="`/wiki/edit/${item.id}`" style="text-decoration: none;">
                            <v-icon color="grey lighten-1">fa fa-pencil</v-icon>
                          </a>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </template>
          <template v-slot:footer>
            <v-row
              class="mt-2"
              align="center"
              justify="center"
              dense
            >
              <span class="grey--text ml-2 mr-2">Всего статей: <b>{{ wikiArticles.length }}</b></span>
              <span class="grey--text ml-2">Показывать по:</span>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    text
                    color="wasdmedium"
                    class="ml-0"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ wikiItemsPerPage }}
                    <v-icon class="ml-2">fa fa-angle-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(number, index) in itemsPerPageArray"
                    :key="index"
                    @click="updateItemsPerPage(number)"
                  >
                    <v-list-item-title>{{ number }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-spacer></v-spacer>

              <span
                class="mr-4 grey--text"
              >
                Страница {{ wikiPage }} из {{ numberOfPages }}
              </span>
              <v-btn
                icon
                dark
                color="wasdmedium"
                class="mr-1"
                small
                @click="formerPage"
              >
                <v-icon>fa fa-chevron-left</v-icon>
              </v-btn>
              <v-btn
                icon
                dark
                color="wasdmedium"
                class="ml-1"
                small
                @click="nextPage"
              >
                <v-icon>fa fa-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
// import utils from '../../config/utils'

export default {
  name: 'wikiArticlesGrid',
  data: () => ({
    hover: false,
    itemsPerPageArray: [4, 8, 12, 24, 50, 80, 100],
    filter: {}
  }),
  computed: {
    ...mapGetters([
      'users'
    ]),
    ...mapFields([
      'wikiSearch',
      'wikiItemsPerPage',
      'wikiPage',
      'dialogNewWikiArticle',
      'wikiFlatCategories',
      'wikiArticles',
      'wikiLoading',
      'wikiGridTitle'
    ]),
    numberOfPages () {
      return Math.ceil(this.wikiArticles.length / this.wikiItemsPerPage)
    }
  },
  methods: {
    selectThisArticle (item) {
      console.log(item)
    },
    creatorName (id) {
      const find = this.users.find(f => Number(f.id) === Number(id))
      if (find) {
        return find.shortName
      } else {
        return ''
      }
    },
    categoryName (id) {
      const find = this.wikiFlatCategories.find(f => f.id === Number(id))
      if (find) {
        return find.name
      } else {
        return ''
      }
    },
    nextPage () {
      if (this.wikiPage + 1 <= this.numberOfPages) this.wikiPage += 1
      const query = { ...this.$route.query, page: String(this.wikiPage), items: String(this.wikiItemsPerPage) }
      this.$router.replace({ query })
    },
    formerPage () {
      if (this.wikiPage - 1 >= 1) this.wikiPage -= 1
      const query = { ...this.$route.query, page: String(this.wikiPage), items: String(this.wikiItemsPerPage) }
      this.$router.replace({ query })
    },
    updateItemsPerPage (number) {
      this.wikiItemsPerPage = number
    }
  }
}
</script>
