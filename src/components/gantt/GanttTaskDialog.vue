<!--  -->
<template>
  <v-dialog
    v-model="taskDialogVisible"
    max-width="1000"
    persistent
  >
    <v-card>
      <v-app-bar
        color="blue-grey lighten-5"
        flat
        dense
      >
        <v-toolbar-title>
          <img
            v-if="taskDialogVisible"
            style="width: 16px; height: 16px;"
           :src="typeIcon()"
          />
          {{ selectedDialogTask ? selectedDialogTask.text : '' }}
        </v-toolbar-title>
        <v-spacer />
        <v-tooltip
          bottom
          open-delay="600"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              icon
              :disabled="selectedTask.id === selectedDialogTask.id"
              v-bind="attrs"
              v-on="on"
              @click="locateTask(selectedDialogTask)"
            >
              <v-icon class="text--secondary">fa fa-map-marker</v-icon>
            </v-btn>
          </template>
          <span>Выделить на плане</span>
        </v-tooltip>
      </v-app-bar>
      <v-divider />
      <v-card-text>
        <v-tabs
          v-model="tabDialogTask"
          background-color="primary"
          active-class="blue-grey darken-1"
          dark
          height="30"
        >
          <!-- <v-tabs-slider color="red lighten-1"></v-tabs-slider> -->
          <v-tab>
            <span class="caption">{{ `Общая информация` }}</span>
          </v-tab>
          <v-tab :disabled="!predecessor">
            <span class="caption">{{ `Предшественники` }}</span>
          </v-tab>
          <v-tab :disabled="!successor">
            <span class="caption">{{ `Последователи` }}</span>
          </v-tab>
          <v-tab :disabled="!taskRequirements">
            <span class="caption">{{ `Обязательства` }}</span>
          </v-tab>
          <v-tab>
            <span class="caption">{{ `История действий` }}</span>
          </v-tab>
          <v-tab>
            <span class="caption">{{ `История замещений` }}</span>
          </v-tab>
        </v-tabs>
        <v-tabs-items
          v-model="tabDialogTask"
        >
          <v-tab-item>
            <!-- {{ selectedDialogTask ? selectedDialogTask.text : '' }}
            {{'22222222222222222'}}
            {{'33333333333333333'}}
            {{'44444444444444444'}} -->
            <generalInfo />
          </v-tab-item>
          <v-tab-item>
            <predecessorsTable />
          </v-tab-item>
          <v-tab-item>
            <successorsTable />
          </v-tab-item>
          <v-tab-item>
            <requirementsTable />
          </v-tab-item>
          <v-tab-item>
            <taskHistory />
          </v-tab-item>
          <v-tab-item>
            {{ `История замещений` }}
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          small
          @click="taskDialogVisible = false"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import successorsTable from './DialogTables/SuccessorsTable'
import predecessorsTable from './DialogTables/PredecessorsTable'
import taskHistory from './DialogTables/TasksHistory'
import requirementsTable from './DialogTables/RequirementsTable'
import generalInfo from './DialogTables/GeneralInfo'
import config from '../../config/config'

export default {
  name: 'ganttTaskDialog',
  components: {
    successorsTable,
    predecessorsTable,
    taskHistory,
    requirementsTable,
    generalInfo
  },
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters([
      'predecessor',
      'successor',
      'dialogCaption',
      'predecessorsTasks',
      'successorsTasks',
      'taskeditform',
      'selectedTask',
      'selectedDialogTask',
      'taskRequirements'
    ]),
    tabDialogTask: {
      get () {
        return this.$store.getters.tabDialogTask
      },
      set (value) {
        this.$store.dispatch('setTabDialogTask', value)
      }
    },
    taskDialogVisible: {
      get () {
        return this.$store.getters.taskDialogVisible
      },
      set (value) {
        this.$store.dispatch('setTaskDialogVisible', value)
      }
    }
  },
  methods: {
    locateTask (task) {
      // eslint-disable-next-line
      gantt.selectTask(task.id)
      // eslint-disable-next-line
      gantt.showTask(task.id)
    },
    typeIcon () {
      switch (this.selectedDialogTask.type) {
        case 'subplan':
          return config.WASD_API + 'Content/js/icons/subproject.png'
        case 'task':
          return config.WASD_API + 'Content/js/icons/project-task.png'
        case 'project':
          return config.WASD_API + 'Content/js/icons/project-task.png'
        case 'milestone':
          return config.WASD_API + 'Content/js/icons/milestone.png'
        case 'phase':
          return config.WASD_API + 'Content/js/icons/phase-task.png'
      }
    }
  }
}
</script>
