<template>
  <div id="v-ganttapp" class="ganttview">
    <v-overlay
      :value="loading"
    >
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
    <ganttContextMenu />
    <ganttView />
    <ganttTaskDialog />
    <beforeCreatePlan />
    <messages />
    <v-fab-transition>
      <v-btn
        v-show="readyForImport && user === 'AVAleksandrov'"
        color="success"
        dark
        absolute
        bottom
        right
        fab
        @click="beginImport()"
      >
        <v-icon>fa fa-floppy-o</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog
      v-model="beforeImportDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          Пересчитать план во время импорта?
        </v-card-title>
        <v-card-text>
          Рекомендуется пересчитать. Если предыдущий импорт загрузился некорректно, откажитесь от полного пересчета плана.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="wasdmedium"
            dark
            @click="enableAutoShedulling = true; startImport = true;"
          >
            Пересчитать
          </v-btn>
          <v-btn
            color="wasdlight"
            dark
            @click="enableAutoShedulling = false; startImport = true;"
          >
            Не нужно
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog
      v-model="dialogGap"
      max-width="900"
    >
      <v-card>
        <v-card-title class="headline">
          Ошибки в импортируемом файле
        </v-card-title>
        <v-card-text>
          Всего задач с разрывом: {{ gapTasks.length }}
          <v-data-table
            :headers="headers"
            :items="gapTasks"
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn
            color="wasdlight"
            dark
            @click="enableAutoShedulling = true; startImport = true;"
          >
            Пересчитать
          </v-btn> -->
          <v-btn
            color="wasdmedium"
            dark
            @click="dialogGap = false"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { gantt } from 'dhtmlx-gantt'
import ganttView from './GanttView'
// import createPlanItems from '../../plugins/createPlanItems'
import ganttContextMenu from './GanttContextMenu'
import ganttTaskDialog from './GanttTaskDialog'
import messages from './Dialogs/Messages'
import beforeCreatePlan from './Dialogs/BeforeCreatePlan'
import createPlanItems from '../../plugins/createPlanItems'

export default {
  name: 'GanttApp',
  components: {
    ganttView,
    ganttContextMenu,
    ganttTaskDialog,
    messages,
    beforeCreatePlan
  },
  props: {
    planId: {
      type: String,
      default: ''
    },
    taskId: {
      type: String,
      default: 'all'
    }
  },
  data: () => ({
    process: null,
    processStatus: '0',
    timer: null,
    headers: [
      {
        text: '#',
        align: 'start',
        sortable: true,
        width: 55,
        value: 'global_id'
      },
      {
        text: 'Наименование',
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
      'projects',
      'project',
      'user',
      'isGap'
    ]),
    ...mapFields([
      'loading',
      'readyForImport',
      'taskCount',
      'importCount',
      'dialogBeforeCreate',
      'beforeImportDialog',
      'enableAutoShedulling',
      'startImport',
      'dialogGap',
      'gapTasks'
    ])
  },
  watch: {
    importCount (val) {
      if (val < this.taskCount) {
        // eslint-disable-next-line
        return
      } else {
        this.importCount = 0
        this.loading = false
        this.readyForImport = false
        // clearInterval(this.interval)
      }
    },
    processStatus (val) {
      switch (val) {
        case '2': // Completed Завершен 2
          clearInterval(this.timer)
          this.$store.dispatch('setLoading', false)
          this.$store.dispatch('setSuccess', 'План проекта успешно сохранен.')
          break
        case '1': // Running Запущен 1
          this.timer = setInterval(() => {
            this.getProcessStatus()
          }, 5000)
          break
        case '0': // None Не задан 0
          clearInterval(this.timer)
          this.$store.dispatch('setLoading', false)
          this.$store.dispatch('setError', 'Ошибка связи с сервером. Обратитесь к администратору.')
          break
        case '3': // Aborted Прерван из-за ошибки 3
          clearInterval(this.timer)
          this.$store.dispatch('setLoading', false)
          this.$store.dispatch('setError', 'Прервано из-за ошибки в процессе записи плана.')
          break
        case '4': // Terminated Прерван пользователем 4
          clearInterval(this.timer)
          this.$store.dispatch('setLoading', false)
          this.$store.dispatch('setError', 'Процесс записи плана прерван пользователем.')
          break
        default:
          clearInterval(this.timer)
          this.$store.dispatch('setLoading', false)
          this.$store.dispatch('setError', 'Неизвестная ошибка. Обратитесь к администратору.')
          break
      }
      // if (val === '2') {

      //   console.log('done!')
      // } else if (val === '1') {

      // } else {
      //   this.timer = setInterval(() => {
      //     this.getProcessStatus()
      //   }, 5000)
      // }
    }
  },
  mounted () {
    this.$emit('plan_id', this.$route.params.plan_id)
    this.$store.dispatch('setPlanId', this.$route.params.plan_id)
    this.$store.dispatch('setTaskId', this.$route.params.task_id)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    locateTask (task) {
      this.$store.dispatch('setIsMainTask', false)
      // eslint-disable-next-line
      gantt.selectTask(task.id)
      // eslint-disable-next-line
      gantt.showTask(task.id)
    },
    async getProcessStatus () {
      let convert = require('xml-js')
      // console.log(this.process)
      await createPlanItems.checkProcess(this.process)
        .then(respStatus => {
          let statusJson = convert.xml2js(respStatus, { ignoreComment: true, ignoreDeclaration: true })
          this.processStatus = statusJson.elements[0].elements[0].elements[0].elements[0].elements[0].text
          // console.log(statusJson.elements[0].elements[0].elements[0].elements[0].elements[0].text)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // startBuffer () {
    //   clearInterval(this.interval)
    //   this.interval = setInterval(() => {
    //     this.importCount += Math.round(Math.random() * (15 - 5) + 5)
    //   }, 1000)
    // },
    async beginImport () {
      this.$store.dispatch('setLoading', true)
      this.$store.dispatch('setSuccess', 'Запись плана проекта началась. Если ожидание затянулось, можете закрыть страницу. По окончании записи на Ваш почтовый ящик поступит уведомление.')
      // console.log(this.project.Id)
      let convert = require('xml-js')
      await createPlanItems.getJsonUrl({
        tasks: gantt.getTaskByTime(),
        links: gantt.getLinks(),
        resources: gantt.serverList('res'),
        project: this.project.Id, // this.project.Id '708'
        plan: this.planId,
        user: this.user })
        .then(async resp => {
          console.log(this.project, resp, resp.data.file, gantt.getLinks())
          //
          await createPlanItems.runProcess({ file: resp.data.file, login: this.project.Manager })
            .then(async r => {
              let result = convert.xml2js(r, { ignoreComment: true, ignoreDeclaration: true })
              this.process = result.elements[0].elements[0].elements[0].elements[0].elements[0].text
              this.getProcessStatus()
            })
            .catch(e => {
              console.log(e)
            })
            //
        })
        .catch(err => {
          console.log(err)
        })
      //
      //
      // this.dialogBeforeCreate = true
      // this.loading = !this.loading
      // // eslint-disable-next-line
      // var tasks = gantt.getTaskByTime()
      // createPlanItems.beginImport(tasks)
    }
  }
}
</script>
