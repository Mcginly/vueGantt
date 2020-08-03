<template>
<div>
  <v-card flat>
    <h2 style="margin-top: 7px; margin-bottom: 12px;"><img style="width: 16px; height: 16px; margin-right: 5px;" :src="typeIcon()"/>
      <a
        :href="`${selectedTask.url}`"
        target="blank"
        style="text-decoration: none;"
      >
      {{ selectedDialogTask ? selectedDialogTask.text : '' }}
      </a>
    </h2>
  </v-card>
  <v-row>
    <v-col cols="8">
      <v-row dense>
        <v-col cols="3">Срок выполнения: </v-col>
        <v-col cols="6" class="mx-auto mt-auto">с {{ new Date(selectedTask.StartDate).toLocaleDateString() }} по {{ new Date(selectedTask.EndDate).toLocaleDateString() }}</v-col>
        <v-col cols="3" class="mx-auto mt-auto">
          <v-progress-linear
            :value="selectedTask.CompletePercent"
            height="20"
            color="green"
            rounded
          >
          <span class="caption">{{ Math.ceil(selectedTask.CompletePercent) }}%</span>
          </v-progress-linear>
        </v-col>
      </v-row>
      <!-- <v-divider inset></v-divider> -->
      <v-row dense>
        <v-col cols="3">Плановые трудозатраты</v-col>
        <v-col cols="9" class="mx-auto mt-auto">{{ selectedTask.duration }} ч.</v-col>
      </v-row>
      <!-- <v-divider inset></v-divider> -->
      <!-- <v-divider inset></v-divider> -->
      <!-- <v-row dense>
        <v-col cols="3">priority </v-col>
        <v-col cols="9">{{ selectedTask.priority }}</v-col>
      </v-row> -->
      <v-row dense>
        <v-col cols="3">Риски</v-col>
        <v-col cols="9" class="mx-auto mt-auto">selectedTask.RASU_Risks</v-col>
      </v-row>
      <v-row dense>
        <v-col cols="3">Код заказа</v-col>
        <v-col cols="9" class="mx-auto mt-auto">{{ selectedTask.RASU_OrderCode ? selectedTask.RASU_OrderCode : '----' }}</v-col>
      </v-row>
      <v-row dense>
        <v-col cols="3">Система</v-col>
        <v-col cols="9" class="mx-auto mt-auto">{{ selectedTask.RASU_System ? selectedTask.RASU_System : '----' }}</v-col>
      </v-row>
      <v-row dense>
        <v-col cols="3">Стадия проекта</v-col>
        <v-col cols="9" class="mx-auto mt-auto">selectedTask.RASU_Stage_PM</v-col>
      </v-row>
      <v-row dense>
        <v-col cols="3">Описание: </v-col>
        <v-col cols="9" class="mx-auto mt-auto">
          <!-- <v-textarea auto-grow class="caption text--amber text--darken-4" v-model="selectedTask.description" flat readonly outlined dense color="#E0E0E0"></v-textarea> -->
          <v-card
            class="pa-4 mx-auto"
            outlined
          >
            <div class="caption">
            {{selectedTask.description}}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <v-card outlined>
        <v-card-text class="pa-0">

          <v-list-item two-line dense>
            <v-list-item-content>
              <v-list-item-title class="caption grey--text text--darken-1">Автор</v-list-item-title>
              <v-list-item-subtitle class="caption">
                {{ getTaskExecutor(selectedTask.owner_id) }}
              </v-list-item-subtitle>
            </v-list-item-content>
              <v-list-item-avatar
              tile
              size="32"
              >
                <v-avatar size="30px">
                  <img :src="avatar(selectedTask.owner_id)" />
                </v-avatar>
              </v-list-item-avatar>
          </v-list-item>

          <v-list-item two-line v-if="selectedTask.executor_id">
            <v-list-item-content>
              <v-list-item-title class="caption text--light-blue text--darken-4">Исполнитель</v-list-item-title>
              <v-list-item-subtitle>
                {{ getTaskExecutor(selectedTask.executor_id) }}
              </v-list-item-subtitle>
            </v-list-item-content>
              <v-list-item-avatar
              tile
              size="32"
              >
                <v-avatar size="30px">
                  <img :src="avatar(selectedTask.executor_id)" />
                </v-avatar>
              </v-list-item-avatar>
          </v-list-item>

          <v-list-item two-line v-if="selectedTask.UnderControl">
            <v-list-item-content>
              <v-list-item-title class="caption text--light-blue text--darken-4">На контроле</v-list-item-title>
              <v-list-item-subtitle>
                {{ getTaskExecutor(selectedTask.controluser_id) }}
              </v-list-item-subtitle>
            </v-list-item-content>
              <v-list-item-avatar
              tile
              size="32"
              >
                <v-avatar size="30px">
                  <img :src="avatar(selectedTask.controluser_id)" />
                </v-avatar>
              </v-list-item-avatar>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item three-line>
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
                  {{ new Date(selectedTask.CreationDate).toLocaleString() }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="caption py-1 my-1">
                  <!-- <v-list-item-icon>
                    <v-icon dense v-text="status(selectedTask.status)"></v-icon>
                  </v-list-item-icon> -->
                  <img :src="statusIcon(selectedTask.status)"/>
                  {{ status(selectedTask.status) }}
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
      'selectedDialogTask',
      'projects',
      'users'
    ])
  },
  methods: {
    avatar (user) {
      const find = this.users.find(f => Number(f.id) === Number(user))
      if (find) {
        return config.ELMA_API + find.avatar
      } else {
        return `${config.ELMA_API}Content/Images/x120/nophoto_120.gif`
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
    locateTask (task) {
      // eslint-disable-next-line
      gantt.selectTask(task.id)
      // eslint-disable-next-line
      gantt.showTask(task.id)
    },
    typeIcon () {
      switch (this.selectedDialogTask.type) {
        case 'subplan':
          return config.ELMA_API + 'Content/js/icons/subproject.png'
        case 'task':
          return config.ELMA_API + 'Content/js/icons/project-task.png'
        case 'project':
          return config.ELMA_API + 'Content/js/icons/project-task.png'
        case 'milestone':
          return config.ELMA_API + 'Content/js/icons/milestone.png'
        case 'phase':
          return config.ELMA_API + 'Content/js/icons/phase-task.png'
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
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=34387afa-6b70-476f-9d34-748732059003'
        case 'dd048b73-4e08-404a-b62e-c55222845cc4':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=dd048b73-4e08-404a-b62e-c55222845cc4'
        case '1710de4d-86fa-4072-951a-55ebbdcd5bf1':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=1710de4d-86fa-4072-951a-55ebbdcd5bf1'
        case '37a184b8-a81d-4177-9eb5-4ebe3dfae959':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=37a184b8-a81d-4177-9eb5-4ebe3dfae959'
        case 'fd7993c6-99c7-4b23-83cc-0f576a63c144':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=fd7993c6-99c7-4b23-83cc-0f576a63c144'
        case '85707efe-806c-4ec6-8cd6-4d5e4edd8b19':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=85707efe-806c-4ec6-8cd6-4d5e4edd8b19'
        case '112ea757-36f7-4859-b0d3-6cc0f5a04705':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=112ea757-36f7-4859-b0d3-6cc0f5a04705'
        case '46f88008-94cd-4b14-985c-31ba6edeb60e':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=46f88008-94cd-4b14-985c-31ba6edeb60e'
        case '2968382b-e9be-4e2f-967b-0dce0a67a4c4':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=2968382b-e9be-4e2f-967b-0dce0a67a4c4'
        case 'b9c9f74a-15ec-4337-9916-f02ffec83dd4':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=b9c9f74a-15ec-4337-9916-f02ffec83dd4'
        case '1f6de7ff-03af-401a-a3ca-23af7cab8f65':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=1f6de7ff-03af-401a-a3ca-23af7cab8f65'
        case 'b0b6a339-ba74-4e46-b721-2733d7fb76a9':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=b0b6a339-ba74-4e46-b721-2733d7fb76a9'
        case '70918293-8b84-43be-ad39-181375d51373':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=70918293-8b84-43be-ad39-181375d51373'
        case '98ff43bd-b897-41f0-adf2-4eb3b3783851':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=98ff43bd-b897-41f0-adf2-4eb3b3783851'
        case 'b4b74155-53c6-432f-8048-fb9a579349af':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=b4b74155-53c6-432f-8048-fb9a579349af'
        case 'e498da26-0a25-4d99-a053-01dab75db84a':
          return config.ELMA_API + 'SDK.Action/Images/EnumObject/b11d6d0a-f07b-40a3-bc49-2cc5a67fbc81?valueid=e498da26-0a25-4d99-a053-01dab75db84a'
      }
    }
  }
}
</script>
