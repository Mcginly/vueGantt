<template>
  <div v-if="dialogExportPdf">
    <v-row
      justify="center"
    >
      <v-dialog
        v-model="dialogExportPdf"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
        @click:outside="dialogExportPdf = false"
      >
        <v-card tile>
          <v-card-title class="headline wasdmedium">
            <v-btn
              icon
              dark
              class="mr-3"
              @click="dialogExportPdf = false"
            >
              <v-icon>fa fa-times</v-icon>
            </v-btn>
            <div class="white--text">Настройки экспорта в PDF</div>
            <v-spacer />
            <v-btn
              class="mr-3"
              @click.native="exportToPdf()"
            >
              <v-icon color="red darken-3" class="mr-3">fas fa-file-pdf</v-icon>
              Сохранить
            </v-btn>
          </v-card-title>
          <v-card-text>
            <!-- Настройки экспорта -->
            <v-row>
              <v-card flat width="100%">
                <v-card-title>
                  Выберите формат и размер листа
                </v-card-title>
                <v-card-text>
                  <!-- ориентация -->
                  <v-row class="d-flex align-center">
                    <v-btn-toggle
                      v-model="orientation"
                      color="wasdmedium"
                      class="mr-5"
                    >
                      <v-btn value="portrait">
                        <v-icon class="mr-2" color="wasdmedium">far fa-file-image</v-icon>
                        Портрет
                      </v-btn>
                      <v-btn value="landscape">
                        <v-icon class="mr-2" color="wasdmedium">far fa-image</v-icon>
                        Альбом
                      </v-btn>
                    </v-btn-toggle>
                    <v-btn-toggle
                      v-model="sizes"
                      color="wasdmedium"
                      class="ml-5"
                    >
                      <v-btn value="A4">
                        A4
                      </v-btn>
                      <v-btn value="A3">
                        A3
                      </v-btn>
                      <v-btn value="A2">
                        A2
                      </v-btn>
                      <v-btn value="A1">
                        A1
                      </v-btn>
                      <v-btn value="A0">
                        A0
                      </v-btn>
                    </v-btn-toggle>
                    <v-text-field
                      v-model="filename"
                      label="Имя файла (заголовок отчета)"

                      hide-details
                      color="wasdmedium"
                      clearable
                      class="mr-5 ml-5"
                    />
                  </v-row>
                </v-card-text>
              </v-card>
            </v-row>
            <!-- Таблица -->
            <v-data-table
              v-if="dialogExportPdf"
              dense
              :headers="pdfheaders"
              id="table_100"
              ref="table_100"
              hide-default-header
              :hide-default-footer="hideFooter"
              :options="{ itemsPerPage: pdftable.length }"
              :items="pdftable"
              item-key="Id"
              style="width: 100%;"
              class="tablemain"
              calculate-widths
              :search="reqsearch"
              :group-by="groupedBy"
              show-group-by
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
                  </tr>
                </thead>
              </template>
              <template v-slot:[`group.header`]="{ group, groupBy, headers, isOpen, items }">
                <th :colspan="headers.length">
                  <v-row dense>
                    <v-btn icon small class="mr-2 ml-2">
                      <v-icon>{{ isOpen ? 'fas fa-angle-up' : 'fas fa-angle-down' }}</v-icon>
                    </v-btn>
                    <span class="ml-3 title">{{ `(${items.length}) ${groupText(group, groupBy)}` }}</span>
                    <v-spacer />
                  </v-row>
                </th>
              </template>
              <template v-slot:[`item.Id`]="{ item }">
                <span class="tablecontent pa-0"> {{ pdftable.indexOf(item) + 1 }} </span>
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
              <template v-slot:[`item.DepVerificationUser`]="{ item }">
                <span class="tablecontent" v-html="getResult(item)" />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
//
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import htmlToPdfmake from 'html-to-pdfmake'

export default {
  props: {
    pdftable: {
      type: Array,
      default: null
    },
    pdfheaders: {
      type: Array,
      default: null
    },
    filename: {
      type: String,
      default: 'Отчет по обязательствам'
    }
  },
  components: {
    // VueHtml2pdf
  },
  data: () => ({
    orientation: 'landscape',
    sizes: 'A3',
    itemsPerPage: 10,
    hideFooter: true
  }),
  computed: {
    ...mapGetters([
      'projects',
      'users',
      'userLdap',
      'allContractors'
    ]),
    ...mapFields([
      'requirementTitle',
      'dialogExportPdf',
      'allHeaders',
      'groupedBy',
      'reqsearch'
    ]),
    computedDate () {
      if (this.reportQuery.date) {
        return new Date(this.reportQuery.date).toLocaleDateString()
      } else {
        return ''
      }
    }
  },
  methods: {
    async exportToPdf () {
      if (this.filename === '' || !this.filename) {
        this.$store.dispatch('setError', 'Введите имя файла')
        this.dialogExportPdf = true
      } else {
        try {
          // this.itemsPerPage = this.pdftable.length
          // this.hideFooter = true
          //
          pdfMake.vfs = pdfFonts.pdfMake.vfs
          let html = htmlToPdfmake(document.getElementById('table_100').innerHTML)
          for (let i = 0; i < html[0].stack[0].table.body[0].length; i++) {
            let element = html[0].stack[0].table.body[0][i]
            element.bold = false
            element.fillColor = '#6CACE4'
            // element.cellBorder = 1
            // element.borderColor = ['#9ABAD9', '#9ABAD9', '#9ABAD9', '#9ABAD9']
          }
          html[0].stack[0].table.headerRows = 1
          html[0].stack[0].table.dontBreakRows = true
          //
          // console.log(this.userLdap.shortName)
          html[0].stack[0].layout = 'example'
          html[0].stack.unshift({
            text: this.filename,
            fontSize: 14,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10]
          })
          html[0].stack.push({
            text: 'Подготовил: ' + this.userLdap.shortName,
            fontSize: 10,
            bold: false,
            alignment: 'left',
            margin: [20, 30, 0, 0]
          })
          // for (let t = 1; t < html[0].stack[0].table.body.length; t++) {
          //   let row = html[0].stack[0].table.body[t]
          //   for (let r = 0; r < row.length; r++) {
          //     let element = row[r]
          //     element.cellBorder = 1
          //     element.borderColor = ['#9ABAD9', '#9ABAD9', '#9ABAD9', '#9ABAD9']
          //   }
          // }
          //
          let tableLayouts = {
            example: {
              // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              // paddingLeft: function(i, node) { return 4; },
              // paddingRight: function(i, node) { return 4; },
              // paddingTop: function(i, node) { return 2; },
              // paddingBottom: function(i, node) { return 2; },
              // fillColor: function (rowIndex, node, columnIndex) { return null; }
              fillColor: function (rowIndex, node, columnIndex) {
                return (rowIndex === 0) ? '#6CACE4' : ''
              },
              hLineWidth: function (i, node) {
                return 1
              },
              vLineWidth: function (i) {
                return 1
              },
              vLineColor: function (i) {
                return '#9ABAD9'
              },
              hLineColor: function (i) {
                return '#9ABAD9'
              },
              paddingLeft: function (i) {
                return 1
              },
              paddingRight: function (i, node) {
                return 0
              }
            }
          }
          //
          const styles = {
            'v-row-group__header': {
              fontSize: 8,
              bold: false
            },
            tablecontent: {
              fontSize: 8,
              // cellBorder: 1,
              // border: [false, true, false, false],
              bold: false
            },
            tableheaders: {
              fontSize: 8,
              alignment: 'center',
              // cellBorder: 1,
              // border: [false, true, false, false],
              bold: false
            },
            alldataheaders: {
              fontSize: 8,
              bold: false,
              alignment: 'center'
              // cellBorder: 1,
              // border: [false, true, false, false],
              // borderColor: ['#9abad9', '#9abad9', '#9abad9', '#9abad9']
              // 'border-top': 'solid 1px #9ABAD9'
            },
            allmaindataheaders: {
              fontSize: 8,
              // cellBorder: 1,
              color: 'white',
              // background: '#6cace4',
              // fillColor: '#6cace4',
              alignment: 'center',
              bold: false
              // borderColor: ['#9abad9', '#9abad9', '#9abad9', '#9abad9'],
              // border: [false, false, false, true]
              // 'border-left': 'solid 1px #9ABAD9'
            }
          }
          var dd = {
            content: html,
            styles: styles,
            pageOrientation: this.orientation,
            pageSize: this.sizes,
            pageMargins: [ 10, 25, 10, 25 ],
            footer: function (currentPage, pageCount) {
              return [
                {
                  text: 'страница ' + currentPage.toString() + ' из ' + pageCount,
                  fontSize: 7,
                  bold: false,
                  alignment: 'right',
                  margin: [0, 5, 20, 0]
                }
              ]
            }
          } // defaultStyle: { fontSize: 9, bold: false }
          // console.log(dd)
          let now = new Date()
          pdfMake.createPdf(dd, tableLayouts).download(this.filename + '.pdf', cb => {
            console.log(new Date() - now)
            this.$store.dispatch('setSuccess', `Файл "${this.filename + '.pdf'}" сохранен. `)
            // chrome.downloads.search({ limit: 100 }, function (data) {
            //   console.log(data)
            //   // data.forEach(function (item, i) {
            //   //   document.getElementById('download' + i).innerHTML = this.filename + '.pdf'
            //   // })
            // })
          })
          //
          // this.itemsPerPage = 10
          // this.hideFooter = false
        } catch (error) {
          console.log(error)
          // this.itemsPerPage = 10
          // this.hideFooter = false
        }
      }
    },
    getUrl () {
      return 'http://' + window.location.hostname
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
      if (groupBy[0] === 'Project') {
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
    downloadPDF () {
      this.$refs.html2Pdf.generatePdf()
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
