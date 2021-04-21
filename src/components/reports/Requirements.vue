<template>
  <div class="mx-lg-2">
    <v-overlay
      :value="loading"
    >
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
    <v-row dense class="mb-3 mt-2">
      <v-btn-toggle
        v-model="toggleReport"
        borderless
        mandatory
        color="wasdmedium"
      >
        <v-btn value="requirements" @click="mainVisible()">
          <span class="hidden-sm-and-down">Отчет</span>
          <v-icon right class="mr-2" :color="isMainVisible ? 'wasdmedium' : ''">
            fas fa-tasks
          </v-icon>
        </v-btn>
        <v-btn value="matrix" @click="matrixVisible()">
          <span class="hidden-sm-and-down">Матрица</span>
          <v-icon right class="mr-2" :color="isMatrixVisible ? 'wasdmedium' : ''">
            fas fa-table
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-row>
    <v-row v-if="isMainVisible" transition="slide-y-transition">
      <v-expansion-panels
        v-model="panel"
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
                v-model="reportQuery.projectOffice"
                class="pa-2"
                :items="projectOfficeData"
                item-text="Name"
                item-value="Id"
                dense
                outlined
                label="Проектный офис"
                clearable
                color="wasdmedium"
              />
              <v-autocomplete
                v-model="reportQuery.project"
                class="pa-2"
                :items="projects"
                multiple
                item-text="Name"
                item-value="Id"
                dense
                outlined
                label="Проект"
                clearable
                color="wasdmedium"
              />
              <!-- <v-autocomplete
                v-model="selectedSortBy"
                class="pa-2"
                style="width: 100px;"
                :items="sortBy"
                item-value="id"
                dense
                outlined
                label="Сортировать по"
                clearable
                color="wasdmedium"
              />
              <v-autocomplete
                v-model="selectedGroupBy"
                class="pa-2"
                style="width: 100px;"
                :items="groupBy"
                item-value="id"
                dense
                outlined
                label="Группировать по"
                clearable
                color="wasdmedium"
              /> -->
            </v-row>
            <v-row
              dense
              style="flex-wrap: nowrap;"
              justify="space-between"
            >
              <v-autocomplete
                v-model="reportQuery.profitableContractor"
                class="pa-2"
                :items="allContractors"
                item-text="Name"
                item-value="Id"
                dense
                outlined
                label="Заказчик"
                clearable
                color="wasdmedium"
              />
              <v-autocomplete
                v-model="reportQuery.accountContractor"
                class="pa-2"
                :items="allContractors"
                item-text="Name"
                item-value="Id"
                dense
                outlined
                label="Подрядчик"
                clearable
                color="wasdmedium"
              />
              <v-autocomplete
                v-model="reportQuery.contractCurator"
                class="pa-2"
                :items="users"
                item-text="fullName"
                item-value="id"
                dense
                outlined
                label="Куратор"
                clearable
                color="wasdmedium"
              />
              <v-autocomplete
                v-model="reportQuery.responsible"
                class="pa-2"
                :items="users"
                item-text="fullName"
                item-value="id"
                dense
                outlined
                label="Исполнитель от подразделения"
                clearable
                color="wasdmedium"
              />
            </v-row>
            <v-row
              dense
            >
              <v-col cols="6">
                <v-row dense>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    color="wasdmedium"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="computedDate"
                        label="Дата"
                        prepend-icon="mdi-calendar"
                        readonly
                        clearable
                        @click:clear="clearDedline()"
                        outlined
                        dense
                        class="mr-5"
                        color="wasdmedium"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="reportQuery.date"
                      :first-day-of-week="1"
                      @input="menu = false"
                      color="wasdmedium"
                    />
                  </v-menu>
                  <v-checkbox
                    v-model="reportQuery.isNotDeadline"
                    dense
                    :label="`Показывать обязательства без срока исполнения`"
                    class="ml-2 mr-3"
                    color="wasdmedium"
                  />
                </v-row>
              </v-col>
              <v-col cols="6">

              </v-col>
            </v-row>
            <v-row
              dense
            >
              <v-spacer />
              <v-col cols="12">
                <span class="text-caption mr-2">Фильтр по договору</span>
                <v-btn-toggle
                  v-model="reportQuery.contractType"
                  color="wasdmedium"
                  tile
                  group
                >
                  <v-btn :value="0">
                    Все
                  </v-btn>
                  <v-btn :value="2">
                    Доходные
                  </v-btn>
                  <v-btn :value="1">
                    Расходные
                  </v-btn>
                </v-btn-toggle>
                <v-autocomplete
                  v-if="reportQuery.contractType === 2"
                  v-model="reportQuery.profitableContract"
                  :items="profitableContractData"
                  item-text="Name"
                  item-value="Id"
                  dense
                  outlined
                  label="Доходный договор"
                  clearable
                  color="wasdmedium"
                />
                <v-autocomplete
                  v-if="reportQuery.contractType === 1"
                  v-model="reportQuery.accountContract"
                  :items="accountContractData"
                  item-text="Name"
                  item-value="Id"
                  dense
                  outlined
                  label="Расходный договор"
                  clearable
                  color="wasdmedium"
                />
              </v-col>
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
                Показать отчёт
              </v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <v-row>
        <chartForm class="mt-3" />
      </v-row> -->
      <v-row dense class="ml-2 mr-5">
        <v-col cols="3">
          <canvas id="myChart0" class="pa-2" />
        </v-col>
        <v-col cols="3">
          <canvas id="myChart1" class="pa-2" />
        </v-col>
        <v-col cols="3">
          <canvas id="myChart2" class="pa-2" />
        </v-col>
        <v-col cols="3">
          <canvas id="myChart3" class="pa-2" />
        </v-col>
      </v-row>
      <v-card
        v-if="allTableData"
        ref="contenttopdf"
        class="mx-auto mt-3"
        tile
        flat
        style="width: 100%;"
      >
        <div>
          <v-simple-table v-if="finalData" dense class="mb-3">
            <template v-slot:default>
              <thead class="wasdlight">
                <tr style="height: 36px;">
                  <th rowspan="2" class="text-left white--text title" style="width: 44%">
                    Сводные данные
                  </th>
                  <th rowspan="2" class="text-center white--text subtitle-1" style="width: 5%">
                    Всего
                  </th>
                  <th colspan="2" class="text-left white--text alldataheaders subtitle-1" style="width: 17%">
                    Исполнено
                  </th>
                  <th colspan="2" class="text-left white--text alldataheaders subtitle-1" style="width: 17%">
                    В работе
                  </th>
                  <th colspan="2" class="text-left white--text alldataheaders subtitle-1" style="width: 17%">
                    ПИР
                  </th>
                </tr>
                <tr>
                  <th class="text-center white--text alldataheaders subtitle-2" style="width: 7%">Всего</th>
                  <th class="text-center white--text alldataheaders subtitle-2" style="width: 7%">С просрочкой</th>
                  <th class="text-center white--text alldataheaders subtitle-2" style="width: 7%">Всего</th>
                  <th class="text-center white--text alldataheaders subtitle-2" style="width: 7%">Просрочено</th>
                  <th class="text-center white--text alldataheaders subtitle-2" style="width: 7%">Просрочено (ШС)</th>
                  <th class="text-center white--text alldataheaders subtitle-2" style="width: 7%">Инициирована</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in finalData"
                  :key="item.name"
                >
                  <!-- createChart -->
                  <td @click="togglePanel(item)" style="cursor: pointer;">
                    {{ item.Name }}
                  </td>
                  <td class="text-center">{{ item.Count }}</td>
                  <td :class="compleatedCount(item.data) > 0 ? 'text-center summarycell' : 'text-center'" :style="isSetMarked.Name === item.Name + 'setCompleated' && isSetMarked.marked ? isSetMarked.style : ''" @click="compleatedCount(item.data) > 0 ? setCompleated(item) : 0">{{ compleatedCount(item.data) }}</td>
                  <td :class="compleatedOverdueCount(item.data) > 0 ? 'text-center summarycell red--text' : 'text-center red--text'" :style="isSetMarked.Name === item.Name + 'setCompleatedOverdue' && isSetMarked.marked ? isSetMarked.style : ''" @click="compleatedOverdueCount(item.data) > 0 ? setCompleatedOverdue(item) : 0">{{ compleatedOverdueCount(item.data) }}</td>
                  <td :class="inworkCount(item.data) > 0 ? 'text-center summarycell' : 'text-center'" :style="isSetMarked.Name === item.Name + 'setInWork' && isSetMarked.marked ? isSetMarked.style : ''" @click="inworkCount(item.data) > 0 ? setInWork(item) : 0">{{ inworkCount(item.data) }}</td>
                  <td :class="overdueCount(item.data) > 0 ? 'text-center summarycell red--text' : 'text-center red--text'" :style="isSetMarked.Name === item.Name + 'setOverdue' && isSetMarked.marked ? isSetMarked.style : ''" @click="overdueCount(item.data) > 0 ? setOverdue(item) : 0">{{ overdueCount(item.data) }}</td>
                  <td :class="shsCount(item.data) > 0 ? 'text-center summarycell red--text text--darken-4' : 'text-center red--text text--darken-4'" :style="isSetMarked.Name === item.Name + 'setShs' && isSetMarked.marked ? isSetMarked.style : ''" @click="shsCount(item.data) > 0 ? setShs(item) : 0">{{ shsCount(item.data) }}</td>
                  <td :class="pirCount(item.data) > 0 ? 'text-center summarycell red--text text--darken-4' : 'text-center red--text text--darken-4'" :style="isSetMarked.Name === item.Name + 'setPir' && isSetMarked.marked ? isSetMarked.style : ''" @click="pirCount(item.data) > 0 ? setPir(item) : 0">
                    {{ pirCount(item.data) }}
                    <!-- <v-badge
                      :content="'+2'"
                      color="error"
                      inline
                    >
                      {{ pirCount(item.data) }}
                    </v-badge> -->
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider class="mb-3 mt-0" />
        </div>
        <div>
          <v-alert
            v-if="requirementTitle !== ''"
            color="cyan"
            border="left"
            elevation="2"
            colored-border
            prominent
            icon="fas fa-tasks"
          >
            <v-row align="center">
              <v-col class="grow">
                {{ requirementTitle }}
              </v-col>
              <v-col class="shrink">
                <v-btn @click="resetRequirements()">Очистить фильтр</v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </div>
        <v-row
          dense
        >
          <v-col cols="11" class="mb-3">
            <v-row
              dense
              justify="start"
              class="d-flex align-center"
            >
              <span class="text-sm-body-2 mr-2 ml-2">Группировка: </span>
              <v-btn-toggle
                v-model="groupedBy"
                color="wasdmedium"
                tile
              >
                <v-btn value="Project">
                  По проекту
                </v-btn>
                <v-btn :value="'Dms'">
                  По договору
                </v-btn>
                <v-btn value="RequirementExecutorName">
                  По исполнителю
                </v-btn>
                <v-btn v-if="groupBtnAllVisible" value="Status">
                  По статусу
                </v-btn>
                <v-btn v-if="isCanselGroupingVisible()" :value="[]">
                  <v-icon class="mr-3" color="error">fas fa-ban</v-icon>
                  Отменить группировку
                </v-btn>
              </v-btn-toggle>
              <!-- <v-tooltip
                bottom
                open-on-hover
                open-delay="500"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="mr-2 ml-2"
                    :depressed="false"
                    @click="isFilterVisible = !isFilterVisible"
                    v-on="on"
                  >
                    <v-icon :color="isFilterVisible ? 'wasdmedium' : ''">fas fa-filter</v-icon>
                  </v-btn>
                </template>
                <span>{{ isFilterVisible ? 'Отключить фильтрацию' : 'Включить фильтрацию' }}</span>
              </v-tooltip> -->
              <v-text-field
                v-model="reqsearch"
                append-icon="fas fa-search"
                label="Поиск"
                single-line
                hide-details
                color="wasdmedium"
                clearable
                class="ml-5"
              />
            </v-row>
          </v-col>
          <!-- <v-col cols="4">
            <v-text-field
              v-model="search"
              append-icon="fas fa-search"
              label="Поиск"
              single-line
              hide-details
              color="wasdmedium"
              clearable
            />
          </v-col> -->
          <v-col cols="1">
            <v-row
              dense
              justify="end"
            >
              <tableOptions />
              <v-tooltip
                bottom
                open-on-hover
                open-delay="500"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="success"
                    class="mr-2"
                    @click="exportToExcel()"
                    v-on="on"
                  >
                    <v-icon>fas fa-file-excel</v-icon>
                  </v-btn>
                </template>
                <span>Экспорт в EXCEL</span>
              </v-tooltip>
              <!-- <exportPdfForm v-if="dataForTable" :pdftable="dataForPdf()" /> -->
              <v-tooltip
                bottom
                open-on-hover
                open-delay="500"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="error"
                    class="mr-2"
                    @click="dialogExportPdf = true"
                    v-on="on"
                  >
                    <!-- exportToPdf() -->
                    <v-icon>fas fa-file-pdf</v-icon>
                  </v-btn>
                </template>
                <span>Экспорт в PDF</span>
              </v-tooltip>
            </v-row>
            <!-- <v-spacer /> -->
          </v-col>
        </v-row>
        <v-tabs
          v-model="tab"
          background-color="transparent"
          class="basil"
          grow
        >
          <v-tabs-slider color="rgba(255, 255, 255, 0)"></v-tabs-slider>
          <v-tab
            v-for="status in dataForTable"
            :key="status.Status"
            active-class="wasdlight white--text"
            :class="status.Status === 5 || status.Status === 6 ? 'red--text' : ''"
            @click="currentTab(status.Status)"
          >
            <span :class="status.Status === 100 ? 'font-weight-bold' : ''">{{ `${status.Name} (${status.data.length})` }}</span>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="status in dataForTable"
            :key="status.Status"
          >
            <v-data-table
              v-if="dataForTable"
              v-model="selected"
              single-select
              dense
              :headers="selectedHeaders"
              hide-default-header
              :items="status.data"
              item-key="Id"
              style="width: 100%;"
              class="tablemain"
              calculate-widths
              :search="reqsearch"
              :group-by="groupedBy"
              show-group-by
              :expanded="expanded"
              @update:group-by="groupingClick()"
            >
              <template v-slot:header="{ }">
                <thead class="wasdlight">
                  <tr style="height: 60px;">
                    <th v-if="isColumnVisible('Id')" class="text-center white--text allmaindataheaders">
                      №
                    </th>
                    <th v-if="groupedBy !== 'Project' && isColumnVisible('Project')" class="text-center white--text allmaindataheaders">
                      Проект
                    </th>
                    <th v-if="groupedBy !== 'Dms' && isColumnVisible('Dms')" class="text-center white--text allmaindataheaders">
                      Договор
                    </th>
                    <th v-if="isColumnVisible('RequirementEssence')" class="text-left white--text allmaindataheaders">
                      Обязательство
                    </th>
                    <th v-if="isColumnVisible('Name')" class="text-left white--text allmaindataheaders">
                      ID
                    </th>
                    <th v-if="isColumnVisible('StartConditions')" class="text-left white--text allmaindataheaders">
                      Условия возникновения
                    </th>
                    <th v-if="groupedBy !== 'RequirementExecutorName' && isColumnVisible('RequirementExecutorName')" class="text-left white--text allmaindataheaders">
                      Исполнитель
                    </th>
                    <th v-if="groupedBy !== 'Responsible' && isColumnVisible('Responsible')" class="text-left white--text allmaindataheaders">
                      Ответственный от WASD
                    </th>
                    <th v-if="isColumnVisible('Deadline')" class="text-left white--text allmaindataheaders">
                      Срок исполнения
                    </th>
                    <th v-if="isColumnVisible('EndDate')" class="text-left white--text allmaindataheaders">
                      Дата исполнения
                    </th>
                    <th v-if="isColumnVisible('Delay')" class="text-left white--text allmaindataheaders">
                      Просрочка (дней)
                    </th>
                    <th v-if="isColumnVisible('PenaltiesClause')" class="text-left white--text allmaindataheaders">
                      Штрафные санкции
                    </th>
                    <th v-if="groupedBy !== 'Status' && isColumnVisible('Status')" class="text-left white--text allmaindataheaders">
                      Статус
                    </th>
                    <th v-if="isColumnVisible('KeyEvent')" class="text-left white--text allmaindataheaders">
                      КС
                    </th>
                    <th v-if="isColumnVisible('StatusPIR')" class="text-left white--text allmaindataheaders">
                      Статус ПИР
                    </th>
                    <th v-if="isColumnVisible('Subsystem')" class="text-left white--text allmaindataheaders">
                      Подсистема
                    </th>
                    <th v-if="isColumnVisible('DepVerificationUser')" class="text-left white--text allmaindataheaders">
                      Результат
                    </th>
                    <th v-if="isColumnVisible('selected')" class="text-left white--text allmaindataheaders">
                      <!-- Действия -->
                    </th>
                  </tr>
                </thead>
              </template>
              <template v-if="isFilterVisible" v-slot:[`body.prepend`]="{ }">
                <tr>
                  <td v-if="isColumnVisible('Id')"></td>
                  <td v-if="groupedBy !== 'Project' && isColumnVisible('Project')">
                    <v-text-field
                      v-model="filters.project"
                      label="Проект"
                    ></v-text-field>
                  </td>
                  <td v-if="groupedBy !== 'Dms' && isColumnVisible('Dms')">
                    <v-text-field
                      v-model="filters.contract"
                      label="Договор"
                    ></v-text-field>
                  </td>
                  <td v-if="isColumnVisible('RequirementEssence')">
                    <v-text-field
                      v-model="filters.requirement"
                      label="Обязательство"
                    ></v-text-field>
                  </td>
                  <td v-if="isColumnVisible('Name')">
                    <v-text-field
                      v-model="filters.id"
                      label="ID"
                    ></v-text-field>
                  </td>
                  <td v-if="isColumnVisible('StartConditions')"></td>
                  <td v-if="groupedBy !== 'RequirementExecutorName' && isColumnVisible('RequirementExecutorName')">
                    <v-text-field
                      v-model="filters.executor"
                      label="Исполнитель"
                    ></v-text-field>
                  </td>
                  <td v-if="groupedBy !== 'Responsible' && isColumnVisible('Responsible')">
                    <v-text-field
                      v-model="filters.responsible"
                      label="Ответственный"
                    ></v-text-field>
                  </td>
                  <td v-if="isColumnVisible('Deadline')">
                    <!-- <v-text-field
                      v-model="filters.dedline"
                      label="Срок"
                    ></v-text-field> -->
                    <v-menu
                      v-model="menuDedline"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      color="wasdmedium"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="computedFilterDedline"
                          label="Срок"
                          clearable
                          readonly
                          color="wasdmedium"

                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="filters.dedline"
                        :first-day-of-week="1"
                        @input="menuDedline = false"
                        color="wasdmedium"
                      />
                    </v-menu>
                  </td>
                  <td v-if="isColumnVisible('EndDate')">
                    <v-text-field
                      v-model="filters.compleated"
                      label="Исполнено"
                    ></v-text-field>
                  </td>
                  <td v-if="isColumnVisible('Delay')"></td>
                  <td v-if="isColumnVisible('PenaltiesClause')"></td>
                  <td v-if="groupedBy !== 'Status' && isColumnVisible('Status')"></td>
                  <td v-if="isColumnVisible('KeyEvent')"></td>
                  <td v-if="isColumnVisible('StatusPIR')"></td>
                  <td v-if="isColumnVisible('Subsystem')"></td>
                  <td v-if="isColumnVisible('DepVerificationUser')"></td>
                  <td v-if="isColumnVisible('selected')"></td>
                </tr>
              </template>
              <template v-slot:[`group.header`]="{ group, groupBy, headers, remove, toggle, isOpen, items }">
                <th :colspan="headers.length" style="width: 100%;">
                  <v-row dense>
                    <v-btn icon small class="mr-2 ml-2" @click="toggle">
                      <v-icon>{{ isOpen ? 'fas fa-angle-up' : 'fas fa-angle-down' }}</v-icon>
                    </v-btn>
                    <span class="ml-3 title">{{ `(${items.length}) ${groupText(group, groupBy)}` }}</span>
                    <v-spacer />
                    <v-btn icon small class="mr-2" @click="remove; groupedBy = []">
                      <v-icon>fas fa-times</v-icon>
                    </v-btn>
                  </v-row>
                </th>
              </template>
              <template v-slot:[`item.Id`]="{ item }">
                <span class="tablecontent pa-0"> {{ status.data.indexOf(item) + 1 }} </span>
              </template>
              <template v-slot:[`item.Project`]="{ item }">
                <a
                  :href="getUrl() + '/Projects/Project/AllInfo/' + item.Project"
                  target="_blank"
                  class="tablecontent pa-0"
                >
                  {{ projectName(item.Project) }}
                </a>
              </template>
              <template v-slot:[`item.Dms`]="{ item }">
                <a
                  :href="getUrl() +  '/Documents/Document/View/' + item.Contract"
                  target="_blank"
                  class="tablecontent"
                >
                  {{ item.Dms }}
                </a>
              </template>
              <template v-slot:[`item.RequirementEssence`]="{ item }">
                <span class="tablecontent">{{ item.RequirementEssence }}</span>
              </template>
              <template v-slot:[`item.Name`]="{ item }">
                <a
                  :href="getUrl() + '/Common/Catalogs/ViewItem/' + item.Id + '?uid=6513f28b-13a3-4e74-aa8f-010353c88ef2'"
                  target="_blank"
                  class="tablecontent"
                  style=""
                >
                  {{ item.Name }}
                </a>
              </template>
              <template v-slot:[`item.StartConditions`]="{ item }">
                <span class="tablecontent">{{ item.StartConditions }}</span>
              </template>
              <!-- <template v-slot:[`item.RequirementExecutor`]="{ item }">
                <span class="caption">{{ userName(item.RequirementExecutor) }}</span>
              </template> -->
              <template v-slot:[`item.RequirementExecutorName`]="{ item }">
                <span class="tablecontent">{{ item.RequirementExecutorName }}</span>
              </template>
              <template v-slot:[`item.Responsible`]="{ item }">
                <span class="tablecontent">{{ userName(item.Responsible) }}</span>
              </template>
              <template v-slot:[`item.Deadline`]="{ item }">
                <span class="tablecontent">{{ item.Deadline ? new Date(item.Deadline).toLocaleDateString() : '' }}</span>
              </template>
              <template v-slot:[`item.EndDate`]="{ item }">
                <span class="tablecontent">{{ item.EndDate ? new Date(item.EndDate).toLocaleDateString() : '' }}</span>
              </template>
              <template v-slot:[`item.Delay`]="{ item }">
                <span class="tablecontent">{{ item.Delay }}</span>
              </template>
              <template v-slot:[`item.PenaltiesClause`]="{ item }">
                <span class="tablecontent">{{ item.PenaltiesClause }}</span>
              </template>
              <template v-slot:[`item.Status`]="{ item }">
                <span class="tablecontent">{{ getStatusName(item.Status) }}</span>
              </template>
              <template v-slot:[`item.KeyEvent`]="{ item }">
                <span class="tablecontent">{{ getKeyEvent(item.KeyEvent) }}</span>
              </template>
              <template v-slot:[`item.StatusPIR`]="{ item }">
                <span class="tablecontent">{{ getStatusPir(item.StatusPIR) }}</span>
              </template>
              <template v-slot:[`item.Subsystem`]="{ item }">
                <span class="tablecontent" v-html="getSubsystems(item.Subsystems)" />
              </template>
              <!-- <template v-slot:[`item.Contract`]="{ item }">
                <span class="tablecontent">{{ item.Contract }}</span>
              </template> -->
              <template v-slot:[`item.DepVerificationUser`]="{ item }">
                <span class="tablecontent" v-html="getResult(item)" />
              </template>
              <template v-slot:[`item.selected`]="{ item }">
                <span class="tablecontent">
                  <v-tooltip
                    bottom
                    open-on-hover
                    open-delay="500"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        :disabled="!item.Attachments && !item.Documents && !item.PIRWork && !item.Pir && !item.CompensatingMeasures && !item.DocumentURL"
                        @click="showSelected(item)"
                        v-on="on"
                      >
                        <v-icon :color="selected.indexOf(item) === 0 ? 'wasdmedium' : ''">{{ selected.indexOf(item) === 0 ? 'fas fa-chevron-up' : 'fas fa-chevron-down' }}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ selected.indexOf(item) === 0 ? 'Скрыть дополнительную информацию' : 'Показать дополнительную информацию' }}</span>
                  </v-tooltip>
                </span>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <additionalInfo :item="item" />
                </td>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-row>
    <v-row v-if="isMatrixVisible" transition="slide-y-transition">
      <!-- Матрица обязательств -->
      <matrixRequirements />
    </v-row>
    <exportPdfForm v-if="dialogExportPdf" :pdftable="dataForPdf()" :pdfheaders="pdfheaders()" :filename="requirementTitle ? requirementTitle : 'Отчет по обязательствам'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
// import config from '../../config/config'
// import JsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
//
import utils from '../../config/utils'
import tableOptions from './TableOptions'
import additionalInfo from './AdditionalInfo'
import exportPdfForm from './ExportPdfForm'
import matrixRequirements from './MatrixRequirements'
// import chartForm from './ChartForm'
import tableToExcel from './tableToExcel'
// import VueHtml2pdf from 'vue-html2pdf'
//
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.plugins.register(ChartDataLabels)

export default {
  components: {
    tableOptions,
    additionalInfo,
    exportPdfForm,
    matrixRequirements
    // chartForm
  },
  data: () => ({
    toggleReport: 'requirements',
    isMainVisible: true,
    isMatrixVisible: false,
    isFilterVisible: false,
    filters: {
      project: '',
      contract: '',
      id: '',
      requirement: '',
      executor: '',
      responsible: '',
      dedline: null,
      compleated: ''
    },
    menuDedline: null,
    groupBtnAllVisible: false,
    panel: [0],
    selected: [],
    expanded: [],
    // groupedBy: [],
    // reqsearch: '',
    menu: null,
    tab: null,
    sortBy: [{ id: 1, text: 'сроку исполнения' }, { id: 2, text: 'договору' }, { id: 3, text: 'статусу' }, { id: 4, text: 'исполнителю' }],
    groupBy: [{ id: 1, text: 'контрагенту' }, { id: 2, text: 'договору' }, { id: 3, text: 'статусу' }, { id: 4, text: 'исполнителю' }],
    // contractType: [{ id: 1, text: 'По расходным' }, { id: 2, text: 'По доходным' }, { id: 0, text: 'Все' }],
    selectedSortBy: null,
    selectedGroupBy: null,
    // tableLoading: false,
    allTableData: null,
    finalData: null,
    // requirementTitle: '',
    isSetMarked: { Name: '', marked: false, style: 'background-color: #9abad98c !important;' },
    chartsImages: []
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
      'requirementTitle',
      'selectedHeaders',
      'allHeaders',
      'dataForTable',
      'reportQuery',
      'flatTable',
      'requirementsFullData',
      'loading',
      'tabsAdditional',
      'groupedBy',
      'reqsearch',
      'dialogExportPdf'
    ]),
    computedDate () {
      if (this.reportQuery.date) {
        return new Date(this.reportQuery.date).toLocaleDateString()
      } else {
        return null
      }
    },
    computedFilterDedline () {
      if (this.filters.dedline) {
        return new Date(this.filters.dedline).toLocaleDateString()
      } else {
        return null
      }
    }
  },
  methods: {
    createChart () {
      // console.log(ChartDataLabels)
      for (let i = 0; i < this.finalData.length; i++) {
        const item = this.finalData[i]
        var ctx = document.getElementById('myChart' + i)
        //
        let lineChartData = {
          labels: ['Всего', 'Исполнено', 'Просрочено', 'Просрочено (ШС)'],
          datasets: [
            {
              label: '',
              data: [item.Count, this.compleatedCount(item.data), this.overdueCount(item.data), this.shsCount(item.data)], // + this.pirCount(item.data)
              backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 99, 132, 0.2)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }
          ]
        }
        //
        // eslint-disable-next-line
        var myChart = new Chart(ctx, {
          plugins: [ChartDataLabels],
          type: 'bar',
          data: lineChartData,
          options: {
            title: {
              display: true,
              text: item.Name
            },
            legend: {
              display: false,
              labels: {
                fontColor: 'rgb(255, 99, 132)'
              }
            },
            plugins: {
              datalabels: {
                anchor: 'end',
                align: function (context) {
                  var height = context.dataset._meta[Object.keys(context.dataset._meta)[0]].data[context.dataIndex]._model.y
                  var base = context.dataset._meta[Object.keys(context.dataset._meta)[0]].data[context.dataIndex]._model.base
                  if ((base - height) / base >= 0.7) {
                    return 'start'
                  } else {
                    return 'top'
                  }
                },
                formatter: Math.round,
                font: {
                  weight: 'bold'
                }
              }
            },
            tooltips: { enabled: false },
            scales: {
              xAxes: [
                {
                  // stacked: true,
                  display: true,
                  gridLines: {
                    display: true,
                    drawBorder: true
                  },
                  ticks: {
                    display: true
                  }
                }
              ],
              yAxes: [
                {
                  // stacked: true,
                  display: true,
                  gridLines: {
                    display: false,
                    drawBorder: true
                  },
                  ticks: {
                    display: false
                  }
                }
              ]
            }
            // animation: {
            //   onComplete: done
            // }
          }
        })
        // var url=myLine.toBase64Image()
      }
    },
    matrixVisible () {
      this.isMainVisible = false
      this.isMatrixVisible = true
    },
    mainVisible () {
      this.isMatrixVisible = false
      this.isMainVisible = true
    },
    clearDedline () {
      this.reportQuery.date = null
      this.filters.dedline = null
    },
    dataForPdf () {
      const find = this.dataForTable.find(f => f.Status === 100)
      // console.log('dataForPdf', find)
      if (find) {
        return find.data
      } else {
        return []
      }
    },
    pdfheaders () {
      let pdfHeaders = JSON.parse(JSON.stringify(this.selectedHeaders))
      for (let i = 0; i < pdfHeaders.length; i++) {
        let element = pdfHeaders[i]
        if (element.value === 'selected') {
          pdfHeaders.splice(i, 1)
        }
      }
      // console.log(pdfHeaders)
      return pdfHeaders
    },
    currentTab (status) {
      if (status === 100) {
        this.groupBtnAllVisible = true
      } else {
        this.groupBtnAllVisible = false
      }
    },
    showSelected (item) {
      item.selected = !item.selected
      if (this.selected.indexOf(item) === 0) {
        this.selected = []
        this.expanded = []
        this.tabsAdditional = null
      } else {
        this.selected = [item]
        this.expanded = [item]
        this.tabsAdditional = null
      }
      // console.log(this.selected.indexOf(item))
    },
    getKeyEvent (status) {
      switch (status) {
        case 0:
          return 'КС результатов'
        case 1:
          return 'Договорные КС'
        case 2:
          return 'Финансовые КС'
        case 3:
          return 'Управленческие КС'
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
    getResult (item) {
      let returnString = ''
      if (item.Documents) {
        const docs = JSON.parse(item.Documents)
        for (let i = 0; i < docs.length; i++) {
          returnString += `<a href="${this.getUrl() + docs[i].Url}" target="_blank" class="tablecontent" style="text-decoration: none;">${docs[i].Name}</a>`
          if (docs.length > 1 && i !== docs.length - 1) {
            returnString += '<br>'
          }
        }
      }
      if (item.Attachments) {
        const attachs = JSON.parse(item.Attachments)
        if (returnString !== '') {
          returnString += '<br>'
        }
        for (let i = 0; i < attachs.length; i++) {
          returnString += `<a href="${this.getUrl() + attachs[i].Url}" target="_blank" class="tablecontent" style="text-decoration: none;">${attachs[i].Name}</a>`
          if (attachs.length > 1 && i !== attachs.length - 1) {
            returnString += '<br>'
          }
        }
      }
      if (item.DocumentURL) {
        if (returnString !== '') {
          returnString += '<br>' + item.DocumentURL
        }
      }
      return returnString
    },
    getSubsystems (subsystems) {
      if (subsystems) {
        const arr = JSON.parse(subsystems)
        if (Array.isArray(arr) && arr.length > 0) {
          let returnString = ''
          for (let i = 0; i < arr.length; i++) {
            returnString += `<a href="${this.getUrl() + arr[i].Url}" target="_blank" class="tablecontent" style="text-decoration: none;">${arr[i].Name}</a>`
            if (arr.length > 1 && i !== arr.length - 1) {
              returnString += '<br>'
            }
          }
          return returnString
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    exportToExcel () {
      function parseSubsystems (subsystems) {
        if (subsystems) {
          const arr = JSON.parse(subsystems)
          if (Array.isArray(arr) && arr.length > 0) {
            let returnString = ''
            for (let i = 0; i < arr.length; i++) {
              returnString += arr[i].Name
              if (arr.length > 1 && i !== arr.length - 1) {
                returnString += ','
              }
            }
            return returnString
          } else {
            return ''
          }
        } else {
          return ''
        }
      }
      //
      // 'rgba(54, 162, 235, 0.2)',
      //           'rgba(75, 192, 192, 0.2)',
      //           'rgba(255, 206, 86, 0.2)',
      //           'rgba(255, 99, 132, 0.2)'
      function sheetColor (val) {
        switch (val) {
          case 'Все':
            return 'b9def8'
          case 'Исполнено':
            return 'c0e9e9'
          case 'Просрочено':
            return 'ffeec4'
          case 'Инициирована ПИР':
            return 'ffc8d4'
          default:
            return ''
        }
      }
      //
      let option = {}
      let sheetFilter = []
      let sheetHeader = []
      let columnWidths = []
      for (let h = 0; h < this.selectedHeaders.length; h++) {
        const header = this.selectedHeaders[h]
        if (header.exportable) {
          sheetFilter.push(header.value)
          sheetHeader.push(header.text)
          columnWidths.push(Number((header.width).replace('%', '')) + 1)
        }
      }
      let fileName = 'Отчет по обязательствам'
      option.fileName = fileName
      option.datas = []
      for (let i = 0; i < this.dataForTable.length; i++) {
        const sheet = this.dataForTable[i]
        let sheetData = JSON.parse(JSON.stringify(sheet.data))
        sheetData.sort((a, b) => a.Contract - b.Contract)
        for (let s = 0; s < sheetData.length; s++) {
          sheetData[s].Id = s + 1
          sheetData[s].Project = this.projectName(sheetData[s].Project)
          sheetData[s].Responsible = this.userName(sheetData[s].Responsible)
          sheetData[s].Deadline = sheetData[s].Deadline ? new Date(sheetData[s].Deadline).toLocaleDateString() : ''
          sheetData[s].EndDate = sheetData[s].EndDate ? new Date(sheetData[s].EndDate).toLocaleDateString() : ''
          sheetData[s].Subsystem = parseSubsystems(sheetData[s].Subsystems)
          sheetData[s].Status = this.getStatusName(Number(sheetData[s].Status))
        }
        option.datas.push({
          sheetData: sheetData,
          sheetName: `${sheet.Name} (${sheetData.length})`,
          sheetColor: sheetColor(sheet.Name),
          sheetFilter: sheetFilter,
          sheetHeader: sheetHeader,
          columnWidths: columnWidths
        })
      }
      // console.log(option)
      // const renderIntoImage = () => {
      //   const canvas = document.getElementById('myChart')
      //   const imgWrap = document.getElementById('imgWrap')
      //   var img = new Image();
      //   img.src = canvas.toDataURL()
      //   imgWrap.appendChild(img)
      //   canvas.style.display = 'none'
      // }
      this.chartsImages = []
      for (let i = 0; i < this.finalData.length; i++) {
        const canvas = document.getElementById('myChart' + i)
        this.chartsImages.push({
          url: canvas.toDataURL(),
          width: canvas.clientWidth,
          height: canvas.clientHeight
        })
      }
      //
      tableToExcel.toExcel(option, this.chartsImages, this.finalData)
      // const ExportJsonExcel = require('js-export-excel')
      // let toExcel = new ExportJsonExcel(option)
      // toExcel.saveExcel()
      //
      // const ExportJsonExcel = require('js-export-excel')
      // let fileName = 'Отчет по обязательствам'
      // let option = {}
      // option.fileName = fileName
      // let returnArr = []
      // for (let i = 0; i < this.dataForTable.length; i++) {
      //   const requirement = this.dataForTable[i]
      //   returnArr.push({
      //     // rowNumber: task.rowNumber,
      //     // Subject: task.Subject,
      //     // Link: `${this.taskUrl(task.PlanItem)}${task.Id}`,
      //     // Project: JSON.parse(task.Project).Name,
      //     // StartDate: new Date(task.StartDate.substr(0, 10)),
      //     // EndDate: new Date(task.EndDate.substr(0, 10)),
      //     // CreationDate: new Date(task.CreationDate.substr(0, 10)),
      //     // EndWorkDate: task.EndWorkDate ? new Date(task.EndWorkDate.substr(0, 10)) : '',
      //     // lag: task.lag,
      //     // planDays: task.planDays,
      //     // factDays: task.factDays,
      //     // diff: task.diff,
      //     // departmentId: JSON.parse(task.departmentId).Name,
      //     // Executor: task.Executor ? this.user(task.Executor) ? this.user(task.Executor).shortName : '' : ''
      //   })
      // }
      // //
      // option.datas = [
      //   {
      //     sheetData: returnArr,
      //     sheetName: 'Лист 1',
      //     sheetFilter: ['rowNumber', 'Subject', 'Link', 'Project', 'StartDate', 'EndDate', 'CreationDate', 'EndWorkDate', 'lag', 'planDays', 'factDays', 'diff', 'departmentId', 'Executor'],
      //     sheetHeader: ['№', 'Наименование', 'Ссылка', 'Проект', 'План. начало', 'План. завершение', 'Факт. начало', 'Факт. завершение', 'Задержка начала', 'План. длительность', 'Факт. длительность', 'Прирост задержки', 'Отдел', 'Исполнитель'],
      //     columnWidths: [2, 20, 4, 20, 5, 5, 5, 5, 5, 5, 5, 5, 10, 7]
      //   }
      //   // { // второй и последующий листы
      //   //   sheetData: returnArr
      //   // }
      // ]
      // var toExcel = new ExportJsonExcel(option)
      // toExcel.saveExcel()
    },
    isColumnVisible (column) {
      const find = this.allHeaders.find(f => f.value === column)
      if (find) {
        return find.visible
      } else {
        return true
      }
    },
    groupText (group, groupBy) {
      // console.log('groupText', group)
      if (groupBy[0] === 'Project') {
        // return `${this.selectedHeaders.find(f => f.value === groupBy[0]).text}: ${this.projects.find(f => f.Id === group).Name}`
        const find = this.projects.find(f => f.Id === group)
        if (find) {
          return find.Name
        } else {
          return ''
        }
      } else if (groupBy[0] === 'Status') {
        return this.getStatusName(Number(group))
      } else {
        return group
      }
    },
    isCanselGroupingVisible () {
      if (!this.groupedBy) {
        return false
      } else {
        if (Array.isArray(this.groupedBy) && this.groupedBy.length === 0) {
          return false
        } else {
          return true
        }
      }
    },
    groupingClick (item) {
      // this.groupedBy = null
      // console.log(item, this.groupedBy)
    },
    compleatedCount (data) {
      const find = data.find(f => f.Status === 3)
      if (find) {
        return find.data.length
      } else {
        return 0
      }
    },
    setCompleated (item) {
      const main = this.finalData.find(f => f.Name === item.Name)
      if (main) {
        let find = main.data.filter(f => f.Status === 3)
        if (find && find.length > 0) {
          find.push({
            Name: 'Все',
            Status: 100,
            data: find[0].data,
            order: 100,
            visible: true
          })
          // console.log('setCompleated', find)
          this.dataForTable = find
          this.isSetMarked.Name = main.Name + 'setCompleated'
          this.isSetMarked.marked = true
          this.requirementTitle = main.Name + ' - исполнено всего'
        } else {
          this.dataForTable = this.allTableData
          this.requirementTitle = ''
          this.isSetMarked.Name = ''
          this.isSetMarked.marked = false
        }
      } else {
        this.dataForTable = this.allTableData
        this.requirementTitle = ''
        this.isSetMarked.Name = ''
        this.isSetMarked.marked = false
      }
    },
    setPir (item) {
      const main = this.finalData.find(f => f.Name === item.Name)
      if (main) {
        let find = main.data.filter(f => f.Status === 6)
        if (find && find.length > 0) {
          find.push({
            Name: 'Все',
            Status: 100,
            data: find[0].data,
            order: 100,
            visible: true
          })
          // console.log('setPir', find)
          this.dataForTable = find
          this.isSetMarked.Name = main.Name + 'setPir'
          this.isSetMarked.marked = true
          this.requirementTitle = main.Name + ' - иициирована ПИР'
        } else {
          this.dataForTable = this.allTableData
          this.requirementTitle = ''
          this.isSetMarked.Name = ''
          this.isSetMarked.marked = false
        }
      } else {
        this.dataForTable = this.allTableData
        this.requirementTitle = ''
        this.isSetMarked.Name = ''
        this.isSetMarked.marked = false
      }
    },
    pirCount (data) {
      const findPir = data.find(f => f.Status === 6)
      let count = 0
      if (findPir) {
        count += findPir.data.length
      }
      return count
    },
    setShs (item) {
      const main = this.finalData.find(f => f.Name === item.Name)
      let find = main.data.find(f => f.Status === 5)
      if (find) {
        let filtered = find.data.filter(fi => fi.IsPenaltiesApplied)
        if (filtered && filtered.length > 0) {
          let newFiltered = JSON.parse(JSON.stringify(filtered))
          let newFind = JSON.parse(JSON.stringify(find))
          newFind.data = newFiltered
          this.isSetMarked.Name = main.Name + 'setShs'
          this.isSetMarked.marked = true
          // console.log('setShs', item)
          let newData = [newFind]
          newData.push({
            Name: 'Все',
            Status: 100,
            data: newFiltered,
            order: 100,
            visible: true
          })
          this.dataForTable = newData
          this.requirementTitle = main.Name + ' - просрочено (ШС)'
        } else {
          this.dataForTable = this.allTableData
          this.requirementTitle = ''
          this.isSetMarked.Name = ''
          this.isSetMarked.marked = false
        }
      } else {
        this.dataForTable = this.allTableData
        this.requirementTitle = ''
        this.isSetMarked.Name = ''
        this.isSetMarked.marked = false
      }
    },
    shsCount (data) {
      const findOverPir = data.find(f => f.Status === 5)
      let count = 0
      if (findOverPir) {
        const filteredPir = findOverPir.data.filter(f => f.IsPenaltiesApplied)
        if (filteredPir && filteredPir.length > 0) {
          count += filteredPir.length
        }
      }
      return count
    },
    setCompleatedOverdue (item) {
      const main = this.finalData.find(f => f.Name === item.Name)
      let find = main.data.find(f => f.Status === 3)
      if (find) {
        let filtered = find.data.filter(fi => fi.Delay > 0)
        if (filtered && filtered.length > 0) {
          let newFiltered = JSON.parse(JSON.stringify(filtered))
          let newFind = JSON.parse(JSON.stringify(find))
          newFind.data = newFiltered
          this.isSetMarked.Name = main.Name + 'setCompleatedOverdue'
          this.isSetMarked.marked = true
          // console.log('setCompleatedOverdue', item)
          let newData = [newFind]
          newData.push({
            Name: 'Все',
            Status: 100,
            data: newFiltered,
            order: 100,
            visible: true
          })
          this.dataForTable = newData
          this.requirementTitle = main.Name + ' - исполнено с просрочкой'
        } else {
          this.dataForTable = this.allTableData
          this.requirementTitle = ''
          this.isSetMarked.Name = ''
          this.isSetMarked.marked = false
        }
      } else {
        this.dataForTable = this.allTableData
        this.requirementTitle = ''
        this.isSetMarked.Name = ''
        this.isSetMarked.marked = false
      }
    },
    compleatedOverdueCount (data) {
      const find = data.find(f => f.Status === 3)
      if (find) {
        const filtered = find.data.filter(fi => fi.Delay > 0)
        if (filtered && filtered.length > 0) {
          return filtered.length
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    setInWork (item) {
      const main = this.finalData.find(f => f.Name === item.Name)
      if (main) {
        let find = main.data.filter(f => f.Status === 5 || f.Status === 2)
        if (find && find.length > 0) {
          let newData = []
          for (let f = 0; f < find.length; f++) {
            newData = newData.concat(find[f].data)
          }
          find.push({
            Name: 'Все',
            Status: 100,
            data: newData,
            order: 100,
            visible: true
          })
          // console.log('setInWork', find)
          this.dataForTable = find
          this.isSetMarked.Name = main.Name + 'setInWork'
          this.isSetMarked.marked = true
          this.requirementTitle = main.Name + ' - в работе всего'
        } else {
          this.dataForTable = this.allTableData
          this.requirementTitle = ''
          this.isSetMarked.Name = ''
          this.isSetMarked.marked = false
        }
      } else {
        this.dataForTable = this.allTableData
        this.requirementTitle = ''
        this.isSetMarked.Name = ''
        this.isSetMarked.marked = false
      }
    },
    inworkCount (data) {
      const find = data.filter(f => f.Status === 5 || f.Status === 2)
      if (find && find.length > 0) {
        let count = 0
        for (let i = 0; i < find.length; i++) {
          count += find[i].data.length
        }
        return count
      } else {
        return 0
      }
    },
    setOverdue (item) {
      const main = this.finalData.find(f => f.Name === item.Name)
      if (main) {
        const find = main.data.filter(f => f.Status === 5)
        if (find && find.length > 0) {
          find.push({
            Name: 'Все',
            Status: 100,
            data: find[0].data,
            order: 100,
            visible: true
          })
          // console.log('setOverdue', find)
          this.dataForTable = find
          this.isSetMarked.Name = main.Name + 'setOverdue'
          this.isSetMarked.marked = true
          this.requirementTitle = main.Name + ' - в работе просрочено'
        } else {
          this.dataForTable = this.allTableData
          this.requirementTitle = ''
          this.isSetMarked.Name = ''
          this.isSetMarked.marked = false
        }
      } else {
        this.dataForTable = this.allTableData
        this.requirementTitle = ''
        this.isSetMarked.Name = ''
        this.isSetMarked.marked = false
      }
    },
    overdueCount (data) {
      const find = data.find(f => f.Status === 5)
      if (find) {
        return find.data.length
      } else {
        return 0
      }
    },
    resetRequirements () {
      this.dataForTable = this.allTableData
      this.requirementTitle = ''
      this.isSetMarked.Name = ''
      this.isSetMarked.marked = false
    },
    togglePanel (item) {
      for (let i = 0; i < this.finalData.length; i++) {
        if (item.Name === this.finalData[i].Name) {
          this.finalData[i].visible = true
        } else {
          this.finalData[i].visible = false
        }
      }
      const find = this.finalData.filter(f => f.visible)
      if (find && find.length === 1) {
        this.dataForTable = find[0].data
        this.requirementTitle = find[0].Name
      } else {
        this.dataForTable = this.allTableData
        this.requirementTitle = 'Все обязательства'
      }
    },
    downloadPDF () {
      // this.$refs.contenttopdf.generatePdf()
      this.$refs.html2Pdf.generatePdf()
    },
    getUrl () {
      return 'http://' + window.location.hostname
    },
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
    projectName (val) {
      var res = this.projects.find(f => Number(f.Id) === Number(val))
      if (res) {
        return res.Name
      } else {
        return ''
      }
    },
    userName (val) {
      var res = this.users.find(f => Number(f.id) === Number(val))
      if (res) {
        return res.fullName
      } else {
        return ''
      }
    },
    statusName (val) {
      // switch (val)
    },
    check () {
      console.log('parseData: ', this.parseData)
    },
    testProject () {
      console.log(this.reportQuery.project)
    },
    async getReport () {
      function groupBy (list, keyGetter) {
        const map = new Map()
        list.forEach((item) => {
          const key = keyGetter(item)
          const collection = map.get(key)
          if (!collection) {
            map.set(key, [item])
          } else {
            collection.push(item)
          }
        })
        return map
      }
      this.loading = true
      utils.getReportRequirementsData(this.reportQuery)
        .then(async response => {
          try {
            let finalData = []
            utils.getFlatDataTable(response.data)
            // console.log('response: ', response)
            let consumerwasd = response.data.filter(f => f.IsProfitable && f.IsExternalExecutor) // Обязательства Заказчика перед WASD
            let wasdconsumer = response.data.filter(f => f.IsProfitable && !f.IsExternalExecutor) // Обязательства WASD перед Заказчиком
            let contractorwasd = response.data.filter(f => !f.IsProfitable && f.IsExternalExecutor) // Обязательства Подрядчика перед WASD
            let wasdcontractor = response.data.filter(f => !f.IsProfitable && !f.IsExternalExecutor) // Обязательства WASD перед Подрядчиком
            // Обязательства Заказчика перед WASD
            if (consumerwasd && consumerwasd.length > 0) {
              let consumerwasddata = []
              let consumerwasdgrouped = groupBy(consumerwasd, item => item.Status)
              let allConsumerwasd = []
              const uniqueStatusesConsumerwasd = [...new Set(consumerwasd.map(item => item.Status))]
              if (Array.isArray(uniqueStatusesConsumerwasd) && uniqueStatusesConsumerwasd.length > 0) {
                for (let i = 0; i < uniqueStatusesConsumerwasd.length; i++) {
                  consumerwasddata.push({
                    Status: Number(uniqueStatusesConsumerwasd[i]),
                    Name: this.getStatusName(Number(uniqueStatusesConsumerwasd[i])),
                    data: consumerwasdgrouped.get(Number(uniqueStatusesConsumerwasd[i])),
                    order: Number(uniqueStatusesConsumerwasd[i]),
                    visible: true
                  })
                  allConsumerwasd = [...allConsumerwasd, ...consumerwasdgrouped.get(Number(uniqueStatusesConsumerwasd[i]))]
                }
                consumerwasddata.push({
                  Status: 100,
                  Name: this.getStatusName(100),
                  data: allConsumerwasd,
                  order: 100,
                  visible: true
                })
              }
              finalData.push({ Name: 'Обязательства Заказчика перед WASD', data: consumerwasddata.sort((a, b) => a.order - b.order), Count: consumerwasd.length, visible: false, icon: 'fas fa-caret-square-down' })
            }
            // Обязательства WASD перед Заказчиком
            if (wasdconsumer && wasdconsumer.length > 0) {
              let wasdconsumerdata = []
              let wasdconsumergrouped = groupBy(wasdconsumer, item => item.Status)
              let allwasdconsumer = []
              const uniqueStatuseswasdconsumer = [...new Set(wasdconsumer.map(item => item.Status))]
              if (Array.isArray(uniqueStatuseswasdconsumer) && uniqueStatuseswasdconsumer.length > 0) {
                for (let i = 0; i < uniqueStatuseswasdconsumer.length; i++) {
                  wasdconsumerdata.push({
                    Status: Number(uniqueStatuseswasdconsumer[i]),
                    Name: this.getStatusName(Number(uniqueStatuseswasdconsumer[i])),
                    data: wasdconsumergrouped.get(Number(uniqueStatuseswasdconsumer[i])),
                    order: Number(uniqueStatuseswasdconsumer[i]),
                    visible: true
                  })
                  allwasdconsumer = [...allwasdconsumer, ...wasdconsumergrouped.get(Number(uniqueStatuseswasdconsumer[i]))]
                }
                wasdconsumerdata.push({
                  Status: 100,
                  Name: this.getStatusName(100),
                  data: allwasdconsumer,
                  order: 100,
                  visible: true
                })
              }
              finalData.push({ Name: 'Обязательства WASD перед Заказчиком', data: wasdconsumerdata.sort((a, b) => a.order - b.order), Count: wasdconsumer.length })
            }
            // Обязательства Подрядчика перед WASD
            if (contractorwasd && contractorwasd.length > 0) {
              let contractorwasddata = []
              let wasdconsumergrouped = groupBy(contractorwasd, item => item.Status)
              let allContractorwasd = []
              const uniqueStatusescontractorwasd = [...new Set(contractorwasd.map(item => item.Status))]
              if (Array.isArray(uniqueStatusescontractorwasd) && uniqueStatusescontractorwasd.length > 0) {
                for (let i = 0; i < uniqueStatusescontractorwasd.length; i++) {
                  contractorwasddata.push({
                    Status: Number(uniqueStatusescontractorwasd[i]),
                    Name: this.getStatusName(Number(uniqueStatusescontractorwasd[i])),
                    data: wasdconsumergrouped.get(Number(uniqueStatusescontractorwasd[i])),
                    order: Number(uniqueStatusescontractorwasd[i]),
                    visible: true
                  })
                  allContractorwasd = [...allContractorwasd, ...wasdconsumergrouped.get(Number(uniqueStatusescontractorwasd[i]))]
                }
                contractorwasddata.push({
                  Status: 100,
                  Name: this.getStatusName(100),
                  data: allContractorwasd,
                  order: 100,
                  visible: true
                })
              }
              finalData.push({ Name: 'Обязательства Подрядчика перед WASD', data: contractorwasddata.sort((a, b) => a.order - b.order), Count: contractorwasd.length })
            }
            // Обязательства WASD перед Подрядчиком
            if (wasdcontractor && wasdcontractor.length > 0) {
              let wasdcontractordata = []
              let wasdcontractorgrouped = groupBy(wasdcontractor, item => item.Status)
              let allwasdcontractor = []
              const uniqueStatuseswasdcontractor = [...new Set(wasdcontractor.map(item => item.Status))]
              if (Array.isArray(uniqueStatuseswasdcontractor) && uniqueStatuseswasdcontractor.length > 0) {
                for (let i = 0; i < uniqueStatuseswasdcontractor.length; i++) {
                  wasdcontractordata.push({
                    Status: Number(uniqueStatuseswasdcontractor[i]),
                    Name: this.getStatusName(Number(uniqueStatuseswasdcontractor[i])),
                    data: wasdcontractorgrouped.get(Number(uniqueStatuseswasdcontractor[i])),
                    order: Number(uniqueStatuseswasdcontractor[i]),
                    visible: true
                  })
                  allwasdcontractor = [...allwasdcontractor, ...wasdcontractorgrouped.get(Number(uniqueStatuseswasdcontractor[i]))]
                }
                wasdcontractordata.push({
                  Status: 100,
                  Name: this.getStatusName(100),
                  data: allwasdcontractor,
                  order: 100,
                  visible: true
                })
              }
              finalData.push({ Name: 'Обязательства WASD перед Подрядчиком', data: wasdcontractordata.sort((a, b) => a.order - b.order), Count: wasdcontractor.length })
            }

            console.log(finalData)
            this.finalData = finalData
            this.$store.dispatch('setRequirementsFullData', finalData)

            let grouped = groupBy(response.data, item => item.Status)
            let allData = []
            let allSubData = []
            const uniqueStatuses = [...new Set(response.data.map(item => item.Status))]
            if (Array.isArray(uniqueStatuses) && uniqueStatuses.length > 0) {
              for (let i = 0; i < uniqueStatuses.length; i++) {
                allData.push({
                  Status: Number(uniqueStatuses[i]),
                  Name: this.getStatusName(Number(uniqueStatuses[i])),
                  data: grouped.get(Number(uniqueStatuses[i])),
                  order: Number(uniqueStatuses[i]),
                  visible: true
                })
                allSubData = [...allSubData, ...grouped.get(Number(uniqueStatuses[i]))]
              }
              allData.push({
                Status: 100,
                Name: this.getStatusName(100),
                data: allSubData,
                order: 100,
                visible: true
              })
            }
            this.allTableData = allData.sort((a, b) => a.order - b.order)
            console.log('getReportRequirementsData: ', allData.sort((a, b) => a.order - b.order))
            this.$store.dispatch('setDataForTable', allData.sort((a, b) => a.order - b.order))
            this.loading = false
            this.panel = []
            this.createChart()
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
      // console.log(this.users)
    }
  }
}
</script>

<style scoped>
  .summary {
    border-collapse: collapse;
    border-color: #9ABAD9;
    border-spacing: 0;
  }
  .summary td {
    background-color: #EBF5FF;
    border-color: #9ABAD9;
    border-style: solid;
    border-width: 1px; color: #444;
    font-family: Arial, sans-serif;
    font-size: 14px;
    overflow: hidden;
    padding: 5px 5px;
    word-break:normal;
  }
  .summary th {
    background-color: #409cff;
    border-color: #9ABAD9;
    border-style: solid;
    border-width: 1px;
    color: #fff;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
    overflow: hidden;
    padding: 10px 5px;
    word-break: normal;
  }

  .summaryrows {
    text-align: left;
    vertical-align:middle;
  }
  .summaryheaders {
    text-align: center;
    vertical-align: middle;
  }
  .basil {
    background-color: #FFFBE6 !important;
  }
  .basil--text {
    color: #356859 !important;
  }
  .tablemain {
    padding: 0 0px !important;
  }
  .tablecontent {
    font-size: 11px;
    text-decoration: none;
  }
  .tableheaders {
    font-size: 11px !important;
    text-align: center !important;
    text-decoration: none;
    font-weight: normal !important;
  }
  .alldataheaders {
    text-align: center !important;
    border-left: solid 1px #9ABAD9;
    border-top: solid 1px #9ABAD9;
  }
  .allmaindataheaders {
    text-align: center !important;
    font-weight: normal !important;
    border-left: solid 1px #9ABAD9;
  }
  .summarycell {
    cursor: pointer;
  }
  .summarycell:hover {
    background-color: #9abad98c;
  }
</style>
<style>
  .v-data-table>.v-data-table__wrapper>table>tbody>tr>td, .v-data-table>.v-data-table__wrapper>table>tbody>tr>th, .v-data-table>.v-data-table__wrapper>table>tfoot>tr>td, .v-data-table>.v-data-table__wrapper>table>tfoot>tr>th, .v-data-table>.v-data-table__wrapper>table>thead>tr>td, .v-data-table>.v-data-table__wrapper>table>thead>tr>th {
    padding: 0 5px !important;
  }
</style>
