<template>
  <v-card>
    <v-app-bar flat dense color="blue-grey lighten-5">
      <v-toolbar-title>
        <v-icon
          class="mr-2"
          color="wasddark"
        >
          fa fa-tasks
        </v-icon>
        Текущие проекты
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-outer-icon="fa fa-search"
        label="поиск..."
        single-line
        hide-details
        clearable
        solo
        background-color="grey lighten-5"
        flat
        dense
        clear-icon="fa fa-times"
      />
    </v-app-bar>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <template>
        <v-data-table
          :headers="headers"
          :items="projects"
          :search="search"
          item-key="Id"
          class="elevation-0"
          @click:row="rowClick"
        >
          <template v-slot:[`item.action`]="{ item }">
            <span>
              <v-tooltip bottom :open-delay="500">
                <template v-slot:activator="{ on, attrs }">
                  <!-- <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="goToPlan(item)"
                  >
                    <img
                      :src="getPlanImage()"
                      :width="16"
                      :height="16"
                    />
                  </v-btn> -->
                  <a
                    :href="`/projectplan/${item.CurrentPlan}/all`"
                    style="text-decoration: none;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <img
                      :src="getPlanImage()"
                      :width="16"
                      :height="16"
                    />
                  </a>
                </template>
                <span>Открыть текущий план проекта</span>
              </v-tooltip>
            </span>
          </template>
          <template v-slot:[`item.Name`]="{ item }">
            <span>
              {{ item.Name }}
            </span>
          </template>
          <template v-slot:[`item.StartDate`]="{ item }">
            <span class="caption">
              {{ new Date(item.StartDate).toLocaleDateString() }}
            </span>
          </template>
          <template v-slot:[`item.FinishDate`]="{ item }">
            <span class="caption">
              {{ new Date(item.FinishDate).toLocaleDateString() }}
            </span>
          </template>
          <template v-slot:[`item.PlanObject`]="{ item }">
            <v-tooltip bottom :open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <a
                  :href="`/projectplan/${item.CurrentPlan}/all`"
                  style="text-decoration: none;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span class="caption">{{ parsePlanObject(item.PlanObject).Name }}</span>
                </a>
              </template>
              <span>{{ planObjectInfo(parsePlanObject(item.PlanObject)) }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.CompletePercent`]="{ item }">
            <span class="caption">{{ item.CompletePercent + '%' }}</span>
            <v-tooltip right :open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <v-progress-linear
                  :value="item.CompletePercent"
                  height="6"
                  color="green"
                  v-bind="attrs"
                  v-on="on"
                >
                  <!-- {{ Math.ceil(item.CompletePercent) }}% -->
                </v-progress-linear>
              </template>
              <span>{{ item.CompletePercent + '%' }}</span>
            </v-tooltip>
          </template>
          <!-- /Modules/wasd.wasd.Projects.Web/Content/Images/x16/project_plan.png  /Modules/wasd.wasd.Projects.Web/Content/Images/x16/projects.png -->
          <template v-slot:[`item.href`]="{ item }">
            <span>
              <v-tooltip bottom :open-delay="500">
                <template v-slot:activator="{ on, attrs }">
                  <a
                    :href="getProjectUrl(item)"
                    target="_blank"
                    style="text-decoration: none;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon small>fa fa-external-link</v-icon>
                  </a>
                </template>
                <span>Открыть проект в wasd</span>
              </v-tooltip>
            </span>
          </template>
        </v-data-table>
      </template>
      <v-divider></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '../../../config/config'
export default {
  data () {
    return {
      search: '',
      headers: [
        { text: '', value: 'action', align: 'right', sortable: false, width: 40 },
        { text: 'Наименование', align: 'left', sortable: false, value: 'Name' },
        { text: 'Начало', align: 'left', sortable: false, value: 'StartDate' },
        { text: 'Завершение', align: 'left', sortable: false, value: 'FinishDate' },
        { text: 'План', align: 'right', value: 'PlanObject', sortable: false, width: 120 },
        { text: 'Прогресс', value: 'CompletePercent', sortable: false },
        { text: '', value: 'href', align: 'left', sortable: false, width: 40 }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'projects',
      'users'
    ])
  },
  methods: {
    // goToPlan (item) {
    //   // this.$store.dispatch('setPageHeader', item.Name)
    //   // this.$router.go(`/projectplan/${item.CurrentPlan}`)
    //   // this.$router.push({ path: `/projectplan/${item.CurrentPlan}` })
    //   this.$router.push({ name: 'plan', params: { plan_id: item.CurrentPlan } })
    // },
    rowClick (item) {
      // let hexStr = `0001000000FFFFFFFF01000000000000000401000000B00153797374656D2E436F6C6C656374696F6E732E4F626A6563744D6F64656C2E436F6C6C656374696F6E60315B5B456C65576973652E454C4D412E4D6F64656C2E54797065732E50726F7065727479436F6D70617265446174612C20456C65576973652E454C4D412E53444B2C2056657273696F6E3D312E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D636232396430346563613962303331645D5D01000000056974656D7303A60153797374656D2E436F6C6C656374696F6E732E47656E657269632E4C69737460315B5B456C65576973652E454C4D412E4D6F64656C2E54797065732E50726F7065727479436F6D70617265446174612C20456C65576973652E454C4D412E53444B2C2056657273696F6E3D312E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D636232396430346563613962303331645D5D09020000000C0300000053456C65576973652E454C4D412E53444B2C2056657273696F6E3D312E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D636232396430346563613962303331640402000000A60153797374656D2E436F6C6C656374696F6E732E47656E657269632E4C69737460315B5B456C65576973652E454C4D412E4D6F64656C2E54797065732E50726F7065727479436F6D70617265446174612C20456C65576973652E454C4D412E53444B2C2056657273696F6E3D312E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D636232396430346563613962303331645D5D03000000065F6974656D73055F73697A65085F76657273696F6E0400002E456C65576973652E454C4D412E4D6F64656C2E54797065732E50726F7065727479436F6D70617265446174615B5D030000000808090400000002000000020000000704000000000100000004000000042C456C65576973652E454C4D412E4D6F64656C2E54797065732E50726F7065727479436F6D706172654461746103000000090500000009060000000D0205050000002C456C65576973652E454C4D412E4D6F64656C2E54797065732E50726F7065727479436F6D7061726544617461040000001D3C50726F7065727479477569643E6B5F5F4261636B696E674669656C641A3C436C617373477569643E6B5F5F4261636B696E674669656C64203C4F6C6450726F7065727479446174613E6B5F5F4261636B696E674669656C64203C4E657750726F7065727479446174613E6B5F5F4261636B696E674669656C64030307070B53797374656D2E477569640B53797374656D2E4775696402020300000004F9FFFFFF0B53797374656D2E477569640B000000025F61025F62025F63025F64025F65025F66025F67025F68025F69025F6A025F6B00000000000000000000000807070202020202020202F833286761A3E544A184395B5DCA6E8501F8FFFFFFF9FFFFFF79404020D94968409DE54ECD2C7508680909000000090A00000001060000000500000001F5FFFFFFF9FFFFFF5D2E4DA7BCE0494C8D0260C7A8A6E46801F4FFFFFFF9FFFFFF79404020D94968409DE54ECD2C750868090D000000090E0000000F090000008F010000020001000000FFFFFFFF01000000000000000C0200000053456C65576973652E454C4D412E53444B2C2056657273696F6E3D312E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D636232396430346563613962303331640501000000EE01456C65576973652E454C4D412E53657269616C697A6174696F6E2E53657269616C697A61626C6544696374696F6E61727960325B5B53797374656D2E537472696E672C206D73636F726C69622C2056657273696F6E3D342E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D623737613563353631393334653038395D2C5B53797374656D2E4F626A6563742C206D73636F726C69622C2056657273696F6E3D342E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D623737613563353631393334653038395D5D02000000046B6579300676616C75653001010200000006030000000D5374617274576F726B446174650604000000000B0F0A000000A2010000020001000000FFFFFFFF01000000000000000C0200000053456C65576973652E454C4D412E53444B2C2056657273696F6E3D312E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D636232396430346563613962303331640501000000EE01456C65576973652E454C4D412E53657269616C697A6174696F6E2E53657269616C697A61626C6544696374696F6E61727960325B5B53797374656D2E537472696E672C206D73636F726C69622C2056657273696F6E3D342E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D623737613563353631393334653038395D2C5B53797374656D2E4F626A6563742C206D73636F726C69622C2056657273696F6E3D342E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D623737613563353631393334653038395D5D02000000046B6579300676616C75653001010200000006030000000D5374617274576F726B4461746506040000001330372F31322F323032302031353A30373A30320B0F0D00000087010000020001000000FFFFFFFF01000000000000000C0200000053456C65576973652E454C4D412E53444B2C2056657273696F6E3D312E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D636232396430346563613962303331640501000000EE01456C65576973652E454C4D412E53657269616C697A6174696F6E2E53657269616C697A61626C6544696374696F6E61727960325B5B53797374656D2E537472696E672C206D73636F726C69622C2056657273696F6E3D342E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D623737613563353631393334653038395D2C5B53797374656D2E4F626A6563742C206D73636F726C69622C2056657273696F6E3D342E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D623737613563353631393334653038395D5D02000000046B6579300676616C75653001020200000006030000000A5461736B5374617475730A0B0F0E0000008D010000020001000000FFFFFFFF01000000000000000C0200000053456C65576973652E454C4D412E53444B2C2056657273696F6E3D312E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D636232396430346563613962303331640501000000EE01456C65576973652E454C4D412E53657269616C697A6174696F6E2E53657269616C697A61626C6544696374696F6E61727960325B5B53797374656D2E537472696E672C206D73636F726C69622C2056657273696F6E3D342E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D623737613563353631393334653038395D2C5B53797374656D2E4F626A6563742C206D73636F726C69622C2056657273696F6E3D342E302E302E302C2043756C747572653D6E65757472616C2C205075626C69634B6579546F6B656E3D623737613563353631393334653038395D5D02000000046B6579300676616C75653001010200000006030000000A5461736B537461747573060400000001330B0B`
      // const buf = Buffer.from(hexStr, 'hex')
      // const parsedText = buf.toString('utf8')
      // const percent = parsedText.lastIndexOf('CompletePercent') !== -1 ? parsedText.substring(parsedText.lastIndexOf('CompletePercent'), parsedText.length) : ''
      // console.log(percent, percent.replace(/\D+/g, ''))
      console.log(item)
    },
    parsePlanObject (obj) {
      return JSON.parse(obj)
    },
    planObjectInfo (obj) {
      let publicAuthor = this.users.find(f => Number(f.id) === Number(obj.PublicAuthor))
      if (publicAuthor) {
        return `Опубликован ${new Date(obj.PublicDate).toLocaleDateString()} (${publicAuthor.fullName})`
      } else {
        return ''
      }
    },
    getPlanImage () {
      let address = window.location.hostname === 'localhost' ? config.wasd_API : 'http://' + window.location.hostname + '/'
      // return config.wasd_API + 'Modules/wasd.wasd.Projects.Web/Content/Images/x16/project_plan.png'
      return address + 'Modules/wasd.wasd.Projects.Web/Content/Images/x16/project_plan.png'
    },
    getProjectUrl (item) {
      let address = window.location.hostname === 'localhost' ? config.wasd_API : 'http://' + window.location.hostname + '/'
      // return config.wasd_API + 'Projects/Project/Index/' + item.Id
      return address + 'Projects/Project/AllInfo/' + item.Id
    }
  }
}
</script>
