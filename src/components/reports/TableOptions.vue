<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="550"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          class="mr-3"
          v-on="on"
        >
          <v-tooltip
            bottom
            open-on-hover
            open-delay="500"
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">
                fas fa-cogs
              </v-icon>
            </template>
            <span>Настройки колонок</span>
          </v-tooltip>
        </v-btn>
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Настройки колонок
        </v-card-title>

        <v-card-text>
          <v-simple-table
            dense
            fixed-header
            height="400"
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Поле
                  </th>
                  <th class="text-left">
                    Видимость
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in allHeaders"
                  :key="item.text"
                >
                  <td>
                    {{ item.text }}
                  </td>
                  <td>
                    <v-simple-checkbox
                      v-model="item.visible"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <!-- <v-btn
            color="error"
            text
            @click="dialog = false"
          >
            Отмена
          </v-btn> -->
          <v-btn
            color="primary"
            text
            @click="accept()"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
import { mapFields } from 'vuex-map-fields'

export default {
  data: () => ({
    dialog: false
  }),
  computed: {
    ...mapFields([
      'selectedHeaders',
      'allHeaders',
      'currentUser'
    ])
  },
  methods: {
    async accept () {
      let headers = []
      for (let i = 0; i < this.allHeaders.length; i++) {
        const element = this.allHeaders[i]
        if (element.visible) {
          headers.push(element)
        }
      }
      this.selectedHeaders = headers
      // try {
      //   const query = { user: Number(this.currentUser), headers: JSON.stringify(headers), srv: this.$config.SERVER }
      //   const inserted = await axios.post(`${this.$config.useProxy ? this.$config.proxyAddress : ''}${this.$config.API_ADDRESS}/api/v2/tasks/setheaders`, query)
      //   console.log(inserted.data)
      // } catch (error) {
      //   console.log(error)
      // }
      this.dialog = false
    }
  }
}
</script>
