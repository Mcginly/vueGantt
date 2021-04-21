<template>
  <div v-if="item">
    <v-card class="mt-3 mb-3">
      <v-card-title>
        {{ item.RequirementEssence }}
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tabsAdditional">
          <v-tab :disabled="!item.Documents && !item.Attachments && !item.DocumentURL">Результат</v-tab>
          <v-tab :disabled="!item.Tasks">Задачи</v-tab>
          <v-tab :disabled="!item.Pir && !item.PIRWork">Документы ПИР</v-tab>
          <v-tab :disabled="!item.CompensatingMeasures">Компенсирующие мероприятия</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabsAdditional">
          <v-tab-item>
            <!-- Результат -->
            <v-row>
              <v-col v-if="item.Attachments" cols="6">
                <v-simple-table
                  dense
                >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Прикрепленные файлы</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="result in JSON.parse(item.Attachments)"
                        :key="result.Id"
                      >
                        <td>
                          <a
                            :href="getUrl() + result.Url"
                            target="_blank"
                            class="pa-0"
                            style="text-decoration: none;"
                          >
                            <v-icon x-small class="mr-2">
                              {{ fileType(result.Name) }}
                            </v-icon>
                            {{ result.Name }}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col v-if="item.Documents" cols="6">
                <v-simple-table
                  dense
                >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Прикрепленные документы</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="document in JSON.parse(item.Documents)"
                        :key="document.Id"
                      >
                        <td>
                          <a
                            :href="getUrl() + document.Url"
                            target="_blank"
                            class="pa-0"
                            style="text-decoration: none;"
                          >
                            <img src="/imgs/wasd.png" width="16px" height="16px" class="mr-2" style="vertical-align: middle;" />
                            {{ document.Name }}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
            {{ item.DocumentURL }}
          </v-tab-item>
          <v-tab-item>
            <v-simple-table
              dense
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Наименование</th>
                    <th class="text-left">Описание</th>
                    <th class="text-left">Автор</th>
                    <th class="text-left">Исполнитель</th>
                    <th class="text-left">Создана</th>
                    <th class="text-left">Начало</th>
                    <th class="text-left">Срок</th>
                    <th class="text-left">Выполнена</th>
                    <th class="text-left">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="task in JSON.parse(item.Tasks)"
                    :key="task.Id"
                  >
                    <td>
                      <a
                        :href="getUrl() + task.Url"
                        target="_blank"
                        class="pa-0"
                        :style="taskStyle(task)"
                      >
                        <img src="/imgs/wasd.png" width="16px" height="16px" class="mr-2" style="vertical-align: middle;" />
                        {{ task.Name }}
                      </a>
                    </td>
                    <td>
                      {{ task.Description }}
                    </td>
                    <td>
                      {{ getUser(task.CreationAuthor) }}
                    </td>
                    <td>
                      {{ getUser(task.Executor) }}
                    </td>
                    <td>
                      {{ new Date(task.CreationDate).toLocaleDateString() }}
                    </td>
                    <td>
                      {{ new Date(task.StartDate).toLocaleDateString() }}
                    </td>
                    <td>
                      {{ new Date(task.EndDate).toLocaleDateString() }}
                    </td>
                    <td>
                      {{ task.EndWorkDate ? new Date(task.EndWorkDate).toLocaleDateString() : '' }}
                    </td>
                    <td>
                      <img :src="statusIcon(task.Status)" style="vertical-align: middle;" />
                      {{ status(task.Status) }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item>
            <v-simple-table
              v-if="item.PIRWork"
              dense
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Текущая ПИР</th>
                    <th class="text-left">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="pirWork in JSON.parse(item.PIRWork)"
                    :key="pirWork.Id"
                  >
                    <td>
                      <a
                        :href="getUrl() + pirWork.Url"
                        target="_blank"
                        class="pa-0"
                        :style="pirWork.Status === 9 ? pirWork.Status === 10 ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' : 'text-decoration: none;'"
                      >
                        <img src="/imgs/wasd.png" width="16px" height="16px" class="mr-2" style="vertical-align: middle;" />
                        {{ pirWork.Name }}
                      </a>
                    </td>
                    <td>
                      {{ getStatusPir(pirWork.Status) }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-simple-table
              v-if="item.Pir"
              dense
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Выполненные ПИР</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="pir in JSON.parse(item.Pir)"
                    :key="pir.Id"
                  >
                    <td>
                      <a
                        :href="getUrl() + pir.Url"
                        target="_blank"
                        class="pa-0"
                        style="text-decoration: none;"
                      >
                        <img src="/imgs/wasd.png" width="16px" height="16px" class="mr-2" style="vertical-align: middle;" />
                        {{ pir.Name }}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item>
            <v-simple-table
              v-if="item.CompensatingMeasures"
              dense
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Документ</th>
                    <th class="text-left">Срок</th>
                    <th class="text-left">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="cm in JSON.parse(item.CompensatingMeasures)"
                    :key="cm.Id"
                  >
                    <td>
                      <a
                        :href="getUrl() + cm.Url"
                        target="_blank"
                        class="pa-0"
                        :style="cm.Status === 2 ? cm.Status === 3 ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' : 'text-decoration: none;'"
                      >
                        <img src="/imgs/wasd.png" width="16px" height="16px" class="mr-2" style="vertical-align: middle;" />
                        {{ cm.Name }}
                      </a>
                    </td>
                    <td>
                      {{ new Date(cm.Deadline).toLocaleDateString() }}
                    </td>
                    <td>
                      {{ getStatusCM(cm.Status) }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import config from '../../config/config'

export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  components: {
    //
  },
  data: () => ({
    // tabsAdditional: null
  }),
  computed: {
    ...mapGetters([
      'projects',
      'users'
    ]),
    ...mapFields([
      'tabsAdditional'
      // 'selectedHeaders',
      // 'allHeaders',
      // 'currentUser'
    ])
  },
  methods: {
    getStatusCM (status) {
      switch (status) {
        case 0:
          return 'Новый'
        case 1:
          return 'В работе'
        case 2:
          return 'Выполнено'
        case 3:
          return 'Отменено'
        default:
          return ''
      }
    },
    getStatusPir (status) {
      switch (status) {
        case 0:
          return 'ПИР инициирована'
        case 1:
          return 'Направлена заявка на претензию'
        case 2:
          return 'Претензия направлена'
        case 3:
          return 'Получен ответ на претензию'
        case 4:
          return 'Требование не исполнено'
        case 5:
          return 'Требование исполнено'
        case 6:
          return 'Направлена заявка на иск'
        case 7:
          return 'Иск направлен'
        case 8:
          return 'Получено судебное решение'
        case 9:
          return 'ПИР выполнена'
        case 10:
          return 'Отмена ПИР'
        default:
          return ''
      }
    },
    getUser (id) {
      const find = this.users.find(f => Number(f.id) === Number(id))
      if (find) {
        return find.fullName
      } else {
        return ''
      }
    },
    taskStyle (task) {
      switch (task.Status.toLowerCase()) {
        case '34387afa-6b70-476f-9d34-748732059003':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: none; color: red;' : 'text-decoration: none;' // 'Новая'
        case 'dd048b73-4e08-404a-b62e-c55222845cc4':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' // 'Выполнено'
        case '1710de4d-86fa-4072-951a-55ebbdcd5bf1':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' // 'Невозможно выполнить'
        case '37a184b8-a81d-4177-9eb5-4ebe3dfae959':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: none; color: red;' : 'text-decoration: none;' // 'Выполняется'
        case 'fd7993c6-99c7-4b23-83cc-0f576a63c144':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' // 'Закрыто'
        case '85707efe-806c-4ec6-8cd6-4d5e4edd8b19':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: none; color: red;' : 'text-decoration: none;' // 'Прочитана'
        case '112ea757-36f7-4859-b0d3-6cc0f5a04705':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: none; color: red;' : 'text-decoration: none;' // 'Подготовлено'
        case '46f88008-94cd-4b14-985c-31ba6edeb60e':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' // 'Выполнено и проконтролировано'
        case '2968382b-e9be-4e2f-967b-0dce0a67a4c4':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' // 'Невозможно выполнить и проконтролировано'
        case 'b9c9f74a-15ec-4337-9916-f02ffec83dd4':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: none; color: red;' : 'text-decoration: none;' // 'На предварительном согласовании'
        case '1f6de7ff-03af-401a-a3ca-23af7cab8f65':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: none; color: red;' : 'text-decoration: none;' // 'Отказано в предварительном согласовании '
        case 'b0b6a339-ba74-4e46-b721-2733d7fb76a9':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: none; color: red;' : 'text-decoration: none;' // 'На согласовании'
        case '70918293-8b84-43be-ad39-181375d51373':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: none; color: red;' : 'text-decoration: none;' // 'Отказано в согласовании'
        case '98ff43bd-b897-41f0-adf2-4eb3b3783851':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' // 'Не выполнено'
        case 'b4b74155-53c6-432f-8048-fb9a579349af':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' // 'Выполнено, нужен контроль'
        case 'e498da26-0a25-4d99-a053-01dab75db84a':
          return task.Expired && new Date(task.EndDate).getTime() > new Date(task.StartDate).getTime() ? 'text-decoration: line-through; color: red;' : 'text-decoration: line-through;' // 'Невозможно выполнить, нужен контроль'
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
          return 'Прочитана'
        case '112ea757-36f7-4859-b0d3-6cc0f5a04705':
          return 'Подготовлено'
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
    },
    fileType (str) {
      const extension = str.slice((str.lastIndexOf('.') - 1 >>> 0) + 2)
      switch (extension) {
        case 'pdf':
          return 'far fa-file-pdf'
        case 'doc':
          return 'far fa-file-word'
        case 'docx':
          return 'far fa-file-word'
        case 'xlsx':
          return 'far fa-file-excel'
        case 'xls':
          return 'far fa-file-excel'
        default:
          return 'far fa-file-alt'
      }
      // console.log(extension)
    },
    getUrl () {
      return 'http://' + window.location.hostname
    }
  }
}
</script>
