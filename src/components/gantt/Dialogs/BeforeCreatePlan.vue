<template>
  <div class="text-center">
    <v-dialog
      v-model="dialogBeforeCreate"
      width="700"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Сохранить плана проекта
        </v-card-title>
        <v-card-text>
          <v-checkbox
            v-model="splitTasks"
            label="Разделять и создавать задачи по количеству исполнителей"
            color="success"
            value="success"
            hide-details
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="wasdmedium"
            dark
            text
            @click="beginCreate()"
          >
            Далее
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import createPlanItems from '../../../plugins/createPlanItems'

export default {
  name: 'beforeCreatePlan',
  data: () => ({
    splitTasks: false
  }),
  computed: {
    // ...mapGetters([
    //   'dialogBeforeCreate'
    // ]),
    ...mapFields([
      'dialogBeforeCreate',
      'loading',
      'project'
    ])
  },
  methods: {
    async beginCreate () {
      this.dialogBeforeCreate = false
      this.loading = true
      // eslint-disable-next-line
      var links = gantt.serialize().links
      // eslint-disable-next-line
      var tasks = gantt.getTaskByTime()
      // createPlanItems.beginImport(tasks, this.splitTasks, links)
      //
      // '/api/v2/createjson'
      await createPlanItems.getJsonUrl({ tasks, links, plan: 75350 })
        .then(resp => {
          console.log(resp)
        })
        .catch(err => {
          console.log(err)
        })
      // await createPlanItems.beginImportSQL(tasks, links, 75350)
      //   .then(resp => {
      //     this.$store.dispatch('setSuccess', 'План проекта успешно сохранен.')
      //     this.$store.dispatch('setImportCount', 0)
      //     this.$store.dispatch('setLoading', false)
      //     this.$store.dispatch('setReadyForImport', true)
      //   })
      //   .catch(err => {
      //     console.log('createPlanItems', err)
      //     this.$store.dispatch('setImportCount', 0)
      //     this.$store.dispatch('setLoading', false)
      //     this.$store.dispatch('setReadyForImport', true)
      //     this.$store.dispatch('setError', 'Ошибка связи с сервером. Повторите попытку или обратитесь к администратору.')
      //   })
    }
  }
}
</script>
