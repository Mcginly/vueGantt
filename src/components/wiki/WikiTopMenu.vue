<template>
  <v-list-item two-line dense class="mt-5">
    <v-tooltip bottom :open-delay="500">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            dark
            small
            icon
            bottom
            left
            fab
            v-bind="attrs"
            v-on="on"
            @click="wikiPanelVisible = !wikiPanelVisible"
          >
            <v-icon color="wasdmedium">{{ wikiPanelVisible ? 'fa fa-chevron-up' : 'fa fa-chevron-down' }}</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>{{ wikiPanelVisible ? 'Свернуть панель' : 'Развернуть панель' }}</span>
    </v-tooltip>
    <v-list-item-content>
      <v-list-item-subtitle>
        <!-- <v-divider /> -->
      </v-list-item-subtitle>
      <v-list-item-title>
        <v-row dense class="ml-2 mr-1">
          <v-text-field
            v-model="wikiSearch"
            outlined
            dense
            clearable
            placeholder="поиск"
            prepend-inner-icon="fa fa-search"
            @input="hidePanelOnSearch()"
          />
        </v-row>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
// import utils from '../../config/utils'

export default {
  name: 'wikiTopMenu',
  data: () => ({
    // file: null
  }),
  computed: {
    ...mapGetters([
      'showToolbar',
      'users'
    ]),
    ...mapFields([
      'wikiSearch',
      'wikiPanelVisible'
    ])
    // executUser: {
    //   get () {
    //     return this.$store.getters.executUser
    //   },
    //   set (value) {
    //     this.$store.dispatch('setExecutUser', value)
    //   }
    // }
  },
  methods: {
    hidePanelOnSearch () {
      if (this.wikiSearch !== '') {
        this.wikiPanelVisible = false
      }
    }
  }
}
</script>
