<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      max-width="99%"
      class="elevation-1 mt-2 ml-2 mr-2"
      type="table"
      transition="scale-transition"
    ></v-skeleton-loader>

    <v-data-table
      v-if="!loading"
      id="dataForExport"
      :items-per-page.sync="pagination.rowsPerPage"
      :headers="mainHeaders"
      :items="portfolio"
      hide-default-header
      item-key="Id"
      class="elevation-1 mt-2 ml-2 mr-2"
      fixed-header
      height="82vh"
      :footer-props="{
        itemsPerPageOptions: [5,10,15,25,50,75,100,-1],
        itemsPerPageText: 'проектов на странице'
      }"
    >
      <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th rowspan="2" class="blue lighten-5 text--primary" style="width: 40px; border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              №
            </th>
            <th rowspan="2" class="blue lighten-5 text--primary" style="border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Наименование проекта
            </th>
            <th rowspan="2" class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Всего направлено на исполнение
            </th>
            <th colspan="2" class="blue lighten-5 text--primary text-center" style="border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important;">
              Активных задач
            </th>
            <th colspan="2" class="blue lighten-5 text--primary text-center" style="border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important;">
              Всего выполнено задач
            </th>
            <th colspan="3" class="blue lighten-5 text--primary text-center" style="border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important;">
              Просроченные задачи
            </th>
            <th rowspan="2" class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Просроченные вехи
            </th>
            <th colspan="3" class="blue lighten-5 text--primary text-center" style="border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important;">
              Просроченные задачи внеплановые
            </th>
            <th rowspan="2" class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-top: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Просроченные контрактные обязательства
            </th>
          </tr>
          <tr>
            <th class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Абсолютное значение
            </th>
            <th class="blue lighten-5 text--primary text-center" style=" width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Относительное значение
            </th>
            <th class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Абсолютное значение
            </th>
            <th class="blue lighten-5 text--primary text-center" style=" width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Относительное значение
            </th>
            <th class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Всего
            </th>
            <th class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Выполненные
            </th>
            <th class="blue lighten-5 text--primary text-center" style=" width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Активные
            </th>
            <th class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Всего
            </th>
            <th class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Поручения ГД
            </th>
            <th class="blue lighten-5 text--primary text-center" style="width: 80px; border-left: 1px solid rgba(0,0,0,.12) !important; border-bottom: 1px solid rgba(0,0,0,.12) !important;">
              Поручения ПЗГД
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="(item, index) in items" :key="item.Id">
            <td>{{ index + 1 }}</td>
            <td> <a :href="`http://wasd/Projects/Project/Index/${item.Id}`" target="_blank" rel="noopener noreferrer">{{ item.Name }}</a></td>
            <td>{{ item.ExecuteTasks }}</td>
            <td>{{ item.ActiveTasksCount }}</td>
            <td>0</td>
            <td>{{ item.DoneTasks }}</td>
            <td>0</td>
            <td>{{ item.AllOutDatedTasks }}</td>
            <td>{{ item.DoneTasksExt }}</td>
            <td>{{ item.ActiveOutdatedTasks }}</td>
            <td><span v-if="item.Milestone > 0" style="color: red;">{{ item.Milestone }}</span><span v-else>{{ item.Milestone }}</span></td>
            <td>{{ item.OutPlanAllOutDatedTasks }}</td>
            <td>{{ item.AllOutDatedTasksByGD }}</td>
            <td>{{ item.AllOutDatedTasksByPZGD }}</td>
            <td>{{ item.AllContractRequirement }}</td>
          </tr>
          <tr>
            <td></td>
            <td><b>ИТОГО:</b></td>
            <td>{{ items.length }}</td>
          </tr>
        </tbody>
      </template>
      <template v-slot:body.append>
        <tr>
          <td></td>
          <td>
            ИТОГО
          </td>
          <td colspan="4"></td>
        </tr>
      </template>

    </v-data-table>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import headers from '../config/tableHeaders'
import utils from '../config/utils'
// import moment from 'moment'

export default {
  data: () => ({
    mainHeaders: headers.portfolio,
    testData: headers.testData,
    pagination: {
      rowsPerPage: 15
    }
  }),
  computed: {
    ...mapGetters([
      'loading',
      'isUserLoggedIn',
      'portfolio',
      'periodLabel'
    ])
  },
  created () {
    if (this.isUserLoggedIn) {
      if (!this.portfolio) {
        // console.log(utils.getPeriodFormat(this.$store.getters.selectedPeriod.id))
        this.$store.dispatch('setPeriodLabel', utils.labelDataFormat(utils.getPeriodFormat(this.$store.getters.selectedPeriod.id)))
        this.$store.dispatch('setPageHeader', 'Портфель проектов (' + this.periodLabel.begin + ' - ' + this.periodLabel.end + ')')
        this.$store.dispatch('setPortfolio', utils.getPeriodFormat(this.$store.getters.selectedPeriod.id))
      }
    } else {
      this.$store.dispatch('setPortfolio', null)
    }
  }
}
</script>
