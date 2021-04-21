<template>
  <v-data-table
    :headers="headers"
    :items="workload"
    :items-per-page="10"
    class="elevation-1"
    dense
  >
    <template v-slot:[`item.workload`]="{ item }">
      <span v-if="item.workload > item.capacity" style="color: #a01010">
        {{ Math.round(item.workload) }}
      </span>
      <span v-else>
        {{ Math.round(item.workload) }}
      </span>
    </template>
    <!-- <template v-slot:[`item.action`]="{ item }">
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
    </template> -->
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'resourcesTable',
  data: () => ({
    headers: [
      {
        text: 'Ресурс',
        align: 'start',
        width: 180,
        sortable: false,
        value: 'text'
      },
      {
        text: 'Проект',
        align: 'start',
        sortable: true,
        value: 'Name'
      },
      {
        text: 'Задач',
        align: 'start',
        sortable: false,
        width: 55,
        value: 'tasksCount'
      },
      {
        text: 'Загрузка',
        align: 'start',
        sortable: false,
        value: 'workload'
      },
      {
        text: 'Потенциал',
        align: 'start',
        sortable: false,
        value: 'capacity'
      }
      // {
      //   text: 'Средий % загрузки',
      //   align: 'start',
      //   sortable: false,
      //   width: 65,
      //   value: 'avgWorkforcePercent'
      // },
      // {
      //   text: '',
      //   align: 'end',
      //   sortable: false,
      //   width: 55,
      //   value: 'action'
      // }
    ]
  }),
  computed: {
    ...mapGetters([
      'workload'
    ])
  },
  methods: {
    // locateTask (task) {
    //   this.$store.dispatch('setIsMainTask', false)
    //   // eslint-disable-next-line
    //   gantt.selectTask(task.id)
    //   // eslint-disable-next-line
    //   gantt.showTask(task.id)
    // }
  }
}
</script>
