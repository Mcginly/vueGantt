<template>
  <div>
    <v-row
      dense
      class="pa-2"
    >
      <v-card
        rounded
        width="100%"
        height="340px"
      >
        <v-app-bar
          flat
          dense
          color="blue-grey lighten-5"
        >
          <!-- <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon> -->
          <v-toolbar-title class="body-1 pl-0 font-weight-bold">
            <!-- <span class="white--text text--lighten-1">Последние статьи</span> -->
            Последние статьи
          </v-toolbar-title>
        </v-app-bar>
        <v-card-text class="pa-0">
          <!-- <div>Здесь будут последние 5 добавленных статей</div> -->
          <v-list v-for="item in lastArticles" :key="item.id" dense>
              <v-list-item dense>
                <v-list-item-content class="pa-2">
                    <v-row dense style="vertical-align: middle !important;">
                      <a :href="`/wiki/view/${item.id}`" style="text-decoration: none; color: #025EA1">{{ item.name }}</a>&nbsp;&nbsp; <span>({{ categoryName(item.category) }})</span>
                      <!-- <span class="caption">({{ categoryName(item.category) }})</span> -->
                      <v-spacer />
                      <span class="caption">{{ creatorName(item.creator) }} {{ new Date(item.dateCreated).toLocaleDateString() }}</span>
                    </v-row>
                  <!-- <v-list-item-subtitle>
                    <v-row dense class="pa-2">
                      <span>{{ new Date(item.dateCreated).toLocaleDateString() }}</span>
                      <v-spacer />
                      <span>{{ creatorName(item.creator) }}</span>
                    </v-row>
                  </v-list-item-subtitle> -->
                </v-list-item-content>
              </v-list-item>
            </v-list>
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
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import utils from '../../config/utils'

export default {
  name: 'wikiLastArticles',
  data: () => ({
    lastArticles: [],
    hover: false
  }),
  computed: {
    ...mapGetters([
      'users'
    ]),
    ...mapFields([
      'wikiFlatCategories'
    ])
  },
  mounted () {
    const text = `SELECT id::INTEGER, category::INTEGER, name, description, icon, color, creator::INTEGER, updater::INTEGER, "dateCreated"::VARCHAR, "dateUpdated"::VARCHAR, false as hover FROM public.articles order by "dateCreated" desc limit 5;`
    const values = []
    utils.getWikiArticles({ text, values })
      .then(r => {
        // this.wikiCategories = r.data
        this.lastArticles = r.data
        console.log(this.lastArticles)
      })
      .catch(e => {
        console.log(e)
        this.lastArticles = []
      })
  },
  methods: {
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
    }
  }
}
</script>
