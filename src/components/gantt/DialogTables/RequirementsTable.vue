<template>
  <v-data-table
    :headers="headers"
    :items="taskRequirements"
    item-key="Id"
    :single-expand="true"
    :expanded.sync="expanded"
    expand-icon="fa fa-angle-down"
    :items-per-page="10"
    show-expand
    class="elevation-1"
    :item-class="itemClass"
    dense
  >
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <requirementInfo :item="item" />
      </td>
    </template>
    <template v-slot:item.action="{ item }">
      <v-tooltip
        bottom
        open-delay="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <a
            :href="`http://wasd/Common/Catalogs/ViewItem/${item.Id}?uid=6513f28b-13a3-4e74-aa8f-010353c88ef2`"
            target="_blank"
            v-bind="attrs"
            v-on="on"
          >
            <img src="http://wasd/Content/Images/x16/process.png" width="16" height="16" class="mt-1" />
          </a>
        </template>
        <span>Открыть в WASD</span>
      </v-tooltip>
    </template>
    <!-- <template v-slot:item.StartPoint="{ item }">
      {{ new Date(item.StartPoint).toLocaleDateString() }}
    </template> -->
    <template v-slot:item.Deadline="{ item }">
      {{ new Date(item.Deadline).toLocaleDateString() }}
    </template>
    <template v-slot:item.Delay="{ item }">
      {{ item.Delay }}
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
import requirementInfo from './Partial/RequirementInfo'

export default {
  name: 'ganttRequirementsTask',
  components: {
    requirementInfo
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: '', value: 'data-table-expand' },
      {
        text: '#',
        align: 'start',
        sortable: true,
        width: 55,
        value: 'Number'
      },
      {
        text: 'Наименование',
        align: 'start',
        sortable: false,
        value: 'Name'
      },
      // {
      //   text: 'Старт',
      //   align: 'start',
      //   sortable: false,
      //   value: 'StartPoint'
      // },
      {
        text: 'Срок',
        align: 'start',
        sortable: false,
        value: 'Deadline'
      },
      {
        text: 'Просрочка',
        align: 'start',
        sortable: false,
        value: 'Delay'
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
      'taskRequirements',
      'users',
      'selectedTask'
    ])
  },
  methods: {
    itemClass (item) {
      switch (item.Status) {
        case 0:
          return ''
        case 1:
          return ''
        case 2:
          return ''
        case 3:
          return 'light-green lighten-5'
        case 4:
          return ''
        case 5:
          return 'red lighten-5'
        case 6:
          return 'pink lighten-4'
        case 7:
          return ''
        case 8:
          return ''
        case 9:
          return ''
        default:
          return ''
      }
    }
  }
}
</script>
