<template>
  <v-list-item two-line dense>
    <v-list-item-content>
      <v-list-item-subtitle>
        <v-divider />
      </v-list-item-subtitle>
      <v-list-item-title>
        <v-row dense class="ml-2 mr-1">
          <v-menu
            v-model="menu"
            transition="slide-x-transition"
            :close-on-content-click="false"
            :nudge-width="200"
            rounded="r-xl"
            offset-x
          >
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    small
                    icon
                    rounded
                    depressed
                    class="mx-0"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                    :style="{ backgroundColor : (execDateFrom || execDateTo) ? '#90CAF9 !important' : '' }"
                  >
                    <v-icon small>fa fa-calendar</v-icon>
                  </v-btn>
                </template>
                <span>Срок задачи</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-list dense>
                <!-- <v-row dense> -->
                  <v-list-item dense>
                    <v-list-item-content>
                      <v-dialog
                        ref="dialog"
                        v-model="modal"
                        width="290px"
                        :retain-focus="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="execDateFrom"
                            label="с"
                            prepend-icon="fa-calendar"
                            readonly
                            dense
                            v-bind="attrs"
                            v-on="on"
                            clearable
                            @click:clear="execDateFrom = null"
                            @change="applyFilter()"
                          />
                        </template>
                        <v-date-picker
                          v-model="execDateFrom"
                          scrollable
                          @input="modal = false"
                          @change="applyFilter()"
                        />
                      </v-dialog>
                    </v-list-item-content>
                  </v-list-item>
                <!-- </v-row> -->
                <!-- <v-row dense> -->
                  <v-list-item dense>
                    <v-list-item-content>
                      <v-dialog
                        ref="dialog"
                        v-model="modal2"
                        width="290px"
                        :retain-focus="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="execDateTo"
                            label="по"
                            prepend-icon="fa-calendar"
                            readonly
                            dense
                            v-bind="attrs"
                            v-on="on"
                            clearable
                            @click:clear="execDateTo = null"
                            @change="applyFilter()"
                          >
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="execDateTo"
                          scrollable
                          @input="modal2 = false"
                          @change="applyFilter()"
                        >
                        </v-date-picker>
                      </v-dialog>
                    </v-list-item-content>
                  </v-list-item>
                <!-- </v-row> -->
              </v-list>
            </v-card>
          </v-menu>
          <v-menu
            v-model="menu2"
            transition="slide-x-transition"
            :close-on-content-click="false"
            :nudge-width="200"
            rounded="r-xl"
            offset-x
          >
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    small
                    icon

                    rounded
                    class="mx-0"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                    :style="{ backgroundColor : authorUser && authorUser.length > 0 ? '#90CAF9 !important' : '' }"
                  >
                    <v-icon small>fa fa-user-secret</v-icon>
                  </v-btn>
                </template>
                <span>Авторы</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-list dense>
                <v-list-item dense>
                  <v-autocomplete
                    :items="allAuthors"
                    item-text="fullName"
                    item-value="id"
                    return-object
                    v-model="authorUser"
                    label="ФИО"
                    clearable
                    @click:clear="authorUser = null"
                    dense
                    multiple
                    no-data-text="нет данных"
                    @change="applyFilter()"
                  >
                    <v-icon small slot="prepend" :color="authorUser ? (authorUser.Status === 1 ? 'red' : 'green') : 'green'">fas fa-user</v-icon>
                    <!-- <template v-slot:item="data">
                      <v-list dense color="green">
                        <v-list-item-avatar>
                          <img :src="data.item.avatar">
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-html="data.item.fullName"></v-list-item-title>
                          <v-list-item-subtitle v-html="data.item.department"></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list>
                    </template> -->
                  </v-autocomplete>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-menu
            v-model="menu3"
            transition="slide-x-transition"
            :close-on-content-click="false"
            :nudge-width="200"
            rounded="r-xl"
            offset-x
          >
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    small
                    icon
                    rounded
                    depressed
                    class="mx-0"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                    :style="{ backgroundColor : executUser && executUser.length > 0 ? '#90CAF9 !important' : '' }"
                  >
                    <v-icon small>fa fa-users</v-icon>
                  </v-btn>
                </template>
                <span>Исполнители</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-list dense>
                <v-list-item dense>
                  <v-autocomplete
                    :items="allExecutors"
                    item-text="fullName"
                    item-value="id"
                    return-object
                    v-model="executUser"
                    label="ФИО"
                    clearable
                    dense
                    @click:clear="executUser = null"
                    multiple
                    full-width
                    no-data-text="нет данных"
                    @change="applyFilter()"
                  >
                    <v-icon small slot="prepend" :color="executUser ? (executUser.Status === 1 ? 'red' : 'green') : 'green'">fas fa-user</v-icon>
                  </v-autocomplete>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-menu
            v-model="menu4"
            transition="slide-x-transition"
            :close-on-content-click="false"
            :nudge-width="200"
            min-width="500"
            rounded="r-xl"
            offset-x
          >
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    small
                    icon
                    rounded
                    depressed
                    class="mx-0"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                    :style="{ backgroundColor : (progress[0] || progress[1]) ? '#90CAF9 !important' : '' }"
                  >
                    <v-icon small>fa fa-percent</v-icon>
                  </v-btn>
                </template>
                <span>Процент выполнения</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-card-text>
                <v-row dense>
                  <v-col class="px-4">
                    <v-range-slider
                      dense
                      v-model="progress"
                      :max="max"
                      :min="min"
                      hide-details
                      class="align-center"
                      @change="applyFilter()"
                    >
                      <template v-slot:prepend>
                        <span>{{ progress[0] }}</span>
                      </template>
                      <template v-slot:append>
                        <span>{{ progress[1] }}</span>
                      </template>
                    </v-range-slider>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>
          <v-menu
            v-model="menu5"
            transition="slide-x-transition"
            :close-on-content-click="false"
            :nudge-width="200"
            rounded="r-xl"
            offset-x
            >
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom open-delay="500">
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      id="status"
                      small
                      icon
                      rounded
                      depressed
                      class="mx-0"
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                      :style="{ backgroundColor : (overdue || completed || execution) ? '#90CAF9 !important' : '' }"
                    >
                      <v-icon small>fa fa-check-square</v-icon>
                    </v-btn>
                  </template>
                  <span>Статус</span>
                </v-tooltip>
              </template>
              <v-card>
                <v-list dense>
                  <v-list-item dense>
                    <v-col class="caption">
                      <v-checkbox
                        id="overdue"
                        dense
                        v-model="overdue"
                        label="Просроченные"
                        hide-details
                        @change="applyFilter()"
                      ></v-checkbox>
                      <v-checkbox
                        id="completed"
                        dense
                        v-model="completed"
                        label="Выполненные"
                        hide-details
                        @change="applyFilter()"
                      ></v-checkbox>
                      <v-checkbox
                        id="execution"
                        dense
                        v-model="execution"
                        label="На выполнении"
                        hide-details
                        @change="applyFilter()"
                      ></v-checkbox>
                    </v-col>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <!--  -->
            <v-menu

              v-model="menu11"
              transition="slide-x-transition"
              :close-on-content-click="false"
              rounded="r-xl"
              offset-y
            >
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom open-delay="500">
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      id="perk"
                      small
                      icon
                      rounded
                      depressed
                      class="mx-0"
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                      :style="{ backgroundColor : (allPerks || reqPerk || reassingPerk || riskPerk || zniPerk) ? '#90CAF9 !important' : '' }"
                    >
                      <v-icon small>fas fa-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>Признаки</span>
                </v-tooltip>
              </template>
              <v-list class="px-2 pa-0">
                <v-list-item >
                    <v-checkbox
                      id="all"
                      dense
                      v-model="allPerks"
                      label="Все"
                      hide-details
                      @change="allPerkApply()"
                    ></v-checkbox>
                  </v-list-item>
                  <v-list-item >
                    <v-checkbox
                      id="req"
                      dense
                      v-model="reqPerk"
                      label="Есть обязательство"
                      hide-details
                      @change="applyFilter()"
                    ></v-checkbox>
                  </v-list-item>
                  <v-list-item >
                    <v-checkbox
                      id="risk"
                      dense
                      v-model="riskPerk"
                      label="Есть риски"
                      hide-details
                      @change="applyFilter()"
                    ></v-checkbox>
                  </v-list-item>
                  <v-list-item >
                    <v-checkbox
                      class="mb-2"
                      id="reassing"
                      dense
                      v-model="reassingPerk"
                      label="Есть переназначение"
                      hide-details
                      @change="applyFilter()"
                    ></v-checkbox>
                  </v-list-item>
                  <!-- class="px-2 pa-0" -->
                  <v-list-item >
                    <v-checkbox
                      class="mb-2"
                      id="zni"
                      dense
                      v-model="zniPerk"
                      label="Есть ЗнИ"
                      hide-details
                      @change="applyFilter()"
                    ></v-checkbox>
                  </v-list-item>
              </v-list>
            </v-menu>
            <!--  -->
            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed
                  class="mx-0"
                  v-bind="attrs"
                  v-on="on"
                  :style="{ backgroundColor: (milestone) ? '#90CAF9 !important' : '' }"
                  @click="isKS()"
                >
                  <v-icon small>fa fa-map-pin</v-icon>
                </v-btn>
              </template>
              <span>Показать только контрольные точки</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed
                  class="mx-0"
                  v-bind="attrs"
                  v-on="on"
                  :style="{ backgroundColor: (noexecutor) ? '#90CAF9 !important' : '' }"
                  @click="noExecutor()"
                >
                  <v-icon small>fa fa-user-times</v-icon>
                </v-btn>
              </template>
              <span>Без исполнителя</span>
            </v-tooltip>
            <v-divider vertical class="ml-2 mr-2" />
            <v-menu
              v-model="menu8"
              :close-on-content-click="false"
              transition="slide-y-transition"
              offset-y
            >
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      small
                      icon
                      rounded
                      depressed
                      class="mx-0"
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                      :style="{ backgroundColor : (level) ? '#90CAF9 !important' : '' }"
                    >
                      <v-icon small>fa fa-list-ol</v-icon>
                    </v-btn>
                  </template>
                  <span>Сверачивание\Разворачивание задач плана проекта до выбранного уровня вложенности</span>
                </v-tooltip>
              </template>
              <v-list dense>
                <v-list-item
                  dense
                  v-for="(item, i) in levels"
                  :key="i"
                  @click="expandcollapseTasksByLevel(item)"
                >
                  <v-list-item-title
                  >{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed
                  class="mx-0"
                  v-bind="attrs"
                  v-on="on"
                  :style="{ backgroundColor: (toggle) ? '#90CAF9 !important' : '' }"
                  @click="expandAllTasks()"
                >
                  <v-icon small>{{ toggle ? 'fa-expand' : 'fa-compress'}}</v-icon>
                </v-btn>
              </template>
              <span>{{ toggle ? 'Развернуть все' : 'Свернуть все' }}</span>
            </v-tooltip>
            <v-divider vertical class="ml-2 mr-2" />
            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed :style="{ backgroundColor : criticalPath ? '#FFCDD2 !important' : '' }"
                  class="mx-0"
                  v-bind="attrs"
                  v-on="on"
                  @click="showCritical()"
                >
                  <v-icon small>fa fa-fire</v-icon>
                </v-btn>
              </template>
              <span>Критический путь</span>
            </v-tooltip>
            <v-divider v-if="isGap" vertical class="ml-2 mr-2" />
            <v-tooltip v-if="isGap" bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  :style="'#FFCDD2 !important'"
                  class="mx-0"
                  v-bind="attrs"
                  v-on="on"
                  @click="dialogGap = true"
                >
                  <v-icon small color="#CDDC39">fas fa-exclamation-circle</v-icon>
                </v-btn>
              </template>
              <span>Ошибки в импортируемом файле</span>
            </v-tooltip>
            <v-spacer />

            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed
                  class="mx-0"
                  :disabled="zoomLevel == 8"
                  v-bind="attrs"
                  v-on="on"
                  @click="zoomOut()"
                >
                  <v-icon small>fa fa-search-plus</v-icon>
                </v-btn>
              </template>
              <span>Увеличить</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed
                  class="mx-0"
                  :disabled="zoomLevel == 0"
                  v-bind="attrs"
                  v-on="on"
                  @click="zoomIn()"
                >
                  <v-icon small>fa fa-search-minus</v-icon>
                </v-btn>
              </template>
              <span>Уменьшить</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed
                  class="mx-0"
                  :disabled="zoomLevel == 0"
                  v-bind="attrs"
                  v-on="on"
                  @click="fitAllTasks()"
                >
                  <v-icon small>fa fa-arrows-alt</v-icon>
                </v-btn>
              </template>
              <span>Вписать в видимую область</span>
            </v-tooltip>
            <!-- <v-btn icon small depressed :style="{ backgroundColor: btnChartIconColor }" @click="toggleChart()">
              <v-icon class="mx-1" small>fa fa-line-chart</v-icon>
            </v-btn> -->
            <!-- <v-divider vertical class="ml-2 mr-2" /> -->
            <v-divider vertical class="ml-2 mr-2" />
            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed
                  class="mx-0"
                  :style="{ backgroundColor: (onlyGrid) ? '#90CAF9 !important' : '' }"
                  v-bind="attrs"
                  v-on="on"
                  @click="toggleGridView()"
                >
                  <v-icon small>{{ !onlyGrid ? 'fa fa-table' : 'fa fa-tasks' }}</v-icon>
                </v-btn>
              </template>
              <span>{{ !onlyGrid ? 'Только таблица' : 'Таблица и Гантт' }}</span>
            </v-tooltip>
            <v-divider vertical class="ml-2 mr-2" />
            <v-tooltip bottom open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  rounded
                  depressed
                  class="mx-0"
                  v-bind="attrs"
                  v-on="on"
                  @click="drawerRight = !drawerRight"
                >
                  <v-icon small>{{ !drawerRight ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right' }}</v-icon>
                </v-btn>
              </template>
              <span>Дополнительно</span>
            </v-tooltip>
            <!-- saveToMongo -->
            <!-- <v-divider vertical class="ml-2 mr-2" />
            <v-btn icon small @click="saveToMongo()">
              <v-icon class="mx-1" small>fa fa-tasks</v-icon>
            </v-btn> -->
            <!-- <v-divider vertical class="ml-2 mr-2" />
            <v-file-input
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
        </v-row>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex'
// import ganttinitial from './ganttinitial'
import { gantt } from 'dhtmlx-gantt'
import { mapFields } from 'vuex-map-fields'
import utils from '../../config/utils'
// eslint-disable-next-line
import * as exportToPdf from '../../config/exportToPdf'
import chartOverlay from '../../plugins/overlayChart'

export default {
  name: 'ganttTopMenu',
  data: () => ({
    // file: null,
    buttomsColor: {
      date: false,
      author: false,
      executor: false,
      percent: false,
      status: false,
      milesone: false,
      noexecutor: false
    },
    highlightTasksProp: false,
    min: 0,
    max: 100,
    menuStart: null,
    menuEnd: null,
    selectedPeriod: null,
    datePeriod: {
      start: null,
      end: null
    },
    date: new Date().toISOString().substr(0, 7),
    menu: false,
    menu2: false,
    menu3: false,
    menu4: false,
    menu5: false,
    menu6: false,
    menu7: false,
    menu8: false,
    menu9: false,
    menu10: false,
    menu11: false,
    modal: false,
    modal2: false,
    optionslevel: null,
    toggle: false,
    marker: false,
    showChart: false,
    btnChartText: 'Показать отклонения',
    btnChartIconColor: '',
    zoomLevel: null,
    overlays: []
  }),
  computed: {
    ...mapGetters([
      // 'showToolbar',
      'users',
      'allAuthors',
      'allExecutors',
      'ganttLayoutTasks',
      'ganttLayoutResource',
      'ganttLayoutOnlyGrid',
      'viewResource',
      'isGap'
      // 'levels',
      // 'level'
    ]),
    ...mapFields([
      'selectedTaskId',
      'criticalPath',
      'drawerRight',
      'onlyGrid',
      'dialogGap'
    ]),
    allPerks: {
      get () {
        return this.$store.getters.allPerks
      },
      set (value) {
        this.$store.dispatch('setAllPerks', value)
      }
    },
    reqPerk: {
      get () {
        return this.$store.getters.reqPerk
      },
      set (value) {
        this.$store.dispatch('setReqPerk', value)
      }
    },
    riskPerk: {
      get () {
        return this.$store.getters.riskPerk
      },
      set (value) {
        this.$store.dispatch('setRiskPerk', value)
      }
    },
    reassingPerk: {
      get () {
        return this.$store.getters.reassingPerk
      },
      set (value) {
        this.$store.dispatch('setReassingPerk', value)
      }
    },
    zniPerk: {
      get () {
        return this.$store.getters.zniPerk
      },
      set (value) {
        this.$store.dispatch('setZniPerk', value)
      }
    },
    executUser: {
      get () {
        return this.$store.getters.executUser
      },
      set (value) {
        this.$store.dispatch('setExecutUser', value)
      }
    },
    authorUser: {
      get () {
        return this.$store.getters.authorUser
      },
      set (value) {
        this.$store.dispatch('setAuthorUser', value)
      }
    },
    overdue: {
      get () {
        return this.$store.getters.overdue
      },
      set (value) {
        this.$store.dispatch('setOverdue', value)
      }
    },
    completed: {
      get () {
        return this.$store.getters.completed
      },
      set (value) {
        this.$store.dispatch('setCompleted', value)
      }
    },
    execution: {
      get () {
        return this.$store.getters.execution
      },
      set (value) {
        this.$store.dispatch('setExecution', value)
      }
    },
    execDateFrom: {
      get () {
        return this.$store.getters.execDateFrom
      },
      set (value) {
        this.$store.dispatch('setExecDateFrom', value)
      }
    },
    execDateTo: {
      get () {
        return this.$store.getters.execDateTo
      },
      set (value) {
        this.$store.dispatch('setExecDateTo', value)
      }
    },
    milestone: {
      get () {
        return this.$store.getters.milestone
      },
      set (value) {
        this.$store.dispatch('setMilestone', value)
      }
    },
    progress: {
      get () {
        return this.$store.getters.progress
      },
      set (value) {
        this.$store.dispatch('setProgress', value)
      }
    },
    noexecutor: {
      get () {
        return this.$store.getters.noexecutor
      },
      set (value) {
        this.$store.dispatch('setNoexecutor', value)
      }
    },
    levels: {
      get () {
        return this.$store.getters.levels
      },
      set (value) {
        this.$store.dispatch('setLevels', value)
      }
    },
    level: {
      get () {
        return this.$store.getters.level
      },
      set (value) {
        this.$store.dispatch('setLevel', value)
      }
    }
  },
  methods: {
    allPerkApply () {
      this.reqPerk = this.allPerks
      this.riskPerk = this.allPerks
      this.reassingPerk = this.allPerks
      this.zniPerk = this.allPerks
      gantt.render()
    },
    toggleChart () {
      this.showChart = !this.showChart
      let overlayControl = gantt.ext.overlay
      if (!this.showChart) {
        this.btnChartText = 'Показать отклонения'
        this.btnChartIconColor = ''
        gantt.ext.overlay.hideOverlay(this.overlays[0])
        gantt.ext.overlay.deleteOverlay(this.overlays[0])
        // console.log('hide', gantt.ext.overlay.getOverlaysIds())
        // overlayControl.hideOverlay(chartOverlay.lineOverlay(overlayControl))
        gantt.render()
        gantt.$root.classList.remove('overlay_visible')
      } else {
        this.btnChartText = 'Скрыть отклонения'
        this.btnChartIconColor = '#90CAF9 !important'
        overlayControl.showOverlay(chartOverlay.lineOverlay(overlayControl))
        this.overlays = gantt.ext.overlay.getOverlaysIds()
        // console.log('show', this.overlays)
        gantt.render()
        gantt.$root.classList.add('overlay_visible')
      }
    },
    toggleGridView () {
      this.onlyGrid = !this.onlyGrid
      if (this.onlyGrid) {
        if (this.viewResource) {
          gantt.config.show_chart = false
          gantt.render()
          gantt.config.layout = this.ganttLayoutResource
          gantt.resetLayout()
        } else {
          gantt.config.show_chart = false
          gantt.render()
          // gantt.config.layout = this.ganttLayoutTasks
          // gantt.resetLayout()
        }
        // gantt.config.layout = this.ganttLayoutOnlyGrid
        // gantt.resetLayout()
      } else {
        if (this.viewResource) {
          gantt.config.show_chart = true
          gantt.render()
          gantt.config.layout = this.ganttLayoutResource
          gantt.resetLayout()
        } else {
          gantt.config.show_chart = true
          gantt.render()
          // gantt.config.layout = this.ganttLayoutTasks
          // gantt.resetLayout()
        }
      }
    },
    zoomIn () {
      gantt.ext.zoom.zoomIn()
      this.zoomLevel = gantt.ext.zoom.getCurrentLevel()
      console.log(this.allAuthors)
    },
    zoomOut () {
      gantt.ext.zoom.zoomOut()
      this.zoomLevel = gantt.ext.zoom.getCurrentLevel()
      // console.log(this.zoomLevel)
    },
    showCritical () {
      this.criticalPath = !this.criticalPath
      gantt.config.highlight_critical_path = this.criticalPath
      gantt.render()
    },
    fitAllTasks () {
      gantt.ext.zoom.setLevel('year')
      this.zoomLevel = gantt.ext.zoom.getCurrentLevel()
    },
    async saveToMongo () {
      const tasks = gantt.getTaskByTime()
      const links = gantt.getLinks()
      const resources = gantt.serverList('res')
      const obj = { tasks, links, resources }
      // let obj = []
      // obj.push({ tasks: tasks, links: links, resources: resources })
      // console.log(obj)
      const response = await utils.insertGanttPlan(obj)
      console.log(response.data)
      const getInserted = await utils.getGanttPlan(response.data)
      console.log(getInserted.data)
    },
    // toggleToolbar () {
    //   this.$store.dispatch('setShowToolbar', !this.showToolbar)
    // }
    markerTasks () {
      // console.log(this.overdue)
      gantt.templates.task_class = function (start, end, task) {
        // console.log(this.overdue)
        if (this.overdue) {
          return 'task_groups'
        } else {
          if (task.type === gantt.config.types.phase) {
            return 'phase_task'
          } else {
            if (task.type === gantt.config.types.subplan) {
              return 'subplan_task'
            } else {
              if (task.type === gantt.config.types.project) {
                return 'hide_project_progress_drag'
              } else {
                return ''
              }
            }
          }
        }
      }
    },
    method_1: function (ev, i) {
      // console.log(ev)
      // console.log(i)
    },
    isKS () {
      this.milestone = !this.milestone
      this.$nextTick(() => {
        this.applyFilter()
      })
    },
    noExecutor () {
      this.noexecutor = !this.noexecutor
      this.$nextTick(() => {
        this.applyFilter()
      })
    },
    applyFilter () {
      gantt.render()
    },
    clearData () {
      this.$store.dispatch('setExecDateFrom', null)
      this.$store.dispatch('setExecDateTo', null)
    },
    expandcollapseTasksByLevel (i) {
      var val = i - 1
      // console.log('expandTasksByLevel: ' + val)
      // console.log('expandTasksByLevel2: ' + this.$store.getters.level)
      // console.log('expandTasksByLevel3: ' + level)
      gantt.eachTask(function (task) {
        var level = gantt.calculateTaskLevel(task)
        var types = gantt.config.types
        if (val === 0) {
          task.$open = false
        } else {
          if (task.type === types.subplan) {
            task.$open = false
          } else {
            switch (level) {
              case val:
                task.$open = false
                // console.log('task.$open = false')
                break
              default:
                // console.log('level: ' + level + ' val: ' + val)
                if (level >= val) {
                  task.$open = false
                  // console.log('task.$open = false')
                } else {
                  task.$open = true
                  // console.log('task.$open = true')
                }
                break
            }
          }
        }
      })
      // console.log('beforeRenderInMethod')
      gantt.render()
      // if (this.options.saveTaskPosition) {
      //   var selected = gantt.getSelectedId()
      //   if(selected) gantt.showTask(selected)
      // }
    },
    expandAllTasks () {
      var toggle = this.toggle
      // console.log('1 ' + toggle)
      var types = gantt.config.types
      gantt.eachTask(function (task) {
        switch (task.type) {
          case types.subplan:
            task.$open = false
            break
          default:
            task.$open = toggle
            break
        }
      })
      gantt.render()
      this.toggle = !toggle
      // console.log('2 ' + toggle)
    },
    showPredictLine () {
      var toggle = !this.togglePredict
      if (toggle) {
        gantt.config.task_height = 11
        gantt.$root.classList.add('visible_baselines')
        this.taskLayer = gantt.addTaskLayer(function drawPlanned (task) {
          // console.log('baseline_toggle: ', toggle)
          // console.log('SHOW')
          if (task.predictDates[0] && task.predictDates[1]) {
            var sizes = gantt.getTaskPosition(task, task.predictDates[0], task.predictDates[1])
            var el = document.createElement('div')
            el.className = 'baseline'
            el.style.left = sizes.left + 'px'
            el.style.width = sizes.width + 'px'
            el.style.top = sizes.top + gantt.config.task_height + 13 + 'px'
            return el
          }
          return false
        })
        gantt.templates.task_class = function (start, end, task) {
          // console.log('task_class')
          return 'gantt_side_content2'
          // , 'gantt_side_content.gantt_right2'
        }
        gantt.templates.link_class = function (link) {
          // console.log('link_class')
          return 'gantt_task_line2'
          // , 'gantt_line_wrapper2', 'gantt_task_link gantt_link_arrow2'
        }
      } else {
        gantt.templates.task_class = function (start, end, task) {
          // console.log('task_class')
          return 'gantt_side_content'
          // , 'gantt_side_content.gantt_right'
        }
        gantt.templates.link_class = function (link) {
          // console.log('link_class')
          return 'gantt_task_line'
          // , 'gantt_line_wrapper', 'gantt_task_link gantt_link_arrow'
        }
        gantt.config.task_height = 19
        gantt.$root.classList.remove('visible_baselines')
        gantt.removeTaskLayer(this.taskLayer)
      }
      gantt.render()
      this.togglePredict = toggle
    }
  }
}
</script>

<style lang="css" scoped>
.gantt_task_line, .gantt_line_wrapper {
  margin-top: -4px !important;
}

.gantt_side_content {
  margin-bottom: 7px !important;
}

.gantt_task_link .gantt_link_arrow {
  margin-top: -4px !important;
}

.gantt_side_content.gantt_right {
  bottom: 0 !important;
}
</style>
