<template>
  <v-container>
    <v-row dense>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="item.Name"
          label="Наименование"
          readonly
          dense
          flat
          light
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="item.ProjectOfficeName"
          label="Проектный офис"
          readonly
          dense
          flat
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="item.RequirementTypeName ? item.RequirementTypeName : ' '"
          label="Тип обязательства"
          readonly
          dense
          flat
          light
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="item.RequirementExecutorName"
          label="Исполнитель обязательства"
          readonly
          dense
          flat
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="item.ResponsibleDepartmentName"
          label="Ответственное подразделение"
          readonly
          dense
          flat
          light
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="itemStatus"
          label="Статус"
          readonly
          dense
          flat
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="itemResponsible"
          label="Исполнитель от подразделения"
          readonly
          dense
          flat
          light
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="contractorStatus"
          label="Статус выполнения обязательства Контрагентом"
          readonly
          dense
          flat
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        cols="12"
        md="8"
      >
        <v-list-item
          two-line
          class="mb-4"
        >
          <v-list-item-avatar>
            <v-tooltip
              bottom
              open-delay="600"
            >
              <template v-slot:activator="{ on, attrs }">
                <a
                  :href="`${server()}/Documents/Document/DownloadCurrentVersion/${item.Contract}`"
                  target="_blank"
                  style="text-decoration:none;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon
                    v-text="`fa fa-paperclip`"
                  ></v-icon>
                </a>
              </template>
              <span>Скачать файл</span>
            </v-tooltip>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle class="caption">Договор</v-list-item-subtitle>
            <v-list-item-title>
              <a :href="`${server()}/Documents/Document/View/${item.Contract}`" target="_blank" style="text-decoration:none;">{{ item.ContractName }}</a></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-list-item
          two-line
          class="mb-4"
        >
          <v-list-item-content>
            <v-list-item-subtitle class="caption">Тип договора</v-list-item-subtitle>
            <v-list-item-title>{{ item.ContractTypeName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-text-field
      :value="item.RequirementEssence"
      label="Суть обязательства"
      readonly
      dense
      flat
      light
    />
    <v-textarea
      v-model="itemText"
      filled
      label="Текст обязательства"
      auto-grow
      readonly
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
// import config from '../../../../config/config'

export default {
  name: 'requirementInfo',
  props: {
    item: {
      type: Object,
      default () {
        return {
          Name: ' ',
          ProjectOfficeName: ' ',
          RequirementTypeName: ' ',
          RequirementExecutorName: ' ',
          ResponsibleDepartmentName: ' ',
          Status: ' ',
          ResponsibleName: ' ',
          ContractorStatus: ' ',
          RequirementText: ' ',
          RequirementEssence: ' ',
          Contract: ' ',
          ContractName: ' ',
          ContractTypeName: ' '
        }
      }
    }
  },
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters([
      'users'
    ]),
    itemStatus: {
      get () {
        switch (this.item.Status) {
          case 0:
            return 'На согласовании'
          case 1:
            return 'Согласовано'
          case 2:
            return 'В работе'
          case 3:
            return 'Исполнено'
          case 4:
            return 'Возможна ПИР'
          case 5:
            return 'Просрочено'
          case 6:
            return 'Инициирована ПИР'
          case 7:
            return 'Не исполнено'
          case 8:
            return 'Заменено'
          case 9:
            return 'Отменено'
          default:
            return ' '
        }
      },
      set () {
        //
      }
    },
    contractorStatus: {
      get () {
        switch (this.item.ContractorStatus) {
          case 0:
            return 'Cрок не наступил'
          case 1:
            return 'Не выполнено'
          case 2:
            return 'Выполнено'
          case 3:
            return 'Выполнено с просрочкой'
          default:
            return ' '
        }
      },
      set () {
        //
      }
    },
    itemResponsible: {
      get () {
        const find = this.users.find(f => Number(f.id) === Number(this.item.Responsible))
        if (find) {
          return find.shortName
        } else {
          return ' '
        }
      },
      set () {
        //
      }
    },
    itemText: {
      get () {
        return this.item.RequirementText.replace(/&nbsp;/g, '')
      },
      set () {
        //
      }
    }
  },
  methods: {
    server () {
      var host = 'http://' + window.location.hostname
      // return config.wasd_API
      return host
    }
  }
}
</script>
