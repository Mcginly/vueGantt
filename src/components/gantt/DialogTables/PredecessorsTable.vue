<template>
  <v-data-table
    :headers="headers"
    :items="predecessorsTasks"
    :items-per-page="10"
    class="elevation-1"
    dense
  >
    <template v-slot:[`item.action`]="{ item }">
      <v-tooltip
        bottom
        open-delay="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            icon
            v-bind="attrs"
            v-on="on"
            @click="locateTask(item)"
          >
            <v-icon small class="text--secondary">fa fa-map-marker</v-icon>
          </v-btn>
        </template>
        <span>Выделить на плане</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'predecessorsTable',
  data: () => ({
    headers: [
      {
        text: '#',
        align: 'start',
        sortable: true,
        width: 55,
        value: 'global_id'
      },
      {
        text: 'Предшественники',
        align: 'start',
        sortable: false,
        value: 'text'
      },
      {
        text: '',
        align: 'end',
        sortable: false,
        width: 55,
        value: 'action'
      }
    ]
  }),
  computed: {
    ...mapGetters([
      'predecessorsTasks'
    ])
  },
  methods: {
    locateTask (task) {
      this.$store.dispatch('setIsMainTask', false)
      // eslint-disable-next-line
      gantt.selectTask(task.id)
      // eslint-disable-next-line
      gantt.showTask(task.id)
    }
  }
}
</script>
