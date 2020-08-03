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
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  rounded
                  color="indigo"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Срок задачи
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="С"
                          prepend-icon="fa-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="По"
                          prepend-icon="fa-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-list-item>
                  <v-list-item>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  rounded
                  color="indigo"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Авторы
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-autocomplete
                      :items="users"
                      item-text="fullName"
                      item-value="id"
                      return-object
                      v-model="authorUser"
                      label="ФИО"
                      clearable
                      dense
                      multiple
                      full-width
                      no-data-text="нет данных"
                      :item-color="authorUser ? (authorUser.Status === 1 ? 'red' : 'primary') : 'primary'"
                      :error="authorUser ? (authorUser.Status === 1 ? true : false) : false"
                      :error-messages="authorUser ? (authorUser.Status === 1 ? 'пользователь заблокирован' : []) : []"
                      :hint="authorUser ? (authorUser.Status === 1 ? '' : authorUser.DepartmentName) : ''"
                    >
                      <v-icon slot="prepend" :color="authorUser ? (authorUser.Status === 1 ? 'red' : 'green') : 'green'">fas fa-user</v-icon>
                    </v-autocomplete>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-menu
              v-model="menu3"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  rounded
                  color="indigo"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Исполнители
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-autocomplete
                      :items="users"
                      item-text="fullName"
                      item-value="id"
                      return-object
                      v-model="executUser"
                      label="ФИО"
                      clearable
                      dense
                      multiple
                      full-width
                      no-data-text="нет данных"
                      :item-color="executUser ? (executUser.Status === 1 ? 'red' : 'primary') : 'primary'"
                      :error="executUser ? (executUser.Status === 1 ? true : false) : false"
                      :error-messages="executUser ? (executUser.Status === 1 ? 'пользователь заблокирован' : []) : []"
                      :hint="executUser ? (executUser.Status === 1 ? '' : executUser.DepartmentName) : ''"
                    >
                      <v-icon slot="prepend" :color="executUser ? (executUser.Status === 1 ? 'red' : 'green') : 'green'">fas fa-user</v-icon>
                    </v-autocomplete>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-menu
              v-model="menu4"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  rounded
                  color="indigo"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  % выполнения
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-menu
              v-model="menu5"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  id="status"
                  small
                  rounded
                  color="indigo"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Статус
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-col class="caption">
                      <v-checkbox
                        id="overdue"
                        dense
                        v-model="overdue"
                        label="Просроченные"
                        hide-details
                      ></v-checkbox>
                      <v-checkbox
                        id="completed"
                        dense
                        v-model="completed"
                        label="Выполненные"
                        hide-details
                        @change="sortTest()"
                      ></v-checkbox>
                      <v-checkbox
                        id="execution"
                        dense
                        v-model="execution"
                        label="На выполнении"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-menu
              v-model="menu6"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  rounded
                  color="indigo"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  КС
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-menu
              v-model="menu7"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  rounded
                  color="indigo"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Без исполнителя
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-btn icon small>
              <v-icon class="mx-1" small>fa fa-fire</v-icon>
            </v-btn>
            <v-btn icon small>
              <v-icon class="mx-1" small>fa fa-fire</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn icon small>
              <v-icon class="mx-1" small>fa fa-angle-double-up</v-icon>
            </v-btn>
          </v-row>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex'
import { gantt } from 'dhtmlx-gantt'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'ganttTopMenu',
  data: () => ({
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
    modal: false,
    modal2: false

  }),
  computed: {
    ...mapGetters([
      'showToolbar',
      'users'
    ]),
    ...mapFields([
      'selectedTaskId'
    ]),
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
    }
  },
  methods: {
    // toggleToolbar () {
    //   this.$store.dispatch('setShowToolbar', !this.showToolbar)
    // }
    sortTest () {
      let completed = this.$store.getters.completed
      //console.log(completed)
      
      // gantt.attachEvent('onBeforeTaskDisplay', function (id, task) {
      //   // console.log(task)
      //   // if (completed === false) {
      //   //   if (task.CompletePercent !== '' ) {
      //   //     // console.log('sortTest-filter-no')
      //   //     // console.log(task)
            
      //   //     return true
      //   //   }
      //   // }
      //   if (completed === true) {
      //     // console.log(task.CompletePercent)
      //     if (task.CompletePercent === '100') {
      //       // console.log('sortTest-filter-yes')
      //       return true
      //     }
      //   }

      //   return false
      // })
      // gantt.refreshData()
      gantt.render()
    }
  }
}
</script>
