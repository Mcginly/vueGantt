<template>
  <v-list dense>
    <v-list-item>
      <v-list-item-content>
        <span>Дополнительно</span>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list-item @click="toggleResourceView()">
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          :dark="viewResource ? true : false"
          class="mx-0"
          :style="{ backgroundColor: (viewResource) ? '#90CAF9 !important' : '' }"
        >
          <v-icon small>fa fa-male</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Загрузка ресурсов</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="isEditMode()" @click="togglePredictedView()">
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          :dark="viewPredicted ? true : false"
          class="mx-0"
          :style="{ backgroundColor: (viewPredicted) ? '#90CAF9 !important' : '' }"
        >
          <v-icon small>fa fa-tasks</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Прогноз выполнения</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list-item dense>
      <v-list-item-content>
        <span class="caption">Экспорт</span>
      </v-list-item-content>
    </v-list-item>

    <!-- <v-list-item @click="exportProject()" dense>
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
        >
          <v-icon small>fa fa-file-powerpoint-o</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Экспорт в MS Project</v-list-item-title>
      </v-list-item-content>
    </v-list-item> -->
    <v-list-item @click="testExportToXML()" dense>
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
        >
          <v-icon small>fa fa-file-powerpoint-o</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Экспорт в MS Project</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item @click="exportExcel()" dense>
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
        >
          <v-icon small>fa fa-file-excel-o</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Экспорт в Excel</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item @click="exportPDF()" dense>
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
        >
          <v-icon small>fa fa-file-pdf-o</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Экспорт в PDF</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item @click="exportPng()" dense>
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
        >
          <v-icon small>fa fa-file-image-o</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Экспорт изображения</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider v-if="isImportMode()" />
    <v-list-item v-if="isImportMode()" dense>
      <v-list-item-content>
        <span class="caption">Импорт</span>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="isImportMode()" dense>
      <v-list-item-content>
        <v-file-input
          v-model="file"
          @change="file ? beforeImportDialog = true : beforeImportDialog = false"
          flat
          label="Файл MS Project"
          accept="application/vnd.ms-project,text/xml,application/xer,.xer"
          show-size
          single-line
          hide-details
          dense
          prepend-icon="fa fa-download"
          class="caption"
        />
      </v-list-item-content>
    </v-list-item>
    <!-- importPrimavera -->
    <v-list-item v-if="isImportMode()" dense>
      <v-list-item-content>
        <v-file-input
          v-model="filePrima"
          @change="filePrima ? beforeImportDialog = true : beforeImportDialog = false"
          flat
          label="Файл Primavera"
          accept="text/xml,application/xer,.xer"
          show-size
          single-line
          hide-details
          dense
          prepend-icon="fa fa-download"
          class="caption"
        />
      </v-list-item-content>
    </v-list-item>
    <!--  -->
    <v-list-item v-if="isImportMode()" dense>
      <v-list-item-content>
        <v-file-input
          v-model="fileXML"
          @change="fileXML ? testImportXML() : fileXML = null"
          flat
          label="Файл XML"
          accept="text/xml,.xml"
          show-size
          single-line
          hide-details
          dense
          prepend-icon="fa fa-download"
          class="caption"
        />
      </v-list-item-content>
    </v-list-item>
    <!--  -->
    <!-- <v-list-item @click="testExportToXML()" dense>
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
        >
          <v-icon small>fa fa-file-image-o</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Тестировать</v-list-item-title>
      </v-list-item-content>
    </v-list-item> -->
    <!-- <v-list-item @click="testGetTime()" dense>
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
        >
          <v-icon small>fa fa-file-image-o</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Тестировать время</v-list-item-title>
      </v-list-item-content>
    </v-list-item> -->
    <!-- <v-list-item @click="getProcessStatus()" dense>
      <v-list-item-action>
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
        >
          <v-icon small>fa fa-file-image-o</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Проверить статус процесса</v-list-item-title>
      </v-list-item-content>
    </v-list-item> -->
    <!--  -->
    <!-- <v-list-item v-if="isImportMode()" dense>
      <v-list-item-content>
        <v-file-input
          v-model="file"
          @change="testCustomXML()"
          flat
          label="Файл XML"
          accept="text/xml"
          show-size
          single-line
          hide-details
          dense
          prepend-icon="fa fa-download"
          class="caption"
        />
      </v-list-item-content>
    </v-list-item> -->

    <!-- <v-file-input
      v-model="file"
      @change="importMsProject()"
      flat
      label="Файл MS Project"
      accept="application/vnd.ms-project"
      show-size
      single-line
      hide-details
      dense
      prepend-icon="fa fa-download"
    /> -->

  </v-list>
  <!-- <v-list dense>
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
  </v-list> -->
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import utils from '../config/utils'
import { gantt } from 'dhtmlx-gantt'
import parseXml from '../plugins/parseXml'
import axios from 'axios'
import moment from 'moment'
//
// import { v1 as uuid } from 'uuid'
import config from '../config/config'
import createPlanItems from '../plugins/createPlanItems'
import prepareExportItems from '../plugins/prepareExportItems'
// import ganttinitial from './gantt/ganttinitial'
// import multipleFilterService from './gantt/MultipleFilterService'
// // eslint-disable-next-line
// var gantt2 = Gantt.getGanttInstance()

export default {
  data: () => ({
    taskPredictLayer: null,
    file: null,
    filePrima: null,
    fileXML: null,
    process: null,
    processStatus: '0',
    timer: null
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
      'user',
      'ganttLayoutTasks',
      'ganttLayoutResource',
      'ganttLayoutOnlyGrid',
      'project',
      'onlyGrid',
      'planId',
      'allExecutors'
    ]),
    ...mapFields([
      'viewPredicted',
      'calculatePredictedDialog',
      'readyForImport',
      'viewResource',
      'beforeImportDialog',
      'enableAutoShedulling',
      'startImport'
    ])
  },
  watch: {
    startImport (val) {
      if (val) {
        if (this.enableAutoShedulling) {
          gantt.config.duration_step = 1
          gantt.config.work_time = true
          gantt.config.correct_work_time = true
          //
          gantt.config.auto_scheduling = true
          gantt.config.auto_scheduling_initial = true
          gantt.config.auto_scheduling_strict = true
          gantt.config.auto_scheduling_compatibility = true
        } else {
          //
          gantt.config.duration_step = 1
          gantt.config.work_time = true
          gantt.config.correct_work_time = true
          //
          gantt.config.auto_scheduling = false
          gantt.config.auto_scheduling_initial = false
          gantt.config.auto_scheduling_strict = false
          gantt.config.auto_scheduling_compatibility = false
        }
        this.beforeImportDialog = false
        // this.importMsProject()
        this.importFromAny()
      }
    },
    processStatus (val) {
      if (val === '2') {
        clearInterval(this.timer)
        this.$store.dispatch('setLoading', false)
        this.$store.dispatch('setSuccess', 'План проекта успешно сохранен.')
        console.log('done!')
      } else {
        this.timer = setInterval(() => {
          this.getProcessStatus()
        }, 5000)
      }
    }
  },
  methods: {
    testGetTime () {
      let val = (Number(8 * (112 / 8)) * 60 * 60 * 1000) / 100 * Number(30)
      let hours = Math.floor(val / 1000 / 60 / 60)
      let d = moment.duration(val, 'milliseconds')
      let minutes = d.minutes()
      let seconds = d.seconds()
      console.log(val, hours, minutes, seconds)
    },
    downloadAsFile (data) {
      let a = document.createElement('a')
      let file = new Blob([data], { type: 'text/xml' })
      a.href = URL.createObjectURL(file)
      a.download = this.project.Name + '.xml'
      a.click()
      a.remove()
      // this.$store.dispatch('setLoading', false)
    },
    createExportData () {
      this.$store.dispatch('setLoading', true)
      // this.$store.dispatch('setReadyForImport', true)
      return new Promise(async (resolve, reject) => {
        try {
          setTimeout(() => {
            return resolve(this.$store.getters.loading)
          }, 1000)
        } catch (e) {
          this.$store.dispatch('setLoading', false)
          // this.$store.dispatch('setReadyForImport', false)
          return reject(e)
        }
      })
    },
    async testExportToXML () {
      let that = this
      function downloadAsFile (data) {
        let a = document.createElement('a')
        let file = new Blob([data], { type: 'text/xml' })
        a.href = URL.createObjectURL(file)
        a.download = that.project.Name + '.xml'
        a.click()
        that.$store.dispatch('setLoading', false)
      }
      this.createExportData()
        .then(load => {
          // console.log(load)
          if (load) {
            // Название Отображаемое имя Значение
            // StartNoEarlierThan Начало не ранее 0 4 Начало не ранее
            // StartNoLaterThan Начало не позднее 1 5 Начало не позднее
            // FinishNoEarlierThan Окончание не ранее 2 6 Окончание не ранее
            // FinishNoLaterThan Окончание не позднее 3 7 Окончание не позднее
            // MustStartOn Фиксированное начало 4 2 Должна начинаться на
            // MustFinishOn Фиксированное окончание 5 4 Должно завершиться на
            // function getConstraint (val) {
            //   switch (val) {
            //     case 0:
            //       return 4
            //     case 1:
            //       return 5
            //     case 2:
            //       return 6
            //     case 3:
            //       return 7
            //     case 4:
            //       return 2
            //     case 5:
            //       return 4
            //     default:
            //       return 0
            //   }
            // }
            //
            // function getProjectDuration (val) {
            //   let d = moment.duration(Number(val * 60 * 60 * 1000), 'milliseconds')
            //   let hours = Math.floor(Number(val))
            //   let minutes = d.minutes()
            //   let seconds = d.seconds()
            //   return `PT${hours}H${minutes}M${seconds}S`
            // }
            //
            var formatFunc = gantt.date.date_to_str('%Y-%m-%dT%H:%i:%s')
            // Prepare Tasks
            //
            // get Calendar worktime
            const calendar = gantt.getCalendar('global')
            //
            prepareExportItems.writeCalendarAndResources(gantt, calendar, this.allExecutors)
              .then(resp => {
                // console.log(resp)
                let tasks = []
                let resourceAssignments = []
                let globalCalendar = resp.globalCalendar
                let resources = resp.resources
                //
                const ganttTasks = gantt.getTaskByTime()
                let resCount = 1
                for (let i = 0; i < ganttTasks.length; i++) {
                  const task = ganttTasks[i]
                  let wbs = gantt.getWBSCode(gantt.getTask(task.id))
                  let start = formatFunc(task.start_date)
                  let end = formatFunc(task.end_date)
                  let isCritical = gantt.isCriticalTask(gantt.getTask(task.id))
                  //
                  let Task = { Task: prepareExportItems.writeTask(i, task, wbs, start, end, isCritical) }
                  //
                  if (task.executor_id && task.executor_id.length > 0) {
                    for (let e = 0; e < task.executor_id.length; e++) {
                      const executor = task.executor_id[e] // { resource_id, value }
                      const user = this.allExecutors.find(f => Number(f.id) === Number(executor.resource_id))
                      if (user) {
                        let res = resources.find(f => f.Resource.Name === user.fullName)
                        if (res) {
                          let assignment = prepareExportItems.writeAssignment(resCount, res.Resource.UID, Task.Task.UID, task, start, end, executor.value, gantt)
                          resCount++
                          // console.log(resources[resources.indexOf(res)])
                          // resources[resources.indexOf(res)].Resource.ID = res.Resource.UID
                          resourceAssignments.push(assignment)
                        }
                      }
                    }
                  }
                  // for (let r = 0; r < resources.length; r++) {
                  //   const element = resources[r].Resource
                  //   const assignments = gantt.getResourceAssignments(Number(executor.id))
                  // }
                  //
                  if (task.ConstraintDate) {
                    Task.Task.ConstraintDate = new Date(task.ConstraintDate).toISOString().substr(0, 19)
                  }
                  if (task.closed === 1) {
                    Task.Task.ActualFinish = task.type === 'milestone' ? formatFunc(task.start_date) : formatFunc(task.end_date)
                    Task.Task.Stop = task.type === 'milestone' ? formatFunc(task.start_date) : formatFunc(task.end_date)
                    Task.Task.Resume = task.type === 'milestone' ? formatFunc(task.start_date) : formatFunc(task.end_date)
                  }
                  // Link Type
                  // 0 FF (finish-to-finish)
                  // 1 FS (finish-to-start)
                  // 2 SF (start-to-finish)
                  // 3 SS (start-to-start)
                  let content = [
                    {
                      _name: 'ExtendedAttribute',
                      _content: { 'FieldID': 188743731, 'Value': task.Uid }
                    },
                    {
                      _name: 'ExtendedAttribute',
                      _content: { 'FieldID': 188743734, 'Value': task.TaskUid }
                    },
                    {
                      _name: 'ExtendedAttribute',
                      _content: { 'FieldID': 188743743, 'Value': task.task_id }
                    }
                    // <ExtendedAttribute>
                    //   <FieldID>188743737</FieldID>
                    //   <Value>Executor=Кузнецов Дмитрий Васильевич;Type=ProjectTask;IsProjectPhase=True;ProjectPhaseUid=163e42d7-4add-48f1-ba0e-51e0b4d98d91</Value>
                    // </ExtendedAttribute>
                  ]
                  //
                  Task.Task._content = content
                  tasks.push(Task)
                  //
                  // console.log('Task', i + 1)
                  // this.$store.dispatch('setImportCount', i + 1)
                  // this.$store.dispatch('setLoading', false)
                  // this.$store.dispatch('setReadyForImport', true)
                  // this.$store.dispatch('setSuccess', 'План проекта успешно сохранен.')
                }
                //
                prepareExportItems.setPredecessors(tasks, gantt, ganttTasks)
                  .then(resp => {
                    tasks = resp
                    //
                    let json = {
                      '_name': 'Project',
                      '_attrs': {
                        'xmlns': 'http://schemas.microsoft.com/project'
                      },
                      '_content': {
                        'SaveVersion': 14,
                        'UID': 1,
                        // 'BuildNumber': '15.0.5259.1000',
                        'Name': this.project.Name,
                        // 'GUID': String(uuid()).toUpperCase(),
                        // 'Title': this.project.Name,
                        // 'Company': 'wasd',
                        'CreationDate': new Date().toISOString().substr(0, 19),
                        'LastSaved': new Date().toISOString().substr(0, 19),
                        'ScheduleFromStart': 1,
                        'StartDate': this.project.StartDate.substr(0, 10) + 'T09:00:00',
                        'FinishDate': this.project.FinishDate.substr(0, 10) + 'T18:00:00',
                        'FYStartDate': 1,
                        'CriticalSlackLimit': 0,
                        'CurrencyDigits': 2,
                        'CurrencySymbol': '₽',
                        'CurrencyCode': 'RUB',
                        'CurrencySymbolPosition': 0,
                        'CalendarUID': 3,
                        'DefaultStartTime': '09:00:00',
                        'DefaultFinishTime': '18:00:00',
                        'MinutesPerDay': 480,
                        'MinutesPerWeek': 2400,
                        'DaysPerMonth': 20,
                        'DefaultTaskType': 0,
                        'DefaultFixedCostAccrual': 3,
                        'DefaultStandardRate': 0,
                        'DefaultOvertimeRate': 0,
                        'DurationFormat': 7,
                        'WorkFormat': 2,
                        'EditableActualCosts': 0,
                        'HonorConstraints': 0,
                        'InsertedProjectsLikeSummary': 0,
                        'MultipleCriticalPaths': 0,
                        'NewTasksEffortDriven': 0,
                        'NewTasksEstimated': 0,
                        'SplitsInProgressTasks': 1,
                        'SpreadActualCost': 0,
                        'SpreadPercentComplete': 0,
                        'TaskUpdatesResource': 0,
                        'FiscalYearStart': 0,
                        'WeekStartDay': 1,
                        'MoveCompletedEndsBack': 0,
                        'MoveRemainingStartsBack': 0,
                        'MoveRemainingStartsForward': 0,
                        'MoveCompletedEndsForward': 0,
                        'BaselineForEarnedValue': 0,
                        'AutoAddNewResourcesAndTasks': 0,
                        // 'CurrentDate': new Date().toISOString().substr(0, 11) + '09:00:00',
                        'MicrosoftProjectServerURL': 0,
                        'Autolink': 0,
                        'NewTaskStartDate': 0,
                        'NewTasksAreManual': 0,
                        'DefaultTaskEVMethod': 0,
                        'ProjectExternallyEdited': 0,
                        'ExtendedCreationDate': '1984-01-01T00:00:00',
                        'ActualsInSync': 0,
                        'RemoveFileProperties': 0,
                        'AdminProject': 0,
                        'UpdateManuallyScheduledTasksWhenEditingLinks': 1,
                        // 'KeepTaskOnNearestWorkingTimeWhenMadeAutoScheduled': 1,
                        // 'Views': views,
                        // 'Filters': filters,
                        // 'Groups': groups,
                        // 'Tables': tables,
                        // 'Maps': '',
                        // 'Reports': '',
                        // 'Drawings': '',
                        // 'DataLinks': '',
                        // 'VBAProjects': '',
                        'OutlineCodes': '',
                        'WBSMasks': '',
                        'ExtendedAttributes': [
                          {
                            'ExtendedAttribute': {
                              'FieldID': 188743731,
                              'FieldName': 'Text1',
                              'Guid': '000039B7-8BBE-4CEB-82C4-FA8C0B400033',
                              'Alias': 'wasd: Идентификатор задачи плана',
                              'SecondaryPID': 255869028
                            }
                          },
                          {
                            'ExtendedAttribute': {
                              'FieldID': 188743734,
                              'FieldName': 'Text2',
                              'Guid': '000039B7-8BBE-4CEB-82C4-FA8C0B400036',
                              'Alias': 'wasd: Идентификатор задачи по проекту',
                              'SecondaryPID': 255869029
                            }
                          },
                          {
                            'ExtendedAttribute': {
                              'FieldID': 188743737,
                              'FieldName': 'Text3',
                              // 'Guid': '000039B7-8BBE-4CEB-82C4-FA8C0B400039',
                              'Alias': 'wasd: Параметры задачи',
                              'SecondaryPID': 255869030
                            }
                          },
                          {
                            'ExtendedAttribute': {
                              'FieldID': 188743740,
                              'FieldName': 'Text4',
                              // 'Guid': '000039B7-8BBE-4CEB-82C4-FA8C0B40003C',
                              'Alias': 'wasd: Режим планирования связи',
                              'SecondaryPID': 255869031
                            }
                          },
                          {
                            'ExtendedAttribute': {
                              'FieldID': 188743743,
                              'FieldName': 'Текст5',
                              // 'Guid': '000039B7-8BBE-4CEB-82C4-FA8C0B40003F',
                              'Alias': 'wasd: ID задачи по проекту',
                              'SecondaryPID': 255869032
                            }
                          },
                          {
                            'ExtendedAttribute': {
                              'FieldID': 205520904,
                              'FieldName': 'Text1',
                              // 'Guid': '000039B7-8BBE-4CEB-82C4-FA8C0C400008',
                              'Alias': 'wasd: Параметры ресурса',
                              'SecondaryPID': 255852632
                            }
                          }
                        ],
                        'Calendars': globalCalendar,
                        'Tasks': tasks,
                        'Resources': resources,
                        'Assignments': resourceAssignments
                      }
                    }
                    //
                    const { toXML } = require('jstoxml')
                    const xmlOptions = {
                      header: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
                      indent: '\t'
                    }
                    var result = toXML(json, xmlOptions)
                    downloadAsFile(result)
                    // axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/jsontoprojectxml`, json, { headers: { 'Content-Type': 'application/json' } }) // ${config.proxyAddress} API_LOCAL_ADDRESS API_ADDRESS
                    //   .then(res => {
                    //     // console.log(this.project)
                    //     // console.log(uuid())
                    //     downloadAsFile(res.data)
                    //   })
                    //   .catch(err => {
                    //     console.log(err)
                    //   })
                  })
                  .catch(err => {
                    this.$store.dispatch('setLoading', false)
                    // this.$store.dispatch('setReadyForImport', false)
                    console.log(err)
                  })
              })
              .catch(err => {
                this.$store.dispatch('setLoading', false)
                // this.$store.dispatch('setReadyForImport', false)
                console.log(err)
              })
          } else {
            this.$store.dispatch('setLoading', false)
            // this.$store.dispatch('setReadyForImport', false)
          }
        })
        .catch(err => {
          this.$store.dispatch('setLoading', false)
          // this.$store.dispatch('setReadyForImport', false)
          console.log(err)
        })
    },
    testImportXML () {
      // console.log(this.fileXML)
      axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/parsexml`, this.fileXML, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => {
          console.log(res.data)
          parseXml.importProject(res.data)
            .then(pr => {
              console.log(pr)
            })
            .catch(err => console.log(err))
        })
        .catch(err => {
          console.log(err)
        })
    },
    testRecalc () {
      let chTasks = []
      function getChildren (ch) {
        for (let c = 0; c < ch.length; c++) {
          let chTask = gantt.getTask(ch[c])
          chTasks.push(chTask)
          if (gantt.hasChild(chTask.id)) {
            getChildren(gantt.getChildren(chTask.id))
          }
        }
      }
      var task = gantt.getTask(67056)
      if (gantt.hasChild(task.id)) {
        let ch = gantt.getChildren(task.id)
        getChildren(ch)
        console.log(chTasks)
        var maxTask = chTasks.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0]
        console.log(maxTask.end_date)
        task.end_date = maxTask.end_date
        gantt.updateTask(task.id)
        console.log(task.end_date)
      }
      chTasks = []

      // gantt.eachTask(function (task) {
      //   if (gantt.hasChild(task.id)) {
      //     // task.type = gantt.config.types.project
      //     let ch = gantt.getChildren(task.id)
      //     getChildren(ch)
      //     if (chTasks.length > 0) {
      //       let tempTasks = Array.from(new Set(chTasks))
      //       // console.log('chTasks', Array.from(new Set(chTasks)))
      //       // console.log('ch', ch)
      //       var minTask = tempTasks.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
      //       var maxTask = tempTasks.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0]
      //       if (maxTask.end_date) {
      //         // var taskStart = task.start_date
      //         // var taskEnd = maxTask ? maxTask.end_date : 0
      //         // console.log(start, end)
      //         // task.duration = gantt.calculateDuration(taskStart, taskEnd)
      //         task.end_date = maxTask.end_date
      //         gantt.updateTask(task.id)
      //         gantt.refreshTask(task.id)
      //         // task.end_date = gantt.date.parseDate(new Date(maxTask.end_date), '%Y-%m-%d %H:%i:%s')
      //         if (Number(task.id) === 67056) {
      //           // console.log('chTasks', Array.from(new Set(tempTasks)))
      //           console.log(task.end_date)
      //           console.log(maxTask.end_date)
      //         }
      //         // var dates = gantt.getSubtaskDates(task.id)
      //       }
      //     }
      //     // gantt.refreshTask(task.id)
      //     // gantt.updateTask(task.id)
      //   }
      //   chTasks = []
      // })
      gantt.render()
    },
    async getProcessStatus () {
      let convert = require('xml-js')
      // let result = convert.xml2js(r, { ignoreComment: true, ignoreDeclaration: true })
      // let processId = result.elements[0].elements[0].elements[0].elements[0].elements[0].text
      console.log(this.process)
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
    // async testTask () {
    //   this.$store.dispatch('setLoading', true)
    //   this.$store.dispatch('setSuccess', 'Запись плана проекта началась. Если ожидание затянулось, можете закрыть страницу. По окончании записи на почту поступит уведомление.')
    //   let convert = require('xml-js')
    //   await createPlanItems.getJsonUrl({ tasks: gantt.getTaskByTime(), links: gantt.getLinks(), resources: gantt.serverList('res'), project: '4950', plan: this.planId, user: this.user })
    //     .then(async resp => {
    //       console.log(resp, resp.data.file)
    //       await createPlanItems.runProcess({ file: resp.data.file, login: this.user })
    //         .then(async r => {
    //           let result = convert.xml2js(r, { ignoreComment: true, ignoreDeclaration: true })
    //           this.process = result.elements[0].elements[0].elements[0].elements[0].elements[0].text
    //           this.getProcessStatus()
    //           // console.log(processId)
    //           // await createPlanItems.checkProcess(processId)
    //           //   .then(respStatus => {
    //           //     let statusJson = convert.xml2js(respStatus, { ignoreComment: true, ignoreDeclaration: true })
    //           //     console.log(statusJson)
    //           //   })
    //           //   .catch(err => {
    //           //     console.log(err)
    //           //   })
    //         })
    //         .catch(e => {
    //           console.log(e)
    //         })
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    isImportMode () {
      return this.$route.query['import']
    },
    isEditMode () {
      return this.$route.query['edit']
    },
    showPredicted () {
      this.viewPredicted = !this.viewPredicted
      if (this.viewPredicted) {
        gantt.config.task_height = 11
        this.taskPredictLayer = gantt.addTaskLayer(function drawPlanned (task) {
          var start = task.hasOwnProperty('predictDates') ? task.predictDates.hasOwnProperty('start') ? task.predictDates.start : null : null
          var end = task.hasOwnProperty('predictDates') ? task.predictDates.hasOwnProperty('end') ? task.predictDates.end : null : null
          if (start && end) {
            var sizes = gantt.getTaskPosition(task, start, end)
            var el = document.createElement('div')
            el.className = 'baseline'
            el.style.left = sizes.left + 'px'
            el.style.width = sizes.width + 'px'
            el.style.top = sizes.top + gantt.config.task_height + 13 + 'px'
            return el
          }
          return false
        })
        // gantt.templates.task_class = function(start, end, task) {
        //   return 'gantt_side_content2', 'gantt_side_content.gantt_right2'
        // }
      } else {
        gantt.config.task_height = 19
        gantt.removeTaskLayer(this.taskPredictLayer)
      }
      gantt.render()
    },
    biginCalculate () {
      return new Promise(function (resolve, reject) {
        //
        function calcTasks (tasks) {
          var maxTask = tasks.sort((a, b) => b.end_date.getTime() - a.end_date.getTime())[0]
          return maxTask
        }
        function getClosestWork (date, type, duration) {
          var dateToString = ''
          if (type === 'start') {
            if (duration) {
              dateToString = gantt.calculateEndDate(new Date(date), duration).toISOString().substr(0, 10) + ' 09:00:00'
              return gantt.getClosestWorkTime({ date: new Date(dateToString) })
            } else {
              dateToString = date.toString().substr(0, 10) + ' 09:00:00'
              return gantt.getClosestWorkTime({ date: new Date(dateToString) })
            }
          } else {
            if (duration) {
              return gantt.calculateEndDate(new Date(date), duration)
            } else {
              dateToString = date.toString().substr(0, 10) + ' 18:00:00'
              return gantt.getClosestWorkTime({ date: new Date(dateToString) })
            }
          }
        }
        //
        var tasksUnsorted = gantt.getTaskByTime()
        for (let i = 0; i < tasksUnsorted.length; i++) {
          var predictionDates = {}
          if (tasksUnsorted[i].$target && tasksUnsorted[i].$target.length > 0) { // если есть предшественники
            var predecessors = []
            for (let p = 0; p < tasksUnsorted[i].$target.length; p++) {
              predecessors.push(gantt.getTask(gantt.getLink(tasksUnsorted[i].$target[p]).source))
            }
            var maxCalculatedTask = calcTasks(predecessors)
            if (maxCalculatedTask) {
              // var predecessorPredictedStart = maxCalculatedTask.hasOwnProperty('predictDates') ? maxCalculatedTask.predictDates.hasOwnProperty('start') ? maxCalculatedTask.predictDates.start : null : null
              var predecessorPredictedEnd = maxCalculatedTask.hasOwnProperty('predictDates') ? maxCalculatedTask.predictDates.hasOwnProperty('end') ? maxCalculatedTask.predictDates.end : null : null
              predictionDates.start = tasksUnsorted[i].StartPredictionDate ? getClosestWork(tasksUnsorted[i].StartPredictionDate, 'start', 1)
                : getClosestWork(maxCalculatedTask.EndPredictionDate ? maxCalculatedTask.EndPredictionDate
                  : predecessorPredictedEnd ? predecessorPredictedEnd.toISOString()
                    : maxCalculatedTask.EndWorkDate ? maxCalculatedTask.EndWorkDate
                      : maxCalculatedTask.EndDate, 'start', 1)
              predictionDates.end = tasksUnsorted[i].EndPredictionDate ? getClosestWork(tasksUnsorted[i].EndPredictionDate, 'end', null)
                : tasksUnsorted[i].EndWorkDate && new Date(tasksUnsorted[i].EndWorkDate) > predictionDates.start ? getClosestWork(tasksUnsorted[i].EndWorkDate, 'end', null)
                  : getClosestWork(predictionDates.start.toISOString(), 'end', tasksUnsorted[i].duration)
            }
          } else { // если нет предшественников
            predictionDates.start = tasksUnsorted[i].StartPredictionDate ? getClosestWork(tasksUnsorted[i].StartPredictionDate, 'start', null) : getClosestWork(tasksUnsorted[i].StartDate, 'start', null)
            predictionDates.end = tasksUnsorted[i].EndPredictionDate ? getClosestWork(tasksUnsorted[i].EndPredictionDate, 'end', null) : tasksUnsorted[i].EndWorkDate ? getClosestWork(tasksUnsorted[i].EndWorkDate, 'end', null) : getClosestWork(tasksUnsorted[i].StartPredictionDate ? tasksUnsorted[i].StartPredictionDate : tasksUnsorted[i].StartDate, 'end', tasksUnsorted[i].duration)
          }
          tasksUnsorted[i].predictDates = predictionDates
        }
        function getMinMax (tasks) {
          var minTask = tasks.sort((a, b) => a.predictDates.start.getTime() - b.predictDates.start.getTime())[0]
          var maxTask = tasks.sort((a, b) => b.predictDates.end.getTime() - a.predictDates.end.getTime())[0]
          return minTask && maxTask ? { minTask, maxTask } : null
        }
        // this.$nextTick()
        for (let i = 0; i < tasksUnsorted.length; i++) {
          var predictionDatesS = {}
          if (tasksUnsorted[i].$target && tasksUnsorted[i].$target.length > 0) { // если есть предшественники
            var predecessorsS = []
            for (let p = 0; p < tasksUnsorted[i].$target.length; p++) {
              predecessorsS.push(gantt.getTask(gantt.getLink(tasksUnsorted[i].$target[p]).source))
            }
            var maxCalculatedTaskS = calcTasks(predecessorsS)
            if (maxCalculatedTask) {
              // var predecessorPredictedStart = maxCalculatedTask.hasOwnProperty('predictDates') ? maxCalculatedTask.predictDates.hasOwnProperty('start') ? maxCalculatedTask.predictDates.start : null : null
              var predecessorPredictedEndS = maxCalculatedTaskS.hasOwnProperty('predictDates') ? maxCalculatedTaskS.predictDates.hasOwnProperty('end') ? maxCalculatedTaskS.predictDates.end : null : null
              predictionDatesS.start = tasksUnsorted[i].StartPredictionDate ? getClosestWork(tasksUnsorted[i].StartPredictionDate, 'start', 1)
                : getClosestWork(maxCalculatedTaskS.EndPredictionDate ? maxCalculatedTaskS.EndPredictionDate
                  : predecessorPredictedEndS ? predecessorPredictedEndS.toISOString()
                    : maxCalculatedTaskS.EndWorkDate ? maxCalculatedTaskS.EndWorkDate
                      : maxCalculatedTaskS.EndDate, 'start', 1)
              predictionDatesS.end = tasksUnsorted[i].EndPredictionDate ? getClosestWork(tasksUnsorted[i].EndPredictionDate, 'end', null)
                : tasksUnsorted[i].EndWorkDate && new Date(tasksUnsorted[i].EndWorkDate) > predictionDatesS.start ? getClosestWork(tasksUnsorted[i].EndWorkDate, 'end', null)
                  : getClosestWork(predictionDatesS.start.toISOString(), 'end', tasksUnsorted[i].duration)
            }
          } else { // если нет предшественников
            predictionDatesS.start = tasksUnsorted[i].StartPredictionDate ? getClosestWork(tasksUnsorted[i].StartPredictionDate, 'start', null) : getClosestWork(tasksUnsorted[i].StartDate, 'start', null)
            predictionDatesS.end = tasksUnsorted[i].EndPredictionDate ? getClosestWork(tasksUnsorted[i].EndPredictionDate, 'end', null) : tasksUnsorted[i].EndWorkDate ? getClosestWork(tasksUnsorted[i].EndWorkDate, 'end', null) : getClosestWork(tasksUnsorted[i].StartPredictionDate ? tasksUnsorted[i].StartPredictionDate : tasksUnsorted[i].StartDate, 'end', tasksUnsorted[i].duration)
          }
          tasksUnsorted[i].predictDates = predictionDatesS
          //
          // if (gantt.hasChild(tasksUnsorted[i].id)) {
          //   var predDates = {}
          //   //
          //   var childrenTasks = []
          //   gantt.eachTask(function (task) {
          //     childrenTasks.push(task)
          //   }, tasksUnsorted[i].id)
          //   //
          //   var minMax = getMinMax(childrenTasks)
          //   if (minMax) {
          //     predDates.start = minMax.minTask.predictDates.start
          //     predDates.end = minMax.maxTask.predictDates.end
          //   }
          //   tasksUnsorted[i].predictDates = predDates
          // }
        }
        for (let i = 0; i < tasksUnsorted.length; i++) {
          if (gantt.hasChild(tasksUnsorted[i].id)) {
            var predDates = {}
            //
            var childrenTasks = []
            gantt.eachTask(function (task) {
              childrenTasks.push(task)
            }, tasksUnsorted[i].id)
            //
            var minMax = getMinMax(childrenTasks)
            if (minMax) {
              predDates.start = minMax.minTask.predictDates.start
              predDates.end = minMax.maxTask.predictDates.end
            }
            tasksUnsorted[i].predictDates = predDates
          }
        }
        resolve(true)
      })
      // this.showPredicted()
    },
    togglePredictedView () {
      var firstTask = gantt.getTaskByIndex(0)
      if (firstTask.hasOwnProperty('predictDates')) {
        this.showPredicted()
      } else {
        this.biginCalculate()
          .then(res => this.showPredicted())
      }
    },
    toggleResourceView () {
      this.viewResource = !this.viewResource
      if (this.viewResource) {
        if (this.onlyGrid) {
          // gantt.config.show_chart = false
          // gantt.render()
          gantt.config.layout = this.ganttLayoutResource
          gantt.resetLayout()
        } else {
          gantt.config.show_chart = true
          gantt.render()
          gantt.config.layout = this.ganttLayoutResource
          gantt.resetLayout()
        }
        // gantt.config.layout = this.ganttLayoutResource
        // gantt.resetLayout()
      } else {
        if (this.onlyGrid) {
          // gantt.config.show_chart = false
          // gantt.render()
          gantt.config.layout = this.ganttLayoutTasks
          gantt.resetLayout()
        } else {
          gantt.config.show_chart = true
          gantt.render()
          gantt.config.layout = this.ganttLayoutTasks
          gantt.resetLayout()
        }
        // if (this.onlyGrid) {
        //   gantt.config.layout = this.ganttLayoutOnlyGrid
        //   gantt.resetLayout()
        // } else {
        //   gantt.config.layout = this.ganttLayoutTasks
        //   gantt.resetLayout()
        // }
      }
    },
    exportExcel () {
      function executorDiv (list, item) {
        let result = ''
        const find = list.filter(f => Number(f.PlanItem) === item.id)
        if (find && find.length > 0) {
          if (find.length === 1) {
            const element = find[0]
            result = `${(element.text ? element.text : element.dep_name)} (${100 / 8 * element.capacity}%)`
          } else {
            for (let i = 0; i < find.length; i++) {
              const element = find[i]
              result += `${(element.text ? element.text : element.dep_name)} (${100 / 8 * element.capacity}%)`
            }
          }
        } else {
          if (item.resource) {
            if (item.resource.length === 1) {
              const importFind = list.find(f => f.id === item.resource[0])
              result = `${importFind.text ? importFind.text : importFind.dep_name}`
            } else {
              for (let i = 0; i < item.resource.length; i++) {
                const importFind = list.find(f => f.id === item.resource[i])
                result += `${importFind.text ? importFind.text : importFind.dep_name}`
              }
            }
          }
        }
        return result
      }
      function getTypeTask (task) {
        switch (task.type) {
          case 'task':
            return 'задача'
          case 'phase':
            return 'суммарная задача'
          case 'project':
            return 'суммарная задача'
          case 'milestone':
            return 'ключевое событие'
          case 'subplan':
            return 'функциональный план'
          default:
            return 'N/A'
        }
      }
      function formatGlobal (link) {
        var linkType = ''
        switch (link.type) {
          case '0':
            linkType = 'ОН'
            break
          case '1':
            linkType = 'НН'
            break
          case '2':
            linkType = 'ОО'
            break
          case '3':
            linkType = 'НО'
            break
          default:
            linkType = ''
            break
        }
        return Number(link.lag) !== 0 ? `${linkType}${link.lag > 0 ? '+' + link.lag : link.lag} д` : ''
      }
      function getPredecessors (task) {
        var links = task.$target
        var labels = []
        for (var i = 0; i < links.length; i++) {
          var link = gantt.getLink(links[i])
          var pred = gantt.getTask(link.source)
          labels.push(pred.global_id + formatGlobal(link))
        }
        return labels.join(';')
      }
      function getSuccessors (task) {
        var links = task.$source
        var labels = []
        for (var i = 0; i < links.length; i++) {
          var link = gantt.getLink(links[i])
          var pred = gantt.getTask(link.target)
          labels.push(pred.global_id + formatGlobal(link))
        }
        return labels.join(';')
      }
      //
      var tasks = gantt.getTaskByTime()
      let data = []
      for (let i = 0; i < tasks.length; i++) {
        var task = tasks[i]
        if (gantt.isTaskVisible(task.id)) {
          data.push({
            ...task,
            _global_id: String(task.global_id),
            _progress: Math.round(task.progress * 100) + '%',
            _text: task.text,
            _type: getTypeTask(task),
            _duration: Math.round(task.duration / 8),
            _start_date: task.start_date,
            _end_date: task.end_date,
            _resources: executorDiv(gantt.serverList('res'), task),
            _predecessors: getPredecessors(task),
            _successors: getSuccessors(task),
            _wbs: String(gantt.getWBSCode(gantt.getTask(task.id))),
            _level: task.$level + 1,
            _is_summary: gantt.hasChild(task.id) ? 'phase' : 'task'
          })
        }
      }
      // console.log(data)
      var fileName = this.project ? this.project.Name.length <= 100 ? this.project.Name : this.project.Name.substr(0, 100) + '__(слишком длинное имя)__' : 'Проект'
      gantt.exportToExcel({
        name: fileName + '.xlsx',
        server: config.EXPORT_SERVER,
        // server: 'http://localhost:8192',
        cellColors: true,
        date_format: 'dd.mm.yyyy',
        data: data,
        columns: [
          { id: '_global_id', header: '#', width: 10, type: 'string' },
          { id: '_progress', width: 12, header: 'Выполнение' },
          { id: '_text', header: 'Задача', width: 90 },
          { id: '_type', header: 'Тип', width: 18 },
          { id: '_duration', width: 15, header: 'Длительность', type: 'number' },
          { id: '_start_date', header: 'Начало', width: 15, type: 'date' },
          { id: '_end_date', header: 'Завершение', width: 15, type: 'date' },
          { id: '_resources', header: 'Исполнитель', width: 20 },
          { id: '_predecessors', header: 'Предшественники', width: 15 },
          { id: '_successors', header: 'Последователи', width: 15 },
          { id: '_wbs', header: 'СДР', width: 12, type: 'string' },
          { id: '_level', header: 'Уровень', width: 10, type: 'number' }
        ]
      })
    },
    exportPDF () {
      var fileName = this.project ? this.project.Name.length <= 100 ? this.project.Name : this.project.Name.substr(0, 100) + '__(слишком длинное имя)__' : 'Проект'
      gantt.exportToPDF({
        name: fileName + '.pdf',
        skin: 'skyblue',
        server: config.EXPORT_SERVER,
        locale: 'ru',
        raw: true
      })
    },
    exportPng () {
      var fileName = this.project ? this.project.Name.length <= 100 ? this.project.Name : this.project.Name.substr(0, 100) + '__(слишком длинное имя)__' : 'Проект'
      gantt.exportToPNG({
        name: fileName + '.png',
        skin: 'skyblue',
        server: config.EXPORT_SERVER,
        locale: 'ru',
        raw: true
      })
    },
    exportProject () {
      var fileName = this.project ? this.project.Name.length <= 100 ? this.project.Name : this.project.Name.substr(0, 100) + '__(слишком длинное имя)__' : 'Проект'
      let res = gantt.serverList('res')
      let allUsers = []
      for (let i = 0; i < res.length; i++) {
        const user = res[i]
        allUsers.push({
          id: user.id,
          name: user.text,
          type: 'work'
        })
      }
      let uniqueUsers = new Map()
      allUsers.forEach(f => uniqueUsers.set(f.id, f))
      let users = [...uniqueUsers.values()]
      var host = 'http://' + window.location.hostname
      // console.log(users)
      // gantt.exportToPrimaveraP6({

      // })
      gantt.exportToMSProject({
        // skip_circular_links: false
        name: fileName + '.xml',
        server: config.IMPORT_SERVER,
        resources: users,
        // resources: users.filter(function (u) {
        //   if (u.id === '0') return false
        //   return true
        // })
        // .map(function (u) {
        //   return {
        //     id: u.id,
        //     name: u.name,
        //     type: 'work'
        //   }
        // }),
        tasks: {
          'Type': function (task) {
            return 1
          },
          // 'Work': function (task) {
          //   return `PT${task.Work}H0M0S` // PT16H0M0S
          // },
          'Linkwasd': function (task) {
            return host + task.url
          },
          'TaskIdwasd': function (task) {
            return task.ProjectTask
          },
          'Executorwasd': function (task) {
            // let executors = task.executor_id && Array.isArray(task.executor_id) ? task.executor_id.join(',') : ''
            // return executors
            return task.executor_id ? task.executor_id.join(',') : ''
          },
          ResourceAssignments: function (task) {
            let executors = []
            if (Array.isArray(task.executor_id) && task.executor_id.length > 0) {
              for (let i = 0; i < task.executor_id.length; i++) {
                const element = task.executor_id[i]
                executors.push(element.resource_id)
              }
            }
            return executors
          }
        }
      })
    },
    // async beforeImportFromMsProject () {
    //   await utils.getGlobalShedule()
    //     .then(globalShedule => {
    //       for (let i = 0; i < globalShedule.length; i++) {
    //         const day = globalShedule[i]
    //         gantt.setWorkTime({ date: new Date(day.DateStart), hours: false })
    //       }
    //       gantt.setWorkTime({ hours: [9, 13, 14, 18] })
    //       this.importMsProject()
    //     })
    // },
    testCustomXML () {
      // console.log(this.file)
      axios.post(`${config.useProxy ? config.proxyAddress : ''}http://localhost:3000/parsexml`, this.file, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => {
          parseXml.importProject(res.data)
            .then(pr => {
              console.log(pr)
            })
            .catch(err => console.log(err))
        })
    },
    importFromAny () {
      // const extension = this.file.name.slice((this.file.name.lastIndexOf('.') - 1 >>> 0) + 2)
      // if (extension === 'xer') {
      //   this.importPrimavera()
      // } else {
      //   this.importMsProject()
      // }
      if (this.file && !this.filePrima) {
        this.importMsProject()
      } else {
        console.log('project', this.project)
        this.importPrimavera()
      }
    },
    importMsProject () {
      this.readyForImport = false
      let gapTasks = []
      let that = this
      //
      utils.getGlobalShedule()
        .then(globalShedule => {
          for (let i = 0; i < globalShedule.length; i++) {
            const day = globalShedule[i]
            gantt.setWorkTime({ date: new Date(day.DateStart), hours: false })
          }
        })
      utils.getGlobalExceptionShedule()
        .then(exceptionShedule => {
          for (let i = 0; i < exceptionShedule.length; i++) {
            const dayEx = exceptionShedule[i]
            gantt.setWorkTime({ date: new Date(dayEx.DateStart) })
          }
        })
      gantt.setWorkTime({ hours: [9, 13, 14, 18] })
      //
      gantt.config.duration_step = 1
      gantt.config.work_time = true
      gantt.config.correct_work_time = true
      //
      // gantt.config.auto_scheduling = false
      // gantt.config.auto_scheduling = true
      // gantt.config.auto_scheduling_strict = true
      // // gantt.config.auto_scheduling_descendant_links = true
      // gantt.config.auto_scheduling_compatibility = true
      //
      //
      gantt.attachEvent('onBeforeTaskAutoSchedule', function (task, start, link, predecessor) {
        if (task.progress !== 0) {
          // var taskResume = new Date(gantt.date.parseDate(task.$custom_data['Resume'], '%Y-%m-%d %H:%i:%s'))
          // var taskResume = new Date(task.$custom_data['Resume'])
          // var taskStop = task.$custom_data['Stop'] ? new Date(task.$custom_data['Stop']) : null
          // // console.log('Oops! - 1', taskResume)
          // if (taskStop && taskResume.getDate() !== taskStop.getDate()) {
          //   console.log('Oops! - 1', taskResume, taskStop, new Date(task.start_date))
          //   console.log('Oops! - 2', gantt.date.parseDate(task.$custom_data.oldStart, '%Y-%m-%d %H:%i:%s')) // oldStart
          //   task.start_date = gantt.date.parseDate(task.$custom_data.oldStart, '%Y-%m-%d %H:%i:%s')
          //   task.end_date = gantt.date.parseDate(task.$custom_data.oldFinish, '%Y-%m-%d %H:%i:%s') // oldFinish
          // }
          return false
        } else {
          return true
        }
      })
      //
      //
      gantt.attachEvent('onAfterTaskAutoSchedule', function (task, start, link, predecessor) {
        if (task.type === 'milestone' && predecessor && link && ((Number(link.type) === 2 || Number(link.type) === 0))) { // && (Number(link.type) === 2 || Number(link.type) === 0)
          if (Number(link.lag) === 0) {
            task.start_date = predecessor.end_date
            gantt.refreshTask(task.id)
          } else {
            task.start_date = gantt.calculateEndDate({ start_date: gantt.date.add(predecessor.end_date, Number(link.lag) / 8, 'day'), duration: 16 })
            gantt.refreshTask(task.id)
          }
        } else if (task.type === 'milestone' && predecessor && link && Number(link.type) === 1 && Number(link.lag) > 0) { // НН и lag > 0
          task.start_date = gantt.calculateEndDate({ start_date: predecessor.start_date, duration: Number(link.lag) })
          // task.start_date = gantt.calculateEndDate({ start_date: gantt.date.add(predecessor.start_date, Number(link.lag) / 8, 'day'), duration: -1 })
          gantt.refreshTask(task.id)
        }
        // console.log('progress', task.progress)
        // if (Number(task.progress * 100) > 0) {
        //   console.log('progress!') // EarlyStart
        //   // var manualStart = new Date(gantt.date.parseDate(task.$custom_data['EarlyStart'], '%Y-%m-%d %H:%i:%s'))
        //   // var manualFinish = new Date(gantt.date.parseDate(task.$custom_data['ManualFinish'], '%Y-%m-%d %H:%i:%s'))
        //   var taskResume = new Date(gantt.date.parseDate(task.$custom_data['Resume'], '%Y-%m-%d %H:%i:%s'))
        //   var taskStop = task.$custom_data['Stop'] ? new Date(gantt.date.parseDate(task.$custom_data['Stop'], '%Y-%m-%d %H:%i:%s')) : null
        //   if (taskStop && taskResume.getDate() !== taskStop.getDate()) {
        //     console.log('Oops!', taskResume, taskStop)
        //   }
        // }
        // var source = gantt.getTask(link.source)
        // var target = gantt.getTask(link.target)
        // if (target.type === 'milestone' && (Number(link.type) === 2 || Number(link.type) === 0)) {
        //   target.start_date = source.end_date
        //   gantt.refreshTask(target.id)
        //   console.log('onAfterTaskAutoSchedule', task, link)
        // }
      })
      //
      //
      // gantt.attachEvent('onAfterTaskUpdate', function (id, item) {
      //   if (item.type === 'milestone') {
      //     console.log('onAfterTaskUpdate', item)
      //   }
      // })
      // gantt.attachEvent('onBeforeAutoSchedule', function (taskId) {
      //   console.log('onBeforeAutoSchedule', taskId)
      //   return true
      // })
      // gantt.attachEvent('onAfterAutoSchedule', function (taskId, updatedTasks) {
      //   console.log('onAfterAutoSchedule', updatedTasks)
      // })
      //
      //
      // gantt.attachEvent('onAfterLinkUpdate', function (id, item) {
      //   console.log('onAfterLinkUpdate', item)
      // })
      gantt.attachEvent('onAfterLinkAdd', function (id, link) {
        var source = gantt.getTask(link.source)
        var target = gantt.getTask(link.target)
        if (target.type === 'milestone' && (Number(link.type) === 2 || Number(link.type) === 0)) {
          target.start_date = source.end_date
          gantt.refreshTask(target.id)
        }
      })
      //
      //
      function getConstraintType (type) {
        switch (type) {
          case 0:
            return 'asap'
          case 1:
            return 'alap'
          case 2:
            return 'mso'
          case 3:
            return 'mfo'
          case 4:
            return 'snet'
          case 5:
            return 'snlt'
          case 6:
            return 'fnet'
          case 7:
            return 'fnlt'
          default:
            return 'asap'
        }
      }
      gantt.attachEvent('onTaskLoading', function (task) {
        task.constraint_type = task.$custom_data['ConstraintType'] ? getConstraintType(Number(task.$custom_data['ConstraintType'])) : 'asap'
        if (Number(task.$custom_data['ConstraintType']) !== 0) {
          let constraint = new Date(task.$custom_data['ConstraintDate']).getDate()
          let early = new Date(task.$custom_data['EarlyStart']).getDate()
          if (!that.enableAutoShedulling && constraint < early && task.duration === 0) {
            // console.log(task)
            task.constraint_date = gantt.date.parseDate(new Date(task.$custom_data['EarlyStart']), '%Y-%m-%d %H:%i:%s')
          } else {
            task.constraint_date = gantt.date.parseDate(new Date(task.$custom_data['ConstraintDate']), '%Y-%m-%d %H:%i:%s')
          }
        }
        if (task.$custom_data['DurationFormat'] === 'ed') {
          task.duration = Number(task.$custom_data['Duration']) * 8
        }
        //
        if (task.duration === 0) {
          task.type = gantt.config.types.milestone
        }
        if (!that.enableAutoShedulling && task.duration === 0) {
          task.start_date = gantt.date.parseDate(new Date(task.$custom_data['EarlyStart']), '%Y-%m-%d %H:%i:%s')
        }
        // let constraint = new Date(task.$custom_data['ConstraintDate']).getDate()
        // let early = new Date(task.$custom_data['EarlyStart'])
        // if (!gantt.config.auto_scheduling && constraint > early && task.duration === 0) {
        //   task.constraint_date = gantt.date.parseDate(new Date(task.$custom_data['EarlyStart']), '%Y-%m-%d %H:%i:%s')
        // }
        return true
      })
      //
      function onLoadData (fileType) {
        let newResources = []
        let departments = []
        // let projectResources = gantt.serverList('res')
        let users = that.$store.getters.users
        // console.log('users', users)
        let c = fileType ? 8 : 1
        gantt.attachEvent('onParse', async function () {
          // console.log('onParse')
          let globalId = 1
          let rawRes = Array.from(new Set(gantt.serverList('res')))
          console.log('rawRes', rawRes)
          let projectResources = gantt.serverList('res')

          //
          //
          // // task.Type
          // Fixed units 0
          // Fixed duration 1
          // Fixed work 2
          function formatWorkload (num) {
            let ost = Math.max(Number(Number(num).toFixed(2)), Math.round(num)) % Math.min(Number(Number(num).toFixed(2)), Math.round(num))
            if (isNaN(ost)) {
              return 0
            } else {
              if (ost === 0) {
                return num
              } else {
                return Number(Number(num).toFixed(2))
              }
            }
          }
          //
          gantt.eachTask(function (task) {
            if (task.$custom_data) {
              task.ProjectTask = task.$custom_data['ProjectTask']
              // task.executor_id = task.$custom_data['Executor']
              task.Critical = task.$custom_data['Critical']
              task.IsSubproject = task.$custom_data['IsSubproject']
              task.OutlineLevel = task.$custom_data['OutlineLevel']
              task.RemainingWork = task.$custom_data['RemainingWork']
              task.TotalSlack = task.$custom_data['TotalSlack']
              task.Work = parseFloat(task.$custom_data['Work'].replace(',', '.')) * c
              task.isImported = true
              task.workload = formatWorkload(task.Work)
              task.workloadstring = String(formatWorkload(task.Work)).replace('.', ',')
              task.wasdIndex = Number((String(task.$custom_data['WBS']).split('.')).pop()) - 1
              task.Summary = task.$custom_data['Summary']
              task.type = task.$custom_data['Milestone'] === '1' ? 'milestone' : task.$custom_data['Summary'] === '1' ? 'project' : 'task'
              task.pic_type = task.$custom_data['Milestone'] === '1' ? 'milestone' : task.$custom_data['Summary'] === '1' ? 'phase' : 'task'
              task.PercentComplete = parseFloat(task.$custom_data['PercentComplete']) / 100
              task.CompletePercent = task.$custom_data['PercentComplete']
              task.newId = Number(task.$custom_data['ID'])
              if (task.$custom_data['DurationFormat'] === 'ed') {
                task.duration = Number(task.$custom_data['Duration']) * 8
              }
              // task.$custom_data.oldDate = new Date(task.start_date)
              // 'IsPublished'
              //
              // task.constraint_type = task.$custom_data['ConstraintType'] ? getConstraintType(Number(task.$custom_data['ConstraintType'])) : 'asap'
              // if (Number(task.$custom_data['ConstraintType']) !== 0) {
              //   task.constraint_date = new Date(task.$custom_data['ConstraintDate'])
              // }
              //
              // 'ManualStart', 'Duration', 'DurationFormat', 'ManualFinish'
              // delete task.$custom_data
            }
            task.isGap = false
            task.id = Number(task.id)
            task.global_id = globalId
            task.progress = task.PercentComplete
            task.closed = task.PercentComplete >= 1 ? 1 : 0
            task.expired = 0
            task.url = ''
            task.executor_id = []
            if (task.type === gantt.config.types.subplan) {
              task.$open = false
            }
            //
            if (gantt.hasChild(task.id)) {
              task.type = gantt.config.types.project
              gantt.updateTask(task.id)
            } else if (task.duration === 0) {
              task.type = gantt.config.types.milestone
              // gantt.updateTask(task.id)
              // gantt.autoSchedule(task.id)
            }
            if (Number(task.progress * 100) > 0 && Number(task.progress * 100) < 100) {
              // console.log('progress!') // EarlyStart
              // var manualStart = new Date(gantt.date.parseDate(task.$custom_data['EarlyStart'], '%Y-%m-%d %H:%i:%s'))
              // var manualFinish = new Date(gantt.date.parseDate(task.$custom_data['ManualFinish'], '%Y-%m-%d %H:%i:%s'))
              var taskResume = task.$custom_data['Resume'] ? new Date(gantt.date.parseDate(task.$custom_data['Resume'], '%Y-%m-%d %H:%i:%s')) : null
              var taskStop = task.$custom_data['Stop'] ? new Date(gantt.date.parseDate(task.$custom_data['Stop'], '%Y-%m-%d %H:%i:%s')) : null
              if (taskStop && taskResume && taskResume.getDate() !== taskStop.getDate()) {
                task.isGap = true
                that.$store.dispatch('setIsGap', true)
                gapTasks.push(task)
                console.log('Oops!', task)
              }
            }
            //
            if (Array.isArray(task.resource)) {
              for (let i = 0; i < task.resource.length; i++) {
                const r = task.resource[i]
                const findR = projectResources.find(f => Number(f.id) === Number(r))
                // console.log('findR', findR)
                if (findR) {
                  let findU = null
                  if (String(findR.fullName).slice(-1) === '.') {
                    findU = users.find(f => f.shortName === findR.fullName)
                  } else {
                    findU = users.find(f => f.fullName === findR.fullName)
                  }
                  if (findU) {
                    const haschild = gantt.hasChild(task.id)
                    let res = { resource_id: Number(findU.id), value: Number(task.duration) === 0 ? 0 : parseFloat(task.Work) / Number(task.duration) * 8 }
                    task.executor_id.push(res)
                    newResources.push({
                      PlanItem: String(task.id),
                      Status: 0, // возможно забирать из users
                      capacity: haschild ? 0 : Number(task.duration) === 0 ? 0 : parseFloat(task.Work) / Number(task.duration) * (8 / task.resource.length), // брать из task
                      load: haschild || Number(task.duration) === 0 ? 0 : Math.round((parseFloat(task.Work) / Number(task.duration) * 100) / task.resource.length),
                      dep_name: findU.department === null ? 'Без подразделения' : findU.department,
                      id: String(findU.id),
                      parent: null, // желательно определить
                      text: findU.shortName,
                      fullName: findR.fullName
                    })
                    departments.push(findU.department === null ? 'Без подразделения' : findU.department)
                    // task.resource = null
                    // console.log(findU)
                  }
                }
              }
            }
            globalId++
            // gantt.updateTask(task.id)
          })
          // console.log('newResources', newResources)
          // links
          var links = gantt.getLinks()
          for (let l = 0; l < links.length; l++) {
            if (gantt.config.duration_unit === 'hour') {
              links[l].lag = links[l].hasOwnProperty('lag') ? links[l].lag * 8 : 0
              gantt.refreshLink(links[l].id)
              // gantt.autoSchedule(links[l].source)
            }
            // var targetTask = gantt.getTask(links[l].target)
            // if (targetTask.duration === 0) { // если КС, то тип связи ОО
            //   links[l].type = 2
            //   gantt.refreshLink(links[l].id)
            // }
          }
          //
          departments = Array.from(new Set(departments))
          // console.log(departments)
          for (let d = 0; d < departments.length; d++) {
            newResources.push({
              PlanItem: null,
              Status: null,
              capacity: null,
              load: 0,
              dep_name: null,
              id: 1000000 + d,
              parent: null,
              text: departments[d] === null ? 'Без подразделения' : departments[d],
              fullName: null
            })
            for (let r = 0; r < newResources.filter(f => f.dep_name === departments[d]).length; r++) {
              let element = newResources.filter(f => f.dep_name === departments[d])[r]
              element.parent = 1000000 + d
            }
          }
          gantt.updateCollection('res', newResources)
          // console.log(newResources)
          if (!gantt.$resourcesStore) {
            gantt.$resourcesStore = gantt.createDatastore({
              name: gantt.config.resource_store,
              type: 'treeDataStore',
              initItem: function (item) {
                item.parent = item.parent || gantt.config.root_id
                item[gantt.config.resource_property] = item.parent
                item.open = true
                return item
              }
            })
            gantt.$resourcesStore.attachEvent('onAfterSelect', function (id) {
              gantt.refreshData()
            })
            gantt.$resourcesStore.attachEvent('onParse', function () {
              var people = []
              gantt.$resourcesStore.eachItem(function (res) {
                if (!gantt.$resourcesStore.hasChild(res.id)) {
                  var copy = gantt.copy(res)
                  copy.key = res.id
                  copy.label = res.text
                  copy.unit = '%'
                  people.push(copy)
                }
              })
              gantt.updateCollection('people', people)
            })
            // console.log('resources1', newResources)
            gantt.$resourcesStore.parse(newResources)
          } else {
            console.log('res', gantt.serverList('res'))
            // console.log('resources2', newResources)
            gantt.$resourcesStore.parse(newResources)
          }
          // gantt.refreshData()
          // ******************************************************************************/
          function endPopup () {
            modal = null
            editLinkId = null
          }
          function cancelEditLink () {
            endPopup()
          }
          function deleteLink () {
            gantt.deleteLink(editLinkId)
            endPopup()
          }
          function saveLink () {
            var link = gantt.getLink(editLinkId)
            var lagValue = modal.querySelector('.lag-input').value
            if (!isNaN(parseInt(lagValue, 10))) {
              link.lag = parseInt(lagValue, 10)
            }
            gantt.updateLink(link.id)
            if (gantt.autoSchedule) {
              gantt.autoSchedule(link.source)
            }
            endPopup()
          }
          var modal
          var editLinkId
          gantt.attachEvent('onLinkDblClick', function (id, e) {
            editLinkId = id
            var link = gantt.getLink(id)
            var linkTitle
            switch (link.type) {
              case gantt.config.links.finish_to_start:
                linkTitle = 'FS'
                break
              case gantt.config.links.finish_to_finish:
                linkTitle = 'FF'
                break
              case gantt.config.links.start_to_start:
                linkTitle = 'SS'
                break
              case gantt.config.links.start_to_finish:
                linkTitle = 'SF'
                break
            }
            linkTitle += ' ' + gantt.getTask(link.source).text + ' -> ' + gantt.getTask(link.target).text
            modal = gantt.modalbox({
              title: linkTitle,
              text: '<div>' +
                `<label>Lag <input type='number' class='lag-input' /></label></div>`,
              buttons: [
                { label: 'Save', css: 'link-save-btn', value: 'save' },
                { label: 'Cancel', css: 'link-cancel-btn', value: 'cancel' },
                { label: 'Delete', css: 'link-delete-btn', value: 'delete' }
              ],
              width: '500px',
              type: 'popup-css-class-here',
              callback: function (result) {
                switch (result) {
                  case 'save':
                    saveLink()
                    break
                  case 'cancel':
                    cancelEditLink()
                    break
                  case 'delete':
                    deleteLink()
                    break
                }
              }
            })
            modal.querySelector('.lag-input').value = link.lag || 0
            // any custom logic here
            return false
          })
        })
        // gantt.autoSchedule()
      }
      if (this.file) {
        // const extension = this.file.name.slice((this.file.name.lastIndexOf('.') - 1 >>> 0) + 2)
        // console.log('this.file', extension)
        this.$store.dispatch('setLoading', true)
        let allData = gantt.serialize()
        gantt.clearAll()
        // console.log(allData)
        let store = this.$store
        gantt.importFromMSProject({
          server: config.IMPORT_SERVER, // 'http://10.175.180.200:9099/', // http://10.175.180.201:8888/ 9099 65163 IMPORT_SERVER
          data: this.file,
          durationUnit: 'hour',
          projectProperties: ['Name', 'Title', 'StartDate', 'FinishDate', 'Assignments'],
          taskProperties: ['ProjectTask', 'Executor', 'PercentComplete', 'Type', 'Milestone', 'Summary', 'Critical', 'FreeSlack', 'IsPublished', 'Stop', 'Resume', 'ManualStart', 'ManualFinish',
            'TimephasedData', 'EarlyStart', 'LateStart', 'IsSubproject', 'OutlineLevel', 'RemainingWork', 'TotalSlack', 'Work', 'WBS', 'Start', 'Finish', 'Duration', 'DurationFormat', 'ID', 'ConstraintType', 'ConstraintDate'],
          callback: (project) => {
            if (project) {
              // for (let t = 0; t < project.data.data.length; t++) {
              //   // const element = project.data.data[t]
              //   project.data.data[t].id = Number(project.data.data[t].$custom_data['ID']) + 10000
              //   // project.data.data[t].$custom_data.oldFinish = project.data.data[t].end_date
              // }
              let resources = []
              for (let i = 0; i < project.resources.length; i++) {
                const res = project.resources[i]
                resources.push({
                  id: res.id,
                  text: res.name,
                  fullName: res.name,
                  dep_name: res.name
                })
              }
              gantt.serverList('res', resources)
              gantt.updateCollection('res', resources)
              // console.log('resources', resources)
              // console.log('gantt.serverList', gantt.serverList('res'))
              var fileType = null
              if (project.config.$custom_data) {
                var dates = []
                dates.push({ StartDate: project.config.$custom_data.StartDate, FinishDate: project.config.$custom_data.FinishDate })
                gantt.serverList('dates', dates)
                fileType = project.config.$custom_data.Name
                gantt.config.duration_unit = 'hour'
                onLoadData(fileType)
                store.dispatch('setPageHeader', project.config.$custom_data.Title)
                // Begin Markers
                var dateToStr = gantt.date.date_to_str(gantt.config.task_date)
                var today = new Date()
                gantt.addMarker({
                  start_date: today,
                  css: 'today',
                  text: 'Сегодня',
                  title: dateToStr(today)
                })
                var projectstart = new Date(project.config.$custom_data.StartDate)
                gantt.addMarker({
                  start_date: projectstart,
                  css: 'status_line',
                  text: 'Старт',
                  title: dateToStr(projectstart)
                })
                var projectEnd = new Date(project.config.$custom_data.FinishDate)
                gantt.addMarker({
                  start_date: projectEnd,
                  css: 'finish',
                  text: 'Завершение',
                  title: dateToStr(projectEnd)
                })
                // End Markers
              }
              // if (project.config.duration_unit) {
              //   // gantt.config.duration_unit = 'hour'
              //   gantt.config.duration_unit = project.config.duration_unit
              // }
              //
              // var workTimeDates = project.worktime.dates
              // for (var element in workTimeDates) {
              //   // var date = new Date(element)
              //   // console.log(element,workTimeDates[element], date)
              //   if (element < 10) {
              //     gantt.setWorkTime({ day: element, hours: workTimeDates[element] })
              //   } else {
              //     gantt.setWorkTime({ date: new Date(+element), hours: workTimeDates[element] })
              //   }
              // }
              //
              // gantt.config.duration_unit = 'hour'
              //
              // utils.getGlobalShedule()
              //   .then(globalShedule => {
              //     for (let i = 0; i < globalShedule.length; i++) {
              //       const day = globalShedule[i]
              //       gantt.setWorkTime({ date: new Date(day.DateStart), hours: false })
              //     }
              //     gantt.setWorkTime({ hours: [9, 13, 14, 18] })
              //   })
              // //
              // // gantt.config.duration_step = 1
              // gantt.config.work_time = true
              // // gantt.config.correct_work_time = true
              // //
              // gantt.config.auto_scheduling = true
              // gantt.config.auto_scheduling_strict = true
              // // gantt.config.auto_scheduling_descendant_links = true
              // gantt.config.auto_scheduling_compatibility = true
              // //
              gantt.config.readonly = false
              gantt.config.keyboard_navigation = true
              // console.log(project)
              // onLoadData(fileType)
              // console.log('res', resources)
              console.log('project', project)
              gantt.parse(project.data)
              gantt.autoSchedule()
              this.$store.dispatch('setLoading', false)
              if (this.$store.getters.isGap) {
                this.$store.dispatch('setGapTasks', gapTasks)
                this.$store.dispatch('setDialogGap', true)
              } else {
                this.readyForImport = true
              }
              this.$store.dispatch('setAllTasksCount', project.data.data.length)
              gantt.refreshData()
            } else {
              console.log('nodata')
              gantt.parse(allData)
              this.$store.dispatch('setLoading', false)
              this.readyForImport = false
            }
          }
        })
      }
    },
    async importPrimavera () {
      this.readyForImport = false
      let that = this
      // console.log(gantt2.config)
      // // gantt = gantt2
      // //
      // gantt = await ganttinitial.ganttLoadResources(gantt2, this.planId)
      // //
      // gantt = await ganttinitial.ganttAttachEvents(gantt2)
      // //
      // gantt = await ganttinitial.ganttLoadServerLists(gantt2, this.planId)
      // //
      // gantt = await ganttinitial.ganttInitialConfig(gantt2)
      //
      var iconv = require('iconv-lite')
      iconv.skipDecodeWarning = true
      //
      utils.getGlobalShedule()
        .then(globalShedule => {
          for (let i = 0; i < globalShedule.length; i++) {
            const day = globalShedule[i]
            gantt.setWorkTime({ date: new Date(day.DateStart), hours: false })
          }
        })
      utils.getGlobalExceptionShedule()
        .then(exceptionShedule => {
          for (let i = 0; i < exceptionShedule.length; i++) {
            const dayEx = exceptionShedule[i]
            gantt.setWorkTime({ date: new Date(dayEx.DateStart) })
          }
        })
      gantt.setWorkTime({ hours: [9, 13, 14, 18] })
      //
      gantt.config.duration_step = 1
      gantt.config.work_time = true
      gantt.config.correct_work_time = true
      //
      gantt.config.auto_scheduling = false
      gantt.config.auto_scheduling_initial = false
      gantt.config.auto_scheduling_strict = false
      gantt.config.auto_scheduling_compatibility = false
      // gantt.config.auto_types = true
      // gantt.config.readonly = false
      // gantt.config.auto_scheduling = true
      // gantt.config.auto_scheduling_strict = true
      // // gantt.config.auto_scheduling_descendant_links = true
      // gantt.config.auto_scheduling_compatibility = true
      //
      //
      // let chTasks = []
      // function getChildren (ch) {
      //   for (let c = 0; c < ch.length; c++) {
      //     let chTask = gantt.getTask(Number(ch[c]))
      //     chTasks.push(chTask)
      //     if (gantt.hasChild(Number(chTask.id))) {
      //       getChildren(gantt.getChildren(Number(chTask.id)))
      //     }
      //   }
      // }
      // function recalc () {
      //   gantt.eachTask(function (task) {
      //     if (gantt.hasChild(task.id)) {
      //       // task.type = gantt.config.types.project
      //       let ch = gantt.getChildren(task.id)
      //       getChildren(ch)
      //       if (chTasks.length > 0) {
      //         let tempTasks = Array.from(new Set(chTasks))
      //         // console.log('chTasks', Array.from(new Set(chTasks)))
      //         // console.log('ch', ch)
      //         var minTask = tempTasks.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
      //         var maxTask = tempTasks.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0]
      //         if (maxTask.end_date) {
      //           // var taskStart = task.start_date
      //           // var taskEnd = maxTask ? maxTask.end_date : 0
      //           // console.log(start, end)
      //           // task.duration = gantt.calculateDuration(taskStart, taskEnd)
      //           var dateStartToString = (new Date(minTask.start_date)).toISOString().substr(0, 10) + ' 09:00:00'
      //           var dateEndToString = (new Date(maxTask.end_date)).toISOString().substr(0, 10) + ' 18:00:00'
      //           task.start_date = new Date(dateStartToString)
      //           task.end_date = new Date(dateEndToString)
      //           // gantt.updateTask(task.id)
      //           // gantt.refreshTask(task.id)
      //           // task.end_date = gantt.date.parseDate(new Date(maxTask.end_date), '%Y-%m-%d %H:%i:%s')
      //           if (Number(task.id) === 67047) {
      //             // console.log('chTasks', Array.from(new Set(tempTasks)))
      //             console.log(minTask.start_date)
      //             console.log(maxTask.end_date)
      //           }
      //           // var dates = gantt.getSubtaskDates(task.id)
      //         }
      //       }
      //       // gantt.refreshTask(task.id)
      //       // gantt.updateTask(task.id)
      //     }
      //     chTasks = []
      //   })
      // }
      //
      //
      // gantt.attachEvent('onBeforeGanttRender', function () {
      // gantt.eachTask(function (task) {
      //   if (gantt.hasChild(Number(task.id))) {
      //     task.type = gantt.config.types.project
      //     let ch = gantt.getChildren(Number(task.id))
      //     getChildren(ch)
      //     console.log('onBeforeGanttRender')
      //     if (chTasks.length > 0) {
      //       let tempTasks = Array.from(new Set(chTasks))
      //       // console.log('chTasks', Array.from(new Set(chTasks)))
      //       // console.log('ch', ch)
      //       // var minTask = tempTasks.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
      //       var maxTask = tempTasks.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0]
      //       if (maxTask.end_date) {
      //         var taskStart = task.start_date
      //         var taskEnd = maxTask ? maxTask.end_date : 0
      //         // console.log(start, end)
      //         task.duration = gantt.calculateDuration(taskStart, taskEnd)
      //         task.end_date = gantt.date.parseDate(new Date(maxTask.end_date), '%Y-%m-%d %H:%i:%s')
      //         if (Number(task.id) === 67056) {
      //           console.log('chTasks', Array.from(new Set(tempTasks)))
      //           console.log('max', gantt.getSubtaskDates(task.id), gantt.calculateDuration(taskStart, taskEnd))
      //         }
      //         // var dates = gantt.getSubtaskDates(task.id)
      //       }
      //     }
      //     gantt.refreshTask(task.id)
      //     // gantt.updateTask(task.id)
      //   }
      // })
      // })
      //
      //
      gantt.attachEvent('onBeforeTaskAutoSchedule', function (task, start, link, predecessor) {
        // console.log('onBeforeTaskAutoSchedule')
        // if (gantt.hasChild(Number(task.id))) {
        //   task.type = gantt.config.types.project
        //   let ch = gantt.getChildren(Number(task.id))
        //   getChildren(ch)
        //   if (chTasks.length > 0) {
        //     let tempTasks = Array.from(new Set(chTasks))
        //     // console.log('chTasks', Array.from(new Set(chTasks)))
        //     // console.log('ch', ch)
        //     // var minTask = tempTasks.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
        //     var maxTask = tempTasks.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0]
        //     if (maxTask.end_date) {
        //       var taskStart = task.start_date
        //       var taskEnd = maxTask ? maxTask.end_date : 0
        //       // console.log(start, end)
        //       task.duration = gantt.calculateDuration(taskStart, taskEnd)
        //       task.end_date = gantt.date.parseDate(new Date(maxTask.end_date), '%Y-%m-%d %H:%i:%s')
        //       if (Number(task.id) === 67056) {
        //         console.log('chTasks', Array.from(new Set(tempTasks)))
        //         console.log('max', gantt.getSubtaskDates(task.id), gantt.calculateDuration(taskStart, taskEnd))
        //       }
        //       // var dates = gantt.getSubtaskDates(task.id)
        //     }
        //   }
        //   // gantt.refreshTask(task.id)
        //   chTasks = []
        //   gantt.updateTask(task.id)
        // }
        return false
        // if (task.progress !== 0) {
        //   // var taskResume = new Date(gantt.date.parseDate(task.$custom_data['Resume'], '%Y-%m-%d %H:%i:%s'))
        //   // var taskResume = new Date(task.$custom_data['Resume'])
        //   // var taskStop = task.$custom_data['Stop'] ? new Date(task.$custom_data['Stop']) : null
        //   // // console.log('Oops! - 1', taskResume)
        //   // if (taskStop && taskResume.getDate() !== taskStop.getDate()) {
        //   //   console.log('Oops! - 1', taskResume, taskStop, new Date(task.start_date))
        //   //   console.log('Oops! - 2', gantt.date.parseDate(task.$custom_data.oldStart, '%Y-%m-%d %H:%i:%s')) // oldStart
        //   //   task.start_date = gantt.date.parseDate(task.$custom_data.oldStart, '%Y-%m-%d %H:%i:%s')
        //   //   task.end_date = gantt.date.parseDate(task.$custom_data.oldFinish, '%Y-%m-%d %H:%i:%s') // oldFinish
        //   // }
        //   return false
        // } else {
        //   return true
        // }
      })
      //
      //
      gantt.attachEvent('onAfterTaskAutoSchedule', function (task, start, link, predecessor) {
        // if (task.type === 'milestone' && predecessor && link && ((Number(link.type) === 2 || Number(link.type) === 0))) { // && (Number(link.type) === 2 || Number(link.type) === 0)
        //   if (Number(link.lag) === 0) {
        //     task.start_date = predecessor.end_date
        //     gantt.refreshTask(task.id)
        //   } else {
        //     task.start_date = gantt.calculateEndDate({ start_date: gantt.date.add(predecessor.end_date, Number(link.lag) / 8, 'day'), duration: 16 })
        //     gantt.refreshTask(task.id)
        //   }
        // } else if (task.type === 'milestone' && predecessor && link && Number(link.type) === 1 && Number(link.lag) > 0) { // НН и lag > 0
        //   task.start_date = gantt.calculateEndDate({ start_date: predecessor.start_date, duration: Number(link.lag) })
        //   // task.start_date = gantt.calculateEndDate({ start_date: gantt.date.add(predecessor.start_date, Number(link.lag) / 8, 'day'), duration: -1 })
        //   gantt.refreshTask(task.id)
        // }
        //
        //
        //
        // console.log('progress', task.progress)
        // if (Number(task.progress * 100) > 0) {
        //   console.log('progress!') // EarlyStart
        //   // var manualStart = new Date(gantt.date.parseDate(task.$custom_data['EarlyStart'], '%Y-%m-%d %H:%i:%s'))
        //   // var manualFinish = new Date(gantt.date.parseDate(task.$custom_data['ManualFinish'], '%Y-%m-%d %H:%i:%s'))
        //   var taskResume = new Date(gantt.date.parseDate(task.$custom_data['Resume'], '%Y-%m-%d %H:%i:%s'))
        //   var taskStop = task.$custom_data['Stop'] ? new Date(gantt.date.parseDate(task.$custom_data['Stop'], '%Y-%m-%d %H:%i:%s')) : null
        //   if (taskStop && taskResume.getDate() !== taskStop.getDate()) {
        //     console.log('Oops!', taskResume, taskStop)
        //   }
        // }
        // var source = gantt.getTask(link.source)
        // var target = gantt.getTask(link.target)
        // if (target.type === 'milestone' && (Number(link.type) === 2 || Number(link.type) === 0)) {
        //   target.start_date = source.end_date
        //   gantt.refreshTask(target.id)
        //   console.log('onAfterTaskAutoSchedule', task, link)
        // }
      })
      //
      //
      // gantt.attachEvent('onAfterTaskUpdate', function (id, item) {
      //   if (item.type === 'milestone') {
      //     console.log('onAfterTaskUpdate', item)
      //   }
      // })
      // gantt.attachEvent('onBeforeAutoSchedule', function (taskId) {
      //   console.log('onBeforeAutoSchedule', taskId)
      //   return true
      // })
      // gantt.attachEvent('onAfterAutoSchedule', function (taskId, updatedTasks) {
      //   console.log('onAfterAutoSchedule', updatedTasks)
      // })
      //
      //
      // gantt.attachEvent('onAfterLinkUpdate', function (id, item) {
      //   console.log('onAfterLinkUpdate', item)
      // })
      gantt.attachEvent('onAfterLinkAdd', function (id, link) {
        var source = gantt.getTask(link.source)
        var target = gantt.getTask(link.target)
        if (target.type === 'milestone' && (Number(link.type) === 2 || Number(link.type) === 0)) {
          target.start_date = source.end_date
          gantt.refreshTask(target.id)
        }
      })
      //
      //
      // function getConstraintType (type) {
      //   switch (type) {
      //     case 0:
      //       return 'asap'
      //     case 1:
      //       return 'alap'
      //     case 2:
      //       return 'mso'
      //     case 3:
      //       return 'mfo'
      //     case 4:
      //       return 'snet'
      //     case 5:
      //       return 'snlt'
      //     case 6:
      //       return 'fnet'
      //     case 7:
      //       return 'fnlt'
      //     default:
      //       return 'asap'
      //   }
      // }
      // gantt.attachEvent('onTaskLoading', function (task) {
      //   task.constraint_type = task.$custom_data['ConstraintType'] ? getConstraintType(Number(task.$custom_data['ConstraintType'])) : 'asap'
      //   if (Number(task.$custom_data['ConstraintType']) !== 0 && !gantt.hasChild(task.id)) {
      //     let constraint = new Date(task.$custom_data['ConstraintDate']).getDate()
      //     let early = new Date(task.$custom_data['EarlyStart']).getDate()
      //     if (!that.enableAutoShedulling && constraint < early && task.duration === 0) {
      //       // console.log(task)
      //       task.constraint_date = gantt.date.parseDate(new Date(task.$custom_data['EarlyStart']), '%Y-%m-%d %H:%i:%s')
      //     } else {
      //       task.constraint_date = gantt.date.parseDate(new Date(task.$custom_data['ConstraintDate']), '%Y-%m-%d %H:%i:%s')
      //     }
      //   }
      //   // if (task.$custom_data['DurationFormat'] === 'ed') {
      //   //   task.duration = Number(task.$custom_data['Duration']) * 8
      //   // }
      //   //
      //   // if (task.duration === 0) {
      //   //   task.type = gantt.config.types.milestone
      //   // }
      //   if (!that.enableAutoShedulling && task.duration === 0 && !gantt.hasChild(task.id)) {
      //     task.start_date = gantt.date.parseDate(new Date(task.$custom_data['EarlyStart']), '%Y-%m-%d %H:%i:%s')
      //   }
      //   //
      //   //
      //   //

      //   // if (gantt.hasChild(task.id)) {
      //   //   // duration of the subproject
      //   //   var dates = gantt.getSubtaskDates(task.id)
      //   //   task.end_date = gantt.date.parseDate(new Date(dates.end_date), '%Y-%m-%d %H:%i:%s')
      //   //   // console.log(task.text + ': ' + dates.start_date + ' - ' + dates.end_date)
      //   //   gantt.updateTask(task.id)
      //   //   //
      //   //   // eslint-disable-next-line
      //   //   // var minTask = tasks.sort((a, b) => a.start_date.getTime() - b.start_date.getTime())[0]
      //   //   // // eslint-disable-next-line
      //   //   // var maxTask = tasks.sort((a, b) => b.end_date.getTime() - a.end_date.getTime())[0]
      //   // }
      //   // console.log('onTaskLoading')
      //   return true
      // })
      //
      // gantt.attachEvent('onGanttRender', function () {
      //   gantt.eachTask(function (task) {
      //     if (gantt.hasChild(task.id)) {
      //       // duration of the subproject
      //       var dates = gantt.getSubtaskDates(task.id)
      //       task.end_date = gantt.date.parseDate(new Date(dates.end_date), '%Y-%m-%d %H:%i:%s')
      //       console.log(task.text + ': ', dates)
      //       gantt.updateTask(task.id)
      //     }
      //   })
      // })
      //
      //
      //
      let newResources = []
      let departments = []

      let users = that.$store.getters.users
      // let c = fileType ? 8 : 1
      let c = 1
      // function onLoadData (fileType) {
      function formatWorkload (num) {
        let ost = Math.max(Number(Number(num).toFixed(2)), Math.round(num)) % Math.min(Number(Number(num).toFixed(2)), Math.round(num))
        if (isNaN(ost)) {
          return 0
        } else {
          if (ost === 0) {
            return num
          } else {
            return Number(Number(num).toFixed(2))
          }
        }
      }
      //
      gantt.attachEvent('onParse', function () {
        // gantt.config.auto_types = true
        // console.log('onParse')
        let globalId = 1
        let projectResources = gantt.serverList('res')
        // let projectResources = rawRes
        //
        //
        // // task.Type
        // Fixed units 0
        // Fixed duration 1
        // Fixed work 2
        gantt.eachTask(function (task) {
          //
          if (!task.end_date) {
            gantt.deleteTask(task.id)
          } else {
            if (task.$custom_data) {
              task.ProjectTask = task.$custom_data['ProjectTask']
              // task.executor_id = task.$custom_data['Executor']
              task.Critical = task.$custom_data['Critical']
              task.IsSubproject = task.$custom_data['IsSubproject']
              task.OutlineLevel = task.$custom_data['OutlineLevel']
              task.RemainingWork = task.$custom_data['RemainingWork']
              task.TotalSlack = task.$custom_data['TotalSlack']
              task.Work = task.$custom_data['Work'] ? parseFloat(task.$custom_data['Work'].replace(',', '.')) * c : 0
              task.isImported = true
              task.workload = formatWorkload(task.Work)
              task.workloadstring = String(formatWorkload(task.Work)).replace('.', ',')
              task.wasdIndex = Number((String(task.$custom_data['WBS']).split('.')).pop()) - 1
              task.Summary = task.$custom_data['Summary']
              task.type = task.$custom_data['Milestone'] === '1' ? 'milestone' : task.$custom_data['Summary'] === '1' ? 'project' : 'task'
              task.pic_type = task.$custom_data['Milestone'] === '1' ? 'milestone' : task.$custom_data['Summary'] === '1' ? 'phase' : 'task'
              task.PercentComplete = !task.$custom_data['PercentComplete'] ? 0 : parseFloat(task.$custom_data['PercentComplete']) / 100
              task.CompletePercent = !task.$custom_data['PercentComplete'] ? 0 : task.$custom_data['PercentComplete']
              task.newId = Number(task.$custom_data['ID'])
              if (task.$custom_data['DurationFormat'] === 'ed') {
                task.duration = Number(task.$custom_data['Duration']) * 8
              }
            }
            task.text = iconv.encode(iconv.decode(task.text, 'cp1251'), 'utf8').toString()
            task.Subject = iconv.encode(iconv.decode(task.text, 'cp1251'), 'utf8').toString()
            task.id = Number(task.id)
            task.global_id = globalId
            task.progress = !task.PercentComplete ? 0 : task.PercentComplete
            task.closed = task.PercentComplete >= 1 ? 1 : 0
            task.expired = 0
            task.url = ''
            task.executor_id = []
            if (task.type === gantt.config.types.subplan) {
              task.$open = false
            }
            //
            if (gantt.hasChild(task.id)) {
              // task.type = gantt.config.types.project
              // let childrens = []
              // gantt.eachTask(function (eTask) {
              //   childrens.push(eTask)
              // }, task.id)
              // if (childrens.length > 0) {
              //   let tempTasks = Array.from(new Set(childrens))
              //   var minTask = tempTasks.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
              //   var maxTask = tempTasks.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0]
              //   if (maxTask.end_date) {
              //     var dateStart = (new Date(minTask.start_date)).toISOString().substr(0, 10) + ' 09:00:00'
              //     var dateEnd = (new Date(maxTask.end_date)).toISOString().substr(0, 10) + ' 18:00:00'
              //     task.start_date = new Date(dateStart)
              //     task.end_date = new Date(dateEnd)
              //     if (Number(task.id) === 69106) {
              //       console.log('childrens', childrens)
              //       console.log(minTask.start_date)
              //       console.log(maxTask.end_date)
              //     }
              //   }
              // }
              // gantt.updateTask(task.id)
            } else if (task.duration === 0) {
              task.type = gantt.config.types.milestone
              task.pic_type = 'milestone'
              // var dateStartToString = (new Date(task.start_date)).toISOString().substr(0, 10) + ' 09:00:00'
              // var dateEndToString = (new Date(task.start_date)).toISOString().substr(0, 10) + ' 18:00:00'
              // task.start_date = new Date(dateStartToString)
              // task.end_date = new Date(dateEndToString)
              // gantt.updateTask(task.id)
              // gantt.autoSchedule(task.id)
            }
            //
            if (Array.isArray(task.resource)) {
              for (let i = 0; i < task.resource.length; i++) {
                const r = task.resource[i]
                const findR = projectResources.find(f => Number(f.id) === Number(r))
                if (findR) {
                  let findU = null
                  if (String(findR.fullName).slice(-1) === '.') {
                    findU = users.find(f => f.shortName === findR.fullName)
                  } else {
                    findU = users.find(f => f.fullName === findR.fullName)
                  }
                  if (findU) {
                    const haschild = gantt.hasChild(task.id)
                    let res = { resource_id: Number(findU.id), value: Number(task.duration) === 0 ? 0 : parseFloat(task.Work) / Number(task.duration) * 8 }
                    task.executor_id.push(res)
                    newResources.push({
                      PlanItem: String(task.id),
                      Status: 0, // возможно забирать из users
                      capacity: haschild ? 0 : Number(task.duration) === 0 ? 0 : parseFloat(task.Work) / Number(task.duration) * (8 / task.resource.length), // брать из task
                      load: haschild || Number(task.duration) === 0 ? 0 : Math.round((parseFloat(task.Work) / Number(task.duration) * 100) / task.resource.length),
                      dep_name: findU.department === null ? 'Без подразделения' : findU.department,
                      id: String(findU.id),
                      parent: null, // желательно определить
                      text: findU.shortName,
                      fullName: findR.fullName
                    })
                    departments.push(findU.department === null ? 'Без подразделения' : findU.department)
                    // task.resource = null
                    // console.log(findU)
                  }
                }
              }
            }
            globalId++
            // chTasks = []
          }

          // gantt.updateTask(task.id)
        })
        // recalc()
        // links
        var links = gantt.getLinks()
        for (let l = 0; l < links.length; l++) {
          if (gantt.config.duration_unit === 'hour') {
            links[l].lag = links[l].hasOwnProperty('lag') ? links[l].lag * 8 : 0
            gantt.refreshLink(links[l].id)
            // gantt.autoSchedule(links[l].source)
          }
          // var targetTask = gantt.getTask(links[l].target)
          // if (targetTask.duration === 0) { // если КС, то тип связи ОО
          //   links[l].type = 2
          //   gantt.refreshLink(links[l].id)
          // }
        }
        //
        departments = Array.from(new Set(departments))
        // console.log(departments)
        for (let d = 0; d < departments.length; d++) {
          newResources.push({
            PlanItem: null,
            Status: null,
            capacity: null,
            load: 0,
            dep_name: null,
            id: 1000000 + d,
            parent: null,
            text: departments[d] === null ? 'Без подразделения' : departments[d],
            fullName: null
          })
          for (let r = 0; r < newResources.filter(f => f.dep_name === departments[d]).length; r++) {
            let element = newResources.filter(f => f.dep_name === departments[d])[r]
            element.parent = 1000000 + d
          }
        }
        gantt.updateCollection('res', newResources)
        // console.log(newResources)
        if (!gantt.$resourcesStore) {
          gantt.$resourcesStore = gantt.createDatastore({
            name: gantt.config.resource_store,
            type: 'treeDataStore',
            initItem: function (item) {
              item.parent = item.parent || gantt.config.root_id
              item[gantt.config.resource_property] = item.parent
              item.open = true
              return item
            }
          })
          gantt.$resourcesStore.attachEvent('onAfterSelect', function (id) {
            gantt.refreshData()
          })
          gantt.$resourcesStore.attachEvent('onParse', function () {
            var people = []
            gantt.$resourcesStore.eachItem(function (res) {
              if (!gantt.$resourcesStore.hasChild(res.id)) {
                var copy = gantt.copy(res)
                copy.key = res.id
                copy.label = res.text
                copy.unit = '%'
                people.push(copy)
              }
            })
            gantt.updateCollection('people', people)
          })
          console.log('resources1', newResources)
          gantt.$resourcesStore.parse(newResources)
        } else {
          console.log('resources2', newResources)
          gantt.$resourcesStore.parse(newResources)
        }
        // gantt.refreshData()
        // ******************************************************************************/
        function endPopup () {
          modal = null
          editLinkId = null
        }
        function cancelEditLink () {
          endPopup()
        }
        function deleteLink () {
          gantt.deleteLink(editLinkId)
          endPopup()
        }
        function saveLink () {
          var link = gantt.getLink(editLinkId)
          var lagValue = modal.querySelector('.lag-input').value
          if (!isNaN(parseInt(lagValue, 10))) {
            link.lag = parseInt(lagValue, 10)
          }
          gantt.updateLink(link.id)
          if (gantt.autoSchedule) {
            gantt.autoSchedule(link.source)
          }
          endPopup()
        }
        var modal
        var editLinkId
        gantt.attachEvent('onLinkDblClick', function (id, e) {
          editLinkId = id
          var link = gantt.getLink(id)
          var linkTitle
          switch (link.type) {
            case gantt.config.links.finish_to_start:
              linkTitle = 'FS'
              break
            case gantt.config.links.finish_to_finish:
              linkTitle = 'FF'
              break
            case gantt.config.links.start_to_start:
              linkTitle = 'SS'
              break
            case gantt.config.links.start_to_finish:
              linkTitle = 'SF'
              break
          }
          linkTitle += ' ' + gantt.getTask(link.source).text + ' -> ' + gantt.getTask(link.target).text
          modal = gantt.modalbox({
            title: linkTitle,
            text: '<div>' +
              `<label>Lag <input type='number' class='lag-input' /></label></div>`,
            buttons: [
              { label: 'Save', css: 'link-save-btn', value: 'save' },
              { label: 'Cancel', css: 'link-cancel-btn', value: 'cancel' },
              { label: 'Delete', css: 'link-delete-btn', value: 'delete' }
            ],
            width: '500px',
            type: 'popup-css-class-here',
            callback: function (result) {
              switch (result) {
                case 'save':
                  saveLink()
                  break
                case 'cancel':
                  cancelEditLink()
                  break
                case 'delete':
                  deleteLink()
                  break
              }
            }
          })
          modal.querySelector('.lag-input').value = link.lag || 0
          // any custom logic here
          return false
        })
      })
      // gantt.autoSchedule()
      // }
      let chTasks = []
      function getChildren (ch, dataForParse) {
        for (let c = 0; c < ch.length; c++) {
          let chTask = ch[c]
          chTasks.push(chTask)
          if (chTask.$custom_data && chTask.$custom_data.Summary === '1') {
            let childs = dataForParse.data.filter(f => f.parent === chTask.id)
            if (childs && childs.length > 0) {
              getChildren(childs, dataForParse)
            }
          }
        }
      }
      if (this.filePrima) {
        // const extension = this.filePrima.name.slice((this.filePrima.name.lastIndexOf('.') - 1 >>> 0) + 2)
        this.$store.dispatch('setLoading', true)
        let allData = gantt.serialize()
        gantt.clearAll()
        let store = this.$store
        gantt.importFromPrimaveraP6({
          server: config.IMPORT_SERVER,
          data: this.filePrima,
          durationUnit: 'hour',
          projectProperties: ['Name', 'Title', 'StartDate', 'FinishDate', 'Assignments', 'Calendar'],
          taskProperties: ['Status', 'ObjectId', 'ProjectTask', 'Executor', 'PercentComplete', 'Type', 'Milestone', 'Summary', 'Critical', 'FreeSlack', 'IsPublished', 'Stop', 'Resume', 'ManualStart', 'ManualFinish',
            'TimephasedData', 'EarlyStart', 'LateStart', 'IsSubproject', 'OutlineLevel', 'RemainingWork', 'TotalSlack', 'Work', 'WBS', 'Start', 'Finish', 'Duration', 'DurationFormat', 'ID', 'ConstraintType', 'ConstraintDate'],
          callback: (project) => {
            if (project) {
              // let rawRes = Array.from(new Set(gantt.serverList('res')))
              // // var iconv = require('iconv-lite')
              // // iconv.skipDecodeWarning = true
              // for (let rr = 0; rr < rawRes.length; rr++) {
              //   rawRes[rr].dep_name = iconv.encode(iconv.decode(rawRes[rr].dep_name, 'cp1251'), 'utf8').toString()
              //   rawRes[rr].fullName = iconv.encode(iconv.decode(rawRes[rr].fullName, 'cp1251'), 'utf8').toString()
              //   rawRes[rr].text = iconv.encode(iconv.decode(rawRes[rr].text, 'cp1251'), 'utf8').toString()
              // }
              // console.log('rawRes', rawRes)
              let resources = []
              for (let i = 0; i < project.resources.length; i++) {
                const res = project.resources[i]
                resources.push({
                  id: res.id,
                  text: iconv.encode(iconv.decode(res.name, 'cp1251'), 'utf8').toString(),
                  fullName: iconv.encode(iconv.decode(res.name, 'cp1251'), 'utf8').toString(),
                  dep_name: iconv.encode(iconv.decode(res.name, 'cp1251'), 'utf8').toString()
                })
              }
              // console.log('res', resources)
              gantt.serverList('res', resources)
              gantt.$resourcesStore.parse(resources)
              // var fileType = null
              if (project.config.$custom_data) {
                var dates = []
                dates.push({ StartDate: project.config.$custom_data.StartDate, FinishDate: project.config.$custom_data.FinishDate })
                gantt.serverList('dates', dates)
                // fileType = project.config.$custom_data.Name
                gantt.config.duration_unit = 'hour'
                // onLoadData(fileType)
                let projectName = iconv.encode(iconv.decode(project.config.$custom_data.Title, 'cp1251'), 'utf8').toString()
                store.dispatch('setPageHeader', projectName)
                // Begin Markers
                var dateToStr = gantt.date.date_to_str(gantt.config.task_date)
                var today = new Date()
                gantt.addMarker({
                  start_date: today,
                  css: 'today',
                  text: 'Сегодня',
                  title: dateToStr(today)
                })
                var projectstart = new Date(project.config.$custom_data.StartDate)
                gantt.addMarker({
                  start_date: projectstart,
                  css: 'status_line',
                  text: 'Старт',
                  title: dateToStr(projectstart)
                })
                var projectEnd = new Date(project.config.$custom_data.FinishDate)
                gantt.addMarker({
                  start_date: projectEnd,
                  css: 'finish',
                  text: 'Завершение',
                  title: dateToStr(projectEnd)
                })
                // End Markers
              }
              // //
              // gantt.config.readonly = false
              // gantt.config.keyboard_navigation = true
              //
              console.log(project)
              //
              //
              let errorTasks = project.data.data.filter(f => !f.start_date || f.start_date === 'null')
              console.log('errorTasks', errorTasks)
              //
              let dataForParse = project.data
              dataForParse.data = dataForParse.data.filter(f => f.start_date && f.start_date !== 'null')
              for (let d = 0; d < dataForParse.data.length; d++) {
                let element = dataForParse.data[d]
                if (element.$custom_data && element.$custom_data.Milestone === '1') {
                  let milestoneStartToString = (new Date(element.start_date)).toISOString().substr(0, 10) + ' 09:00'
                  element.start_date = milestoneStartToString
                  element.start_date1 = milestoneStartToString
                  element.end_date = milestoneStartToString
                  element.end_date1 = milestoneStartToString
                }
                if (element.$custom_data && element.$custom_data.Type === '2') {
                  // let taskStartToString = (new Date(element.start_date).setDate(new Date(element.start_date) + 1)).toISOString().substr(0, 10) + ' 09:00'
                  // let taskEndToString = new Date(new Date(element.start_date).setDate(new Date(element.start_date).getDate() + (Number(element.duration) / 8))).toISOString().substr(0, 10) + ' 18:00'
                  const tempStart = element.start_date
                  element.start_date = String(element.start_date).replace('00:00', '09:00')
                  element.start_date1 = tempStart
                  // element.end_date = taskEndToString
                  // element.end_date1 = taskEndToString
                }
                if (element.$custom_data && element.$custom_data.Summary === '1') {
                  let ch = dataForParse.data.filter(f => f.parent === element.id)
                  if (ch && ch.length > 0) {
                    chTasks = []
                    getChildren(ch, dataForParse)
                  }
                  if (chTasks && chTasks.length > 0 && element.start_date && element.start_date !== 'null') {
                    let minTask = chTasks.sort(function (a, b) {
                      const aa = String(a.start_date).replace('00:00', '09:00')
                      const bb = String(b.start_date).replace('00:00', '09:00')
                      return new Date(aa).getTime() - new Date(bb).getTime()
                    })[0]
                    let maxTask = chTasks.sort(function (a, b) {
                      const aa = String(a.start_date).replace('00:00', '09:00')
                      const bb = String(b.start_date).replace('00:00', '09:00')
                      return new Date(new Date(bb).setDate(new Date(bb).getDate() + (Number(b.duration) / 8))).getTime() - new Date(new Date(aa).setDate(new Date(aa).getDate() + (Number(a.duration) / 8))).getTime()
                    })[0]
                    if (maxTask) {
                      // console.log(start_date, element)
                      let dateStartToString = String(minTask.start_date).replace('00:00', '09:00') // (new Date(minTask.start_date)).toISOString().substr(0, 10) + ' 09:00'
                      element.start_date = dateStartToString
                      element.start_date1 = dateStartToString
                      let newDate = new Date(String(maxTask.start_date).replace('00:00', '18:00'))
                      newDate.setDate(newDate.getDate() + (Number(maxTask.duration) / 8))
                      var dateEndToString = newDate.toISOString().substr(0, 10) + ' 18:00'
                      // var dateEndToString = new Date(new Date(String(maxTask.start_date).replace('00:00', '18:00')).setDate(new Date(String(maxTask.start_date).replace('00:00', '18:00')).getDate() + (Number(maxTask.duration) / 8))).toISOString().substr(0, 10) + ' 18:00'
                      element.end_date = dateEndToString
                      element.end_date1 = dateEndToString
                      element.duration = gantt.calculateDuration(new Date(dateStartToString), new Date(dateEndToString))
                    }
                  }
                }
              }
              //
              //
              console.log('begin parse')
              gantt.parse(dataForParse)
              // gantt.autoSchedule()
              this.$store.dispatch('setLoading', false)
              this.$store.dispatch('setAllTasksCount', dataForParse.data.length)
              this.readyForImport = true
              // recalc()
              // gantt.refreshData()
              // gantt.render()
            } else {
              console.log('nodata')
              gantt.parse(allData)
              this.$store.dispatch('setLoading', false)
              this.readyForImport = false
            }
          }
        })
      }
    }
  }
}
</script>
