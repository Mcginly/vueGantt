<template>
  <v-timeline
    v-if="taskHistory"
    dense
  >
    <v-timeline-item
      v-for="(item, i) in taskHistory"
      :key="i"
      :color="getColor(item)"
      :icon="getIcon(item)"
      right
      small
      fill-dot
    >
      <v-card
        class="elevation-2"
      >
        <v-row dense justify="space-between">
          <v-col cols="7">
            <v-chip
              class="white--text ml-2 mr-2"
              :color="getColor(item)"
              label
              small
            >
              {{ getAction(item) }}
            </v-chip>
            <span class="caption">{{ new Date(item.ActionDate).toLocaleString() }}</span>
          </v-col>
          <v-col class="text-right" cols="5"><span class="mr-2">{{ getAuthor(item) }}</span></v-col>
        </v-row>
        <!-- <v-card-title class="title">{{ item.TypeName }}</v-card-title> -->
        <v-card-text v-if="item.Object !== 'Вопрос'" class="white text--primary">
          {{ comment(item) }}
          <v-divider v-if="additionalInfo(item) && comment(item)" />
          <div v-if="additionalInfo(item) && item.Object !== 'Вопрос'" class="caption">{{ 'Установлен процент выполнения: ' + additionalInfo(item) }}</div>
          <v-divider v-if="item.attach" />
          <div v-if="item.attach" class="caption">
            <a
              :href="`http://wasd/SDK.Action/BinaryFiles/Download/${JSON.parse(item.attach).file}`"
              style="text-decoration: none;"
            >
              <v-icon small>fa fa-paperclip</v-icon>
              {{ `${JSON.parse(item.attach).Name} (${Math.round(JSON.parse(item.attach).FileSize / 1024)} Kb)` }}
            </a>
          </div>
        </v-card-text>
        <v-card-text v-if="item.Object === 'Вопрос'" class="white text--primary">
          <v-treeview
            shaped
            hoverable
            activatable
            open-all
            dense
            open-on-click
            expand-icon="fa fa-angle-down"
            :items="item.items"
          >
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="item.id === 1" small>
                {{ open ? 'fa fa-question-circle' : 'fa fa-question-circle-o' }}
              </v-icon>
              <v-icon v-else small>
                fa fa-bullhorn
              </v-icon>
            </template>
            <template v-slot:label="{ item }">
              <div v-if="item.id === 1">
                <v-row dense>
                  <div v-if="item.ActionObjectId" class="ml-1">
                    <a
                      :href="`http://wasd/Tasks/Question/QuestionExec/${item.ActionObjectId}`"
                      target="_blank"
                      style="text-decoration: none;"
                    >
                      {{ item.name }}
                    </a>
                  </div>
                  <div v-else class="ml-1">
                    {{ item.name }}
                  </div>
                  <v-spacer />
                  <div v-if="item.info" class="caption mr-1">
                    <a
                      :href="`http://wasd/SDK.Action/BinaryFiles/Download/${item.info.file}`"
                      style="text-decoration: none;"
                    >
                      <v-icon small>fa fa-paperclip</v-icon>
                      {{ `${item.info.Name} (${Math.round(item.info.FileSize / 1024)} Kb)` }}
                    </a>
                  </div>
                </v-row>
              </div>
              <div v-else>
                <v-row dense>
                  <v-row dense>
                    <div class="ml-2">{{ item.name }}</div>
                    <div v-if="item.info" class="ml-2 caption">{{ ' (' + new Date(item.info.CreationDate).toLocaleString() + ' - ' + getAuthor(item.info) + ')' }}</div>
                  </v-row>
                  <v-spacer />
                  <div v-if="item.info" class="caption mr-1">
                    <a
                      :href="`http://wasd/SDK.Action/BinaryFiles/Download/${item.info.file}`"
                      style="text-decoration: none;"
                    >
                      <v-icon small>fa fa-paperclip</v-icon>
                      {{ `${item.info.Name} (${Math.round(item.info.FileSize / 1024)} Kb)` }}
                    </a>
                  </div>
                </v-row>
              </div>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
    </v-timeline-item>
    <v-timeline-item
      v-if="isClosedInProject()"
      color="light-green darken-3"
      icon="fa fa-check"
      right
      small
    >
      <v-card
        class="elevation-2"
      >
        <v-row dense justify="space-between">
          <v-col cols="7">
            <v-chip
              class="white--text ml-2 mr-2"
              color="light-green darken-3"
              label
              small
            >
              Задача отмечена выполненной в MS Project
            </v-chip>
            <span class="caption">{{ new Date(selectedTask.EndWorkDate).toLocaleString() }}</span>
          </v-col>
          <v-col class="text-right" cols="5"><span class="mr-2">{{ getTaskAuthor(selectedTask) }}</span></v-col>
        </v-row>
        <v-card-text class="white text--primary">
          <!-- {{ comment(item) }} -->
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ganttTaskHistory',
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters([
      'taskHistory',
      'users',
      'selectedTask'
    ])
  },
  methods: {
    isClosedInProject () {
      // const find = this.taskHistory[this.taskHistory.length - 1]
      const find = this.taskHistory.find(f => f.TypeName === 'complete')
      // console.log('isClosedInProject', find)
      if (!find && find !== undefined) {
      // if (find && find.TypeName !== 'complete' && find.TypeName !== 'controlcomplete' && this.selectedTask.closed === 1) {
        return true
      } else {
        return false
      }
    },
    getColor (item) {
      switch (item.TypeName) {
        case 'create':
          return 'blue-grey darken-1'
        case 'update':
          return 'blue-grey darken-1'
        case 'startwork':
          return 'lime darken-2'
        case 'setpercent':
          return 'teal darken-1'
        case 'startworkpercent':
          return 'lime darken-2'
        case 'complete':
          return 'green lighten-1'
        case 'close':
          return 'red darken-4'
        case 'controlcomplete':
          return 'green lighten-1'
        case 'markread':
          return 'light-blue darken-2'
        case 'reopen':
          return 'deep-orange darken-2'
        case 'questioncreate':
          return 'light-blue darken-4'
        case 'commentcreate':
          return 'cyan darken-3'
        case 'activate':
          return 'pink darken-4'
        default:
          return 'blue-grey darken-1'
      }
    },
    getIcon (item) {
      switch (item.TypeName) {
        case 'create':
          return ''
        case 'update':
          return 'fa fa-refresh'
        case 'startwork':
          return 'fa fa-play-circle'
        case 'setpercent':
          return 'fa fa-percent'
        case 'startworkpercent':
          return 'fa fa-play-circle'
        case 'complete':
          return 'fa fa-check'
        case 'close':
          return 'fa fa-times'
        case 'controlcomplete':
          return 'fa fa-check-circle-o'
        case 'reopen':
          return 'fa fa-undo'
        case 'markread':
          return 'fa fa-dot-circle-o'
        case 'commentcreate':
          return 'fa fa-commenting-o'
        case 'questioncreate':
          return 'fa fa-question'
        case 'questionclosed':
          return 'fa fa-question'
        case 'attachcreate':
          return 'fa fa-paperclip'
        default:
          return ''
      }
    },
    getAction (item) {
      switch (item.TypeName) {
        case 'create':
          return 'Задача создана'
        case 'activate':
          return 'Задача активирована'
        case 'update':
          return 'Задача обновлена'
        case 'startwork':
          return 'Начата работа над задачей'
        case 'setpercent':
          return 'Установлен процент выполнения'
        case 'startworkpercent':
          return 'Начата работа над задачей'
        case 'complete':
          return 'Задача выполнена'
        case 'close':
          return 'Задача закрыта автором'
        case 'controlcomplete':
          return 'Проконтролировано выполнение'
        case 'reopen':
          return 'Задача открыта заново'
        case 'markread':
          return 'Задача прочитана'
        case 'questioncreate':
          return 'Задан вопрос'
        case 'questionclosed':
          return 'Вопрос закрыт'
        case 'answercreate':
          return 'Ответ на вопрос'
        case 'commentcreate':
          return 'Комментарий'
        case 'attachcreate':
          return 'Вложение'
        default:
          return ''
      }
    },
    getTaskAuthor (item) {
      const find = this.users.find(f => Number(f.id) === Number(item.owner_id))
      if (find) {
        return find.shortName
      } else {
        return ''
      }
    },
    getAuthor (item) {
      const find = this.users.find(f => Number(f.id) === Number(item.CreationAuthor))
      if (find) {
        return find.shortName
      } else {
        return ''
      }
    },
    comment (item) {
      if (item.comment) {
        return item.comment
      } else {
        return ''
      }
    },
    additionalInfo (item) {
      const hexStr = item.info
      if (hexStr && item.Object !== 'Вопрос') {
        const buf = Buffer.from(hexStr, 'hex')
        const parsedText = buf.toString('utf8')
        const percentString = parsedText.lastIndexOf('CompletePercent') !== -1 ? parsedText.substring(parsedText.lastIndexOf('CompletePercent'), parsedText.length) : ''
        const percent = percentString.replace(/\D+/g, '')
        return percent
      } else {
        if (item.Object === 'Вопрос') {
          return item.info
        } else {
          return ''
        }
      }
    }
  }
}
</script>
