<template>
  <div>
    <v-row
      dense
      class="pa-2"
    >
      <v-card
        rounded
        width="100%"
        height="300"
      >
        <v-app-bar
          flat
          dense
          color="blue-grey lighten-5"
        >
          <!-- <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon> -->
          <v-toolbar-title class="body-1 font-weight-bold pl-0">
            Избранное
          </v-toolbar-title>
        </v-app-bar>
        <v-card-text class="pa-1">
          <div>Здесь будут статьи, добавленные в Избранное</div>
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
// import utils from '../../config/utils'

export default {
  name: 'wikiFavoriteArticles',
  data: () => ({
    // tree: [],
    hover: false
  }),
  computed: {
    // ...mapGetters([
    //   'dialogBeforeCreate'
    // ]),
    ...mapFields([
      'wikiFlatCategories'
    ])
  },
  methods: {
    //
  }
}
</script>
