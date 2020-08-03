<template>
  <v-list dense>
    <v-list-item>
      <v-list-item-content>
        <v-select
          v-model="selectedPeriod"
          :items="itemsPeriod"
          label="Период"
          return-object
          item-text="label"
          item-value="id"
          dense
          chips
          outlined
        >
          <v-icon slot="prepend" :color="mapPeriod">far fa-calendar-check</v-icon>
        </v-select>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item>
      <v-list-item-action>
        <v-btn @click="updateData" color="success">Применить</v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '../config/utils'

export default {
  data: () => ({
    itemsPeriod: [
      { id: 0, label: 'Текущая неделя' },
      { id: 1, label: 'Прошлая неделя' },
      { id: 2, label: 'Текущий месяц' },
      { id: 3, label: 'Прошлый месяц' },
      { id: 4, label: 'Текущий год' },
      { id: 5, label: 'Прошлый год' }
    ]
  }),
  computed: {
    selectedPeriod: {
      get () {
        return this.$store.getters.selectedPeriod
      },
      set (value) {
        this.$store.dispatch('setSelectedPeriod', value)
      }
    },
    mapPeriod () {
      switch (this.selectedPeriod.id) {
        case 0:
          return 'green'
        case 1:
          return 'blue'
        case 2:
          return 'green'
        case 3:
          return 'blue'
        case 4:
          return 'green'
        case 5:
          return 'blue'
        default:
          return 'green'
      }
    },
    ...mapGetters([
      'loading',
      'isUserLoggedIn',
      'error',
      'periodLabel',
      'pageHeader',
      'success',
      'user'
    ])
  },
  methods: {
    updateData () {
      this.$store.dispatch('setPeriodLabel', utils.labelDataFormat(utils.getPeriodFormat(this.$store.getters.selectedPeriod.id)))
      this.$store.dispatch('setPageHeader', 'Портфель проектов (' + this.periodLabel.begin + ' - ' + this.periodLabel.end + ')')
      this.$store.dispatch('setPortfolio', utils.getPeriodFormat(this.$store.getters.selectedPeriod.id))
    }
  }
}
</script>
