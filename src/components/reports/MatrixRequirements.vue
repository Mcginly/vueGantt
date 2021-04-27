<template>
  <div style="width: 100%;">
    <v-expansion-panels
      v-model="matrixPanel"
      multiple
      focusable
      hover
    >
      <v-expansion-panel>
        <v-expansion-panel-header class="blue-grey lighten-5">
          Параметры
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            dense
            style="flex-wrap: nowrap;"
            justify="space-between"
          >
            <v-autocomplete
              v-model="reportQuery.project"
              class="pa-2"
              :items="projects"
              item-text="Name"
              item-value="Id"
              dense
              outlined
              label="Проект"
              clearable
              color="wasdmedium"
            />
          </v-row>
          <v-row dense>
            <v-divider />
            <v-btn
              block
              dark
              color="green"
              class="mt-2"
              @click="getReport()"
            >
              Показать матрицу
            </v-btn>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card
      v-if="dataForMatrix"
      class="mx-auto mt-3"
      tile
      flat
    >
      <v-data-table
        dense
        :headers="matrixHeaders"
        hide-default-header
        :items="dataForMatrix"
        item-key="Id"
        style="width: 100%;"
        calculate-widths
        :search="matrixsearch"
        :group-by="groupedMatrix"
        show-group-by
      >
        <template v-slot:header="{ }">
          <thead class="wasdlight">
            <tr style="height: 50px;">
              <th class="text-center white--text allmaindataheadersmatrix subtitle-1" colspan="6">
                Доходный контракт
              </th>
              <th class="text-center white--text allmaindataheadersmatrix subtitle-1" colspan="4">
                Расходный контракт
              </th>
              <th class="text-center white--text allmaindataheadersmatrix" rowspan="2" style="width: 6%">
                Разница
              </th>
            </tr>
            <tr style="height: 40px;">
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 2%">
                №
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 13%">
                ID
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 16%">
                Обязательство
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 5%">
                Срок
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 7%">
                Дата выполнения
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 13%">
                Исполнитель
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 13%">
                ID
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 5%">
                Срок
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 7%">
                Дата выполнения
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 13%">
                Исполнитель
              </th>
            </tr>
          </thead>
        </template>
        <!--  -->
        <!-- <template v-slot:default>
          <thead class="wasdlight">
            <tr style="height: 50px;">
              <th class="text-center white--text allmaindataheadersmatrix subtitle-1" colspan="5">
                Доходный контракт
              </th>
              <th class="text-center white--text allmaindataheadersmatrix subtitle-1" colspan="2">
                Расходный контракт
              </th>
              <th class="text-center white--text allmaindataheadersmatrix" rowspan="2" style="width: 6%">
                Разница
              </th>
            </tr>
            <tr style="height: 40px;">
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 2%">
                №
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 20%">
                Наименование договора
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 24%">
                Суть обязательства
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 8%">
                Дата выполнения
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 16%">
                Исполнитель
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 8%">
                Дата выполнения
              </th>
              <th class="text-center white--text allmaindataheadersmatrixtop" style="width: 16%">
                Исполнитель
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in dataForMatrix"
              :key="item.name"
            >
              <td class="tablecontentmatrix pa-0">{{ dataForMatrix.indexOf(item) + 1 }}</td>
              <td class="tablecontentmatrix">
                <a
                  :href="getUrl() +  '/Documents/Document/View/' + item.Contract"
                  target="_blank"
                  class="tablecontentmatrix"
                >
                  {{ item.Dms }}
                </a>
              </td>
              <td class="tablecontentmatrix">{{ item.RequirementEssence }}</td>
              <td :class="item.Status === 5 ? 'matrixstatusred' : item.Status === 3 ? 'matrixstatusgreen' : 'tablecontentmatrix'">{{ item.EndDate ? new Date(item.EndDate).toLocaleDateString() : '' }}</td>
              <td class="tablecontentmatrix">{{ item.RequirementExecutorName }}</td>
              <td :class="getDepended(item.DependentObligation) ? getDepended(item.DependentObligation).Status === 5 ? 'matrixstatusred' : getDepended(item.DependentObligation).Status === 3 ? 'matrixstatusgreen' : 'tablecontentmatrix' : 'tablecontentmatrix'">{{ getDepended(item.DependentObligation) ? new Date(getDepended(item.DependentObligation).EndDate).toLocaleDateString() : '' }}</td>
              <td class="tablecontentmatrix">{{ getDepended(item.DependentObligation) ? getDepended(item.DependentObligation).RequirementExecutorName : '' }}</td>
              <td class="tablecontentmatrix">{{ item.selected }}</td>
            </tr>
          </tbody>
        </template> -->
        <!--  -->
        <template v-slot:body="{ items }">
          <tr
            v-for="item in items"
            :key="item.name"
            class="rowmatrix"
          >
            <td class="tablerowmatrix pa-1">
              {{ dataForMatrix.indexOf(item) + 1 }}
            </td>
            <td class="tablerowmatrix pa-1">
              <a
                :href="getUrl() + '/Common/Catalogs/ViewItem/' + item.Id + '?uid=6513f28b-13a3-4e74-aa8f-010353c88ef2'"
                target="_blank"
                style="text-decoration: none;"
              >
                {{ item.Name }}
              </a>
            </td>
            <td class="tablerowmatrix pa-1">
              {{ item.RequirementEssence }}
            </td>
            <td class="tablerowmatrixcenter pa-1">
              {{ item.Deadline ? new Date(item.Deadline).toLocaleDateString() : '' }}
            </td>
            <td :class="item.Status === 3 ? 'tablerowmatrix pa-1 compleatesuccess' : item.Status === 5 ? 'tablerowmatrix pa-1 compleateoverdue' : 'tablerowmatrix pa-1'">
              <v-badge
                v-if="item.Delay > 0 && item.EndDate"
                :content="item.Delay"
                :value="item.Delay"
                color="error"
                class="badgematrix"
                offset-x="-5"
                offset-y="15"

              >
                <template v-slot:badge>
                  <div class="pa-0">
                    <span class="badgematrix pa-0">
                      {{ item.Delay }}
                    </span>
                  </div>
                </template>
                <span class="tablerowmatrix">
                  {{ item.EndDate ? new Date(item.EndDate).toLocaleDateString() : '' }}
                </span>
              </v-badge>
              <span v-else>
                {{ item.EndDate ? new Date(item.EndDate).toLocaleDateString() : '' }}
              </span>
            </td>
            <td class="tablerowmatrixcenter pa-1">
              {{ item.RequirementExecutorName }}
            </td>
            <td class="tablerowmatrix pa-1">
              <a
                v-if="getDepended(item.DependentObligation)"
                :href="getUrl() + '/Common/Catalogs/ViewItem/' + getDepended(item.DependentObligation).Id + '?uid=6513f28b-13a3-4e74-aa8f-010353c88ef2'"
                target="_blank"
                style="text-decoration: none;"
              >
                {{ getDepended(item.DependentObligation).Name }}
              </a>
            </td>
            <td class="tablerowmatrixcenter pa-1">
              {{ getDepended(item.DependentObligation).Deadline ? new Date(getDepended(item.DependentObligation).Deadline).toLocaleDateString() : '' }}
            </td>
            <td :class="getDepended(item.DependentObligation) && getDepended(item.DependentObligation).Status === 3 ? 'compleatesuccess tablerowmatrix pa-1' : getDepended(item.DependentObligation) && getDepended(item.DependentObligation).Status === 5 ? 'compleateoverdue tablerowmatrix pa-1' : 'tablerowmatrix pa-1'">
              <v-badge
                v-if="getDepended(item.DependentObligation) && getDepended(item.DependentObligation).Delay > 0 && getDepended(item.DependentObligation).EndDate"
                :content="getDepended(item.DependentObligation).Delay"
                :value="getDepended(item.DependentObligation).Delay"
                color="error"
                class="badgematrix"
                offset-x="-5"
                offset-y="15"

              >
                <template v-slot:badge>
                  <div class="pa-0">
                    <span class="badgematrix pa-0">
                      {{ getDepended(item.DependentObligation).Delay }}
                    </span>
                  </div>
                </template>
                <span class="tablerowmatrix">
                  {{ getDepended(item.DependentObligation).EndDate ? new Date(getDepended(item.DependentObligation).EndDate).toLocaleDateString() : '' }}
                </span>
              </v-badge>
              <span v-else>
                {{ getDepended(item.DependentObligation).EndDate ? new Date(getDepended(item.DependentObligation).EndDate).toLocaleDateString() : '' }}
              </span>
            </td>
            <td class="tablerowmatrixcenter pa-1">
              {{ getDepended(item.DependentObligation) ? getDepended(item.DependentObligation).RequirementExecutorName : '' }}
            </td>
            <td :class="getDateDiff(item) < 0 ? 'compleateoverdue tablerowmatrixcenter pa-1' : 'compleatesuccess tablerowmatrixcenter pa-1'">
              {{ Math.abs(getDateDiff(item)) }}
            </td>
          </tr>
        </template>

        <!-- <template v-slot:[`item.Id`]="{ item }">
          <span class="tablecontentmatrix pa-0"> {{ dataForMatrix.indexOf(item) + 1 }} </span>
        </template>
        <template v-slot:[`item.Dms`]="{ item }">
          <a
            :href="getUrl() + '/Common/Catalogs/ViewItem/' + item.Id + '?uid=6513f28b-13a3-4e74-aa8f-010353c88ef2'"
            target="_blank"
            class="tablecontentmatrix"
            style=""
          >
            {{ item.Name }}
          </a>
        </template>
        <template v-slot:[`item.RequirementEssence`]="{ item }">
          <span class="tablecontentmatrix">{{ item.RequirementEssence }}</span>
        </template>
        <template v-slot:[`item.EndDate`]="{ item }">
          <v-chip
            v-if="item.Status === 5 || item.Status === 3"
            :color="item.Status === 3 ? '#C8E6C9' : item.Status === 5 ? '#FFCDD2' : ''"
            label
            class="tablecontentmatrix"
            style="width: 100%;"
          >
            {{ item.Deadline ? new Date(item.Deadline).toLocaleDateString() : '' }}
          </v-chip>
          <span v-else class="tablecontentmatrix">
            {{ item.Deadline ? new Date(item.Deadline).toLocaleDateString() : '' }}
          </span>
        </template>
        <template v-slot:[`item.RequirementExecutorName`]="{ item }">
          <span class="tablecontentmatrix">{{ item.RequirementExecutorName }}</span>
        </template>
        <template v-slot:[`item.Name`]="{ item }">
          <a
            v-if="getDepended(item.DependentObligation)"
            :href="getUrl() + '/Common/Catalogs/ViewItem/' + getDepended(item.DependentObligation).Id + '?uid=6513f28b-13a3-4e74-aa8f-010353c88ef2'"
            target="_blank"
            class="tablecontentmatrix"
            style=""
          >
            {{ getDepended(item.DependentObligation).Name }}
          </a>
          <span v-else></span>
        </template>
        <template v-slot:[`item.Status`]="{ item }">
          <v-chip
            v-if="getDepended(item.DependentObligation) && (getDepended(item.DependentObligation).Status === 5 || getDepended(item.DependentObligation).Status === 3)"
            :color="getDepended(item.DependentObligation).Status === 3 ? '#C8E6C9' : getDepended(item.DependentObligation).Status === 5 ? '#FFCDD2' : ''"
            label
            class="tablecontentmatrix"
            style="width: 100%;"
          >
            {{ getDepended(item.DependentObligation).Deadline ? new Date(getDepended(item.DependentObligation).Deadline).toLocaleDateString() : '' }}
          </v-chip>
          <span v-else class="tablecontentmatrix">
            {{ getDepended(item.DependentObligation) && getDepended(item.DependentObligation).Deadline ? new Date(getDepended(item.DependentObligation).Deadline).toLocaleDateString() : '' }}
          </span>
        </template>
        <template v-slot:[`item.Delay`]="{ item }">
          <span class="tablecontentmatrix">{{ getDepended(item.DependentObligation) ? getDepended(item.DependentObligation).RequirementExecutorName : '' }}</span>
        </template>
        <template v-slot:[`item.selected`]="{ item }" :class="getDateDiff(item) < 0 ? 'compleateoverdue' : 'compleatesuccess'">
          <span :class="getDateDiff(item) < 0 ? 'compleateoverdue tablecontentmatrix' : 'compleatesuccess tablecontentmatrix'">{{ getDateDiff(item) }}</span>
        </template> -->
        <!--  -->
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import utils from '../../config/utils'

export default {
  data: () => ({
    groupedMatrix: null,
    matrixsearch: '',
    // matrixPanel: [0],
    // allMatrixData: null,
    reportQuery: {
      project: null,
      projectOffice: null,
      date: null,
      isProfitable: false,
      isAccount: false,
      contractType: 0,
      isNotDeadline: false,
      profitableContractor: null,
      accountContractor: null,
      profitableContract: null,
      accountContract: null,
      contractCurator: null,
      responsible: null
    },
    matrixHeaders: [
      {
        text: '№',
        align: 'start',
        sortable: false,
        value: 'Id',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '2%'
      },
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'Dms',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '20%'
      },
      {
        text: 'Суть обязательства',
        align: 'start',
        sortable: false,
        value: 'RequirementEssence',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '24%'
      },
      {
        text: 'Дата исполнения',
        align: 'start',
        sortable: false,
        value: 'EndDate',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '8%'
      },
      {
        text: 'Исполнитель',
        align: 'start',
        sortable: false,
        value: 'RequirementExecutorName',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '16%'
      },
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'Name',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '16%'
      },
      {
        text: 'Дата исполнения',
        align: 'start',
        sortable: false,
        value: 'Status',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: false,
        width: '8%'
      },
      {
        text: 'Исполнитель',
        align: 'start',
        sortable: false,
        value: 'Delay',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '16%'
      },
      {
        text: 'Разница',
        align: 'start',
        sortable: false,
        value: 'selected',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: false,
        width: '6%'
      }
    ]
  }),
  computed: {
    ...mapGetters([
      'projects',
      'projectOfficeData',
      'profitableContractData',
      'accountContractData',
      'users',
      'allContractors'
    ]),
    ...mapFields([
      'matrixPanel',
      'allMatrixData',
      'requirementTitle',
      'selectedHeaders',
      'allHeaders',
      'dataForMatrix',
      // 'reportQuery',
      'flatTable',
      'requirementsFullData',
      'loading',
      'tabsAdditional',
      // 'groupedBy',
      // 'reqsearch',
      'dialogExportPdf'
    ])
  },
  methods: {
    getStatusName (status) {
      switch (status) {
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
        case 100:
          return 'Все'
        default:
          return ''
      }
    },
    getDateDiff (item) {
      const depend = this.allMatrixData.find(f => f.Id === item.DependentObligation)
      if (depend) {
        return Math.ceil((new Date(item.EndDate ? item.EndDate : item.Deadline).getTime() - new Date(depend.EndDate ? depend.EndDate : depend.Deadline).getTime()) / (1000 * 3600 * 24)) // (new Date(item.EndDate).getTime() - new Date(depend.EndDate).getTime()) / (1000 * 3600 * 24)
        // EndDate
      } else {
        return ''
      }
    },
    getDepended (id) {
      if (this.allMatrixData) {
        const find = this.allMatrixData.find(f => f.Id === id)
        return find
      } else {
        return null
      }
    },
    getUrl () {
      return 'http://' + window.location.hostname
    },
    async getReport () {
      this.loading = true
      utils.getReportRequirementsData(this.reportQuery)
        .then(async response => {
          try {
            this.allMatrixData = response.data
            let allData = response.data.filter(f => f.IsProfitable && f.DependentObligation)
            // let allData = response.data.filter(f => f.DependentObligation)
            //
            // this.dataForMatrix = allData.sort((a, b) => a.order - b.order)
            console.log('getReport', allData)
            this.dataForMatrix = allData
            this.loading = false
            this.matrixPanel = []
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        })
    }
  }
}
</script>

<style scoped>
  .badgematrix {
    font-size: 11px !important;
    text-decoration: none;
  }
  .tablecontentmatrix {
    font-size: 11px;
    text-decoration: none;
  }
  .tablerowmatrixcenter{
    text-align: center !important;
    font-size: 12px;
    text-decoration: none;
    border-left: solid 1px #ebebeb7a;
  }
  .tablerowmatrix {
    font-size: 12px;
    text-decoration: none;
    border-left: solid 1px #ebebeb7a;
  }
  .rowmatrix:hover {
    background-color: #ebebeb7a;
  }
  .matrixstatusred {
    /* font-size: 11px; */
    text-decoration: none;
    background-color:#FFCDD2;
    border-left: none !important;
    border-right: none !important;
  }
  .matrixstatusgreen {
    font-size: 11px;
    text-decoration: none;
    background-color:#C8E6C9;
  }
  .allmaindataheadersmatrix {
    font-size: 14px !important;
    font-weight: bold !important;
    text-align: center !important;
    font-weight: normal !important;
    border-left: solid 1px #9ABAD9;
  }
  .allmaindataheadersmatrixtop {
    text-align: center !important;
    font-weight: normal !important;
    border-left: solid 1px #9ABAD9;
    border-top: solid 1px #9ABAD9;
  }
  .compleatesuccess {
    background-color: #9ad99a8c;
  }
  .compleateoverdue {
    background-color: #d99e9a8c;
  }
</style>
