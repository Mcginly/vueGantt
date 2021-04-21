<template>
<div>
  <v-card flat>
    <h2 style="margin-top: 7px; margin-bottom: 12px;"><img style="width: 16px; height: 16px; margin-right: 5px;" :src="typeIcon()"/>
      <a
        :href="`${server() + selectedDialogTask.url}`"
        target="blank"
        style="text-decoration: none;color: #616161;"
      >
      {{ selectedDialogTask ? selectedDialogTask.text : '' }}
      </a>
    </h2>
  </v-card>
  <v-row dense>
    <v-col cols="8">
      <v-row dense>
        <v-col cols="3" class="caption">Срок выполнения</v-col>
        <v-col cols="6" class="mx-auto text--primary">с {{ new Date(selectedDialogTask.start_date).toLocaleDateString() }} по {{ new Date(selectedDialogTask.end_date).toLocaleDateString() }}<span class="caption text--light-blue text--darken-4 py-1 my-1">{{ tomorrowOrNow(selectedDialogTask.end_date) }}</span></v-col>
        <v-col cols="3" class="mx-auto">
          <v-progress-linear
            :value="Math.ceil(selectedDialogTask.progress * 100)"
            height="16"
            color="green"
            rounded
          >
            <span class="caption">{{ Math.ceil(selectedDialogTask.progress * 100) }}%</span>
          </v-progress-linear>
        </v-col>
      </v-row>
      <v-row dense v-if="selectedDialogTask.EndWorkDate">
        <v-col cols="3" class="caption">Факт выполнения</v-col>
        <v-col cols="9" class="mx-auto text--primary"><span :style="selectedDialogTask.Guilty ? 'color: #F44336;' : ''">с {{ new Date(selectedDialogTask.CreationDate).toLocaleDateString() }} по {{ new Date(selectedDialogTask.EndWorkDate).toLocaleDateString() }}</span></v-col>
      </v-row>
      <!-- <v-divider inset></v-divider> -->
      <v-row dense>
        <v-col cols="3" class="caption">Длительность</v-col>
        <v-col cols="9" class="mx-auto text--primary">{{ selectedDialogTask.duration }} ч.</v-col>
      </v-row>
      <!-- <v-divider inset></v-divider> -->
      <!-- <v-divider inset></v-divider> -->
      <!-- <v-row dense>
        <v-col cols="3">priority </v-col>
        <v-col cols="9">{{ selectedTask.priority }}</v-col>
      </v-row> -->
      <v-row dense>
        <v-col cols="3" class="caption">Риски</v-col>
        <v-col cols="9" class="mx-auto text--primary">
          <v-row
            class="mx-auto text--primary"
            v-for="(item, i) in riskObject(selectedDialogTask.wasd_Risks)"
            :key="i"
          >
            <a :href="`${server()}/Projects/Risk/Edit/${item.Id}`">{{ item.Name }}</a>
          </v-row>
          <!-- {{ riskName(selectedDialogTask.wasd_Risks) }} -->
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="3" class="caption">Код заказа</v-col>
        <v-col cols="9" class="mx-auto text--primary">{{ selectedDialogTask.wasd_OrderCode ? selectedDialogTask.wasd_OrderCode : '-' }}</v-col>
      </v-row>
      <v-row dense>
        <v-col cols="3" class="caption">Система</v-col>
        <v-col cols="9" class="mx-auto text--primary">{{ selectedDialogTask.wasd_System ? selectedDialogTask.wasd_System : '-' }}</v-col>
      </v-row>
      <v-row dense>
        <v-col cols="3" class="caption">Стадия проекта</v-col>
        <v-col cols="9" class="mx-auto text--primary">{{ selectedDialogTask.wasd_Stage_PM ? selectedDialogTask.wasd_Stage_PM : '-' }}</v-col>
      </v-row>
      <v-row dense>
        <v-col cols="3" class="caption">Описание</v-col>
        <v-col cols="9" class="mx-auto">
          <!-- <v-textarea auto-grow class="caption text--amber text--darken-4" v-model="selectedTask.description" flat readonly outlined dense color="#E0E0E0"></v-textarea> -->
          <v-card
            class="pa-4 mx-auto"
            outlined
          >
            <div class="caption text--primary">
              {{ selectedDialogTask.description }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <v-card outlined>
        <v-card-text class="pa-0">

          <v-list-item dense style="background-color: #e3f2fd83;">
            <v-list-item-content>
              <v-list-item-title class="caption grey--text text--darken-1">Исполнители</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- <v-list-item two-line dense>
            <v-list-item-content>
              <v-list-item-title class="caption grey--text text--darken-1">Исполнитель</v-list-item-title>
              <v-list-item-subtitle class="text--primary">
                {{ getTaskExecutor(selectedDialogTask.executor_id) }}
              </v-list-item-subtitle>
            </v-list-item-content>
              <v-list-item-avatar
              tile
              size="32"
              >
                <v-avatar size="30px">
                  <img :src="avatar(selectedDialogTask.executor_id)" />
                </v-avatar>
              </v-list-item-avatar>
          </v-list-item> -->
          <v-list-item dense v-if="selectedDialogTask.mainExecutor" style="background-color: #e3f2fd83;" two-line>
            <v-list-item-content>
              <v-list-item-subtitle class="text--primary">
                <span style="color: #01579B;">{{ getTaskExecutor(selectedDialogTask.mainExecutor) + getUserCapacity(selectedDialogTask.mainExecutor, selectedDialogTask.id) }}</span>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-text="getUserPost(selectedDialogTask.mainExecutor)" />
            </v-list-item-content>
            <v-list-item-action>
              <v-avatar size="30px">
                <img :src="avatar(selectedDialogTask.mainExecutor)" />
              </v-avatar>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="selectedDialogTask.executor_id && getTaskResources(selectedDialogTask).length > 0" />
          <div v-if="selectedDialogTask.Resources">
            <template v-for="(u, index) in getTaskResources(selectedDialogTask)">
              <v-list-item :key="u.id" dense style="background-color: #e3f2fd83;" two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="text--primary">
                    <span :style="Number(u.id) === Number(selectedDialogTask.executor_id) ? 'color: #01579B;' : ''">{{ getTaskExecutor(u.id) + getUserCapacity(u.id, selectedDialogTask.id) }}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-text="getUserPost(u.id)" />
                </v-list-item-content>
                <v-list-item-action>
                  <v-avatar size="30px">
                    <img :src="avatar(u.id)" />
                  </v-avatar>
                </v-list-item-action>
              </v-list-item>
              <v-divider
                v-if="index + 1 < getTaskResources(selectedDialogTask).length"
                :key="index"
              />
            </template>
          </div>
          <div v-else>
            <v-list-item dense style="background-color: #e3f2fd83;">
              <v-list-item-content>
                <v-list-item-subtitle class="text--primary">
                  <span style="color: #D32F2F;">Нет исполнителей</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>

          <v-divider />

          <v-list-item two-line dense style="background-color: #f9fbe77c;">
            <v-list-item-content>
              <v-list-item-title class="caption grey--text text--darken-1">Автор</v-list-item-title>
              <v-list-item-subtitle class="caption">
                {{ getTaskExecutor(selectedDialogTask.owner_id) }}
              </v-list-item-subtitle>
            </v-list-item-content>
              <v-list-item-avatar
              tile
              size="30"
              >
                <v-avatar size="30px">
                  <img :src="avatar(selectedDialogTask.owner_id)" />
                </v-avatar>
              </v-list-item-avatar>
          </v-list-item>

          <v-list-item two-line dense style="background-color: #f9fbe77c;" v-if="selectedDialogTask.controluser_id">
            <v-list-item-content>
              <v-list-item-title class="caption grey--text text--darken-1">На контроле</v-list-item-title>
              <v-list-item-subtitle>
                {{ getTaskExecutor(selectedDialogTask.controluser_id) }}
              </v-list-item-subtitle>
            </v-list-item-content>
              <v-list-item-avatar
              tile
              size="30"
              >
                <v-avatar size="30px">
                  <img :src="avatar(selectedDialogTask.controluser_id)" />
                </v-avatar>
              </v-list-item-avatar>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item three-line dense class="grey lighten-5">
            <v-row>
              <v-col cols="5" style="padding-top: 5px; padding-bottom: 5px; padding-left: 12px;">
                <v-list-item-content >
                  <v-list-item-title class="caption text--light-blue text--darken-4 py-1 my-1">Дата создания</v-list-item-title>
                  <v-list-item-title class="caption text--light-blue text--darken-4 py-1 my-1">Статус</v-list-item-title>
                </v-list-item-content>
              </v-col>
              <v-col cols="6" style="padding-top: 5px; padding-left: 5px; padding-bottom: 5px; padding-right: 5px;">
              <v-list-item-content>
                <v-list-item-subtitle class="caption py-1 my-1">
                  {{ new Date(selectedDialogTask.CreationDate).toLocaleString() }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="caption py-1 my-1">
                  <!-- <v-list-item-icon>
                    <v-icon dense v-text="status(selectedTask.status)"></v-icon>
                  </v-list-item-icon> -->
                  <img :src="statusIcon(selectedDialogTask.status)"/>
                  {{ status(selectedDialogTask.status) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              </v-col>
            </v-row>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-col>
</v-row>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '../../../config/config'

export default {
  name: 'GeneralInfo',
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters([
      'dialogCaption',
      'taskeditform',
      'selectedTask',
      'isMainTask',
      'selectedDialogTask',
      'projects',
      'users',
      'allExecutors'
    ])
  },
  methods: {
    riskObject (val) {
      // console.log('val: ', val)
      if (val) {
        let jsonObject = JSON.parse(val)
        // console.log('jsonObject: ', jsonObject)
        return jsonObject
      } else {
        return null
      }
    },
    server () {
      return 'http://' + window.location.hostname
    },
    avatar (user) {
      const find = this.users.find(f => Number(f.id) === Number(user))
      if (find) {
        // console.log(config.wasd_API + find.avatar)
        return config.wasd_API + find.avatar
      } else {
        // console.log(`${config.wasd_API}Content/Images/x120/nophoto_120.gif`)
        return `${config.wasd_API}Content/Images/x120/nophoto_120.gif`
      }
    },
    getTaskExecutor (user) {
      const find = this.users.find(f => Number(f.id) === Number(user))
      if (find) {
        return find.shortName
      } else {
        return ''
      }
    },
    getTaskResources (task) {
      let returnArr = []
      if (task.Resources) {
        const res = JSON.parse(task.Resources)
        for (let i = 0; i < res.length; i++) {
          const element = res[i]
          if (Number(element.id) !== Number(task.mainExecutor)) {
            returnArr.push(element)
          }
        }
      }
      return returnArr
    },
    tomorrowOrNow (date) {
      let taskDate = new Date(date)
      let now = new Date()
      function diffDates (dayOne, dayTwo) {
        return (dayOne - dayTwo) / (60 * 60 * 24 * 1000)
      }
      let days = Math.round(diffDates(taskDate, now))
      let returnString = days === 0 ? ' (сегодня)' : days === 1 ? ' (завтра)' : ''
      return returnString
    },
    getUserCapacity (user, task) {
      // eslint-disable-next-line
      const resource = gantt.serverList('res').find(f => Number(f.PlanItem) === Number(task) && Number(f.id) === Number(user))
      if (resource) {
        return ` (${100 / 8 * resource.capacity}%)`
      } else {
        return ''
      }
    },
    getUserPost (id) {
      const find = this.users.find(f => Number(f.id) === Number(id))
      // console.log(id, this.users, find)
      if (find) {
        return find.post ?? find.department
      } else {
        return ''
      }
    },
    locateTask (task) {
      // eslint-disable-next-line
      gantt.selectTask(task.id)
      // eslint-disable-next-line
      gantt.showTask(task.id)
    },
    typeIcon () {
      switch (this.selectedDialogTask.type) {
        case 'subplan':
          return config.wasd_API + 'Content/js/icons/subproject.png'
        case 'task':
          return config.wasd_API + 'Content/js/icons/project-task.png'
        case 'project':
          return config.wasd_API + 'Content/js/icons/project-task.png'
        case 'milestone':
          return config.wasd_API + 'Content/js/icons/milestone.png'
        case 'phase':
          return config.wasd_API + 'Content/js/icons/phase-task.png'
      }
    },
    status (status) {
      switch (status.toLowerCase()) {
        case '34387afa-6b70-476f-9d34-748732059003':
          return 'Новая'
        case 'dd048b73-4e08-404a-b62e-c55222845cc4':
          return 'Выполнено'
        case '1710de4d-86fa-4072-951a-55ebbdcd5bf1':
          return 'Невозможно выполнить'
        case '37a184b8-a81d-4177-9eb5-4ebe3dfae959':
          return 'Выполняется'
        case 'fd7993c6-99c7-4b23-83cc-0f576a63c144':
          return 'Закрыто'
        case '85707efe-806c-4ec6-8cd6-4d5e4edd8b19':
          return 'Прочитана '
        case '112ea757-36f7-4859-b0d3-6cc0f5a04705':
          return 'Подготовлено '
        case '46f88008-94cd-4b14-985c-31ba6edeb60e':
          return 'Выполнено и проконтролировано'
        case '2968382b-e9be-4e2f-967b-0dce0a67a4c4':
          return 'Невозможно выполнить и проконтролировано'
        case 'b9c9f74a-15ec-4337-9916-f02ffec83dd4':
          return 'На предварительном согласовании'
        case '1f6de7ff-03af-401a-a3ca-23af7cab8f65':
          return 'Отказано в предварительном согласовании '
        case 'b0b6a339-ba74-4e46-b721-2733d7fb76a9':
          return 'На согласовании'
        case '70918293-8b84-43be-ad39-181375d51373':
          return 'Отказано в согласовании'
        case '98ff43bd-b897-41f0-adf2-4eb3b3783851':
          return 'Не выполнено'
        case 'b4b74155-53c6-432f-8048-fb9a579349af':
          return 'Выполнено, нужен контроль'
        case 'e498da26-0a25-4d99-a053-01dab75db84a':
          return 'Невозможно выполнить, нужен контроль'
      }
    },
    statusIcon (status) {
      switch (status.toLowerCase()) {
        case '34387afa-6b70-476f-9d34-748732059003':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=34387afa-6b70-476f-9d34-748732059003'
        case 'dd048b73-4e08-404a-b62e-c55222845cc4':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=dd048b73-4e08-404a-b62e-c55222845cc4'
        case '1710de4d-86fa-4072-951a-55ebbdcd5bf1':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=1710de4d-86fa-4072-951a-55ebbdcd5bf1'
        case '37a184b8-a81d-4177-9eb5-4ebe3dfae959':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=37a184b8-a81d-4177-9eb5-4ebe3dfae959'
        case 'fd7993c6-99c7-4b23-83cc-0f576a63c144':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=fd7993c6-99c7-4b23-83cc-0f576a63c144'
        case '85707efe-806c-4ec6-8cd6-4d5e4edd8b19':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=85707efe-806c-4ec6-8cd6-4d5e4edd8b19'
        case '112ea757-36f7-4859-b0d3-6cc0f5a04705':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=112ea757-36f7-4859-b0d3-6cc0f5a04705'
        case '46f88008-94cd-4b14-985c-31ba6edeb60e':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=46f88008-94cd-4b14-985c-31ba6edeb60e'
        case '2968382b-e9be-4e2f-967b-0dce0a67a4c4':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=2968382b-e9be-4e2f-967b-0dce0a67a4c4'
        case 'b9c9f74a-15ec-4337-9916-f02ffec83dd4':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=b9c9f74a-15ec-4337-9916-f02ffec83dd4'
        case '1f6de7ff-03af-401a-a3ca-23af7cab8f65':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=1f6de7ff-03af-401a-a3ca-23af7cab8f65'
        case 'b0b6a339-ba74-4e46-b721-2733d7fb76a9':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=b0b6a339-ba74-4e46-b721-2733d7fb76a9'
        case '70918293-8b84-43be-ad39-181375d51373':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=70918293-8b84-43be-ad39-181375d51373'
        case '98ff43bd-b897-41f0-adf2-4eb3b3783851':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=98ff43bd-b897-41f0-adf2-4eb3b3783851'
        case 'b4b74155-53c6-432f-8048-fb9a579349af':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=b4b74155-53c6-432f-8048-fb9a579349af'
        case 'e498da26-0a25-4d99-a053-01dab75db84a':
          return config.wasd_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=e498da26-0a25-4d99-a053-01dab75db84a'
      }
    }
  }
}
</script>
