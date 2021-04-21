<template>
  <v-app id="mainappdiv">
    <v-btn
      v-if="isUserLoggedIn && isUserAdmin"
      fab
      falt
      fixed
      class="setting-fab rounded-r-xl"
      color="wasd"
      @click="openThemeSettings"
    >
      <v-icon small>fa fa-angle-right</v-icon>
    </v-btn>
    <!-- правое меню -->
    <v-navigation-drawer
      v-model="drawerRight"
      app
      clipped
      right
      fixed
      temporary
      width="300"
      v-if="isUserLoggedIn"
    >
      <rightMenu />
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-right
      color="wasd"
      class="elevation-1"
    >
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <div class="d-flex align-center">
        <v-img
          style="cursor: pointer;"
          alt="wasd Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo_start_main.png"
          transition="scale-transition"
          width="156"
          @click.stop="drawer = !drawer"
        />
        <!-- <h4 class="display-0">АО "WASD"</h4> -->
      </div>
      <v-spacer />
      <div class="d-flex align-center justify-end" v-if="isUserLoggedIn">
        <v-tooltip bottom :open-delay="500">
          <template v-slot:activator="{ on, attrs }">
            <h4 class="display-0" v-html="pageHeader" v-on="on" v-bind="attrs">
            </h4>
          </template>
          <span> {{ getPublicAuthorAndDate() }} </span>
        </v-tooltip>
      </div>

      <v-spacer />
      <v-menu v-if="isUserLoggedIn" offset-y>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom :open-delay="500">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon large v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <v-avatar size="30px">
                  <img :src="avatar()" />
                </v-avatar>
              </v-btn>
            </template>
            <span>{{ userLdap ? userLdap.fullName : '' }}</span>
          </v-tooltip>
        </template>
        <v-list class="pa-0">
          <v-list-item @click.stop="logout()">
            <v-list-item-action>
              <v-icon>fa fa-sign-out</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Выход</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-tooltip v-if="isUserLoggedIn" bottom :open-delay="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            @click="handleFullScreen()"
          >
            <v-icon>{{ !expanded ? 'fa fa-expand' : 'fa fa-compress' }}</v-icon>
          </v-btn>
        </template>
        <span>Развернуть на весь экран</span>
      </v-tooltip>

      <!-- <v-btn
        icon
        @click="drawerRight = !drawerRight"
        v-if="isUserLoggedIn"
      >
        <v-icon>{{ !drawerRight ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right' }}</v-icon>
      </v-btn> -->

      <v-btn
        icon
        @click="toggleToolbar()"
        v-if="isUserLoggedIn"
      >
        <v-icon>{{ !showToolbar ? 'fa fa-angle-double-down' : 'fa fa-angle-double-up' }}</v-icon>
      </v-btn>
      <template v-slot:extension v-if="showToolbar">
        <ganttTopMenu v-if="$route.params.plan_id" />
        <wikiTopMenu v-if="$route.name === 'wiki'" />
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      absolute
      temporary
      v-if="isUserLoggedIn && isUserAdmin"
    >
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <span>Главное меню</span>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item :disabled="$route.name === 'home'" @click="toHome()">
          <v-list-item-action>
            <v-icon>fa fa-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Главная страница</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <span>Отчеты</span>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item :disabled="$route.name === 'requirements'" @click="toRequirements()">
          <v-list-item-action>
            <v-icon>fas fa-file-contract</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Отчет по обязательствам</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item :disabled="$route.name === 'wiki'" @click="toWiki()">
          <v-list-item-action>
            <v-icon>fa fa-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>База знаний</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>

    <!-- <v-card>
      <ganttTopMenu />
    </v-card> -->

    <!-- <v-main class="ml-3 mr-2 mb-0 mt-1">
      <ganttTopMenu />
    </v-main> -->
    <!-- <div dense style="margin-top: 65px; margin-bottom: -60px;">
      <ganttTopMenu />
    </div> -->
    <v-main class="ml-3 mr-2 mb-2 mt-2">
      <router-view />
    </v-main>

    <!-- <v-navigation-drawer
      v-model="right"
      fixed
      right
      temporary
    /> -->
    <messages />
    <!-- <template v-if="error">
      <v-snackbar
        color="error"
        :multi-line="true"
        :timeout="5000"
        @input="closeError"
        :value="true">
        {{ error }}
        <v-btn
          text
          @click="closeError">
          Закрыть
        </v-btn>
      </v-snackbar>
    </template>

    <template v-if="success">
      <v-snackbar
        color="success"
        :multi-line="true"
        :timeout="5000"
        @input="closeSuccess"
        :value="true">
        {{ success }}
        <v-btn
          text
          @click="closeSuccess">
          Закрыть
        </v-btn>
      </v-snackbar>
    </template> -->

    <v-footer
      app
      inset
      color="wasd"
    >
      <span v-if="loading && readyForImport" style="color: #616161;">{{ `Записано элементов: ${importCount} из ${taskCount}` }}</span>
      <span v-else style="color: #616161;">{{ taskCount ? `Задач на плане: ${taskCount} из ${allTasksCount}` : '' }}</span>
      <v-spacer />
      <span class="caption" style="color: #616161;">WASD &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import rightMenu from './components/RightMenu'
import utils from './config/utils'
import config from './config/config'
import ganttTopMenu from './components/gantt/GanttTopMenu'
import wikiTopMenu from './components/wiki/WikiTopMenu'
import messages from './components/gantt/Dialogs/Messages'
// eslint-disable-next-line
import { gantt } from 'dhtmlx-gantt'

export default {
  name: 'wasdview',
  components: {
    rightMenu,
    ganttTopMenu,
    wikiTopMenu,
    messages
  },
  data: () => ({
    drawer: false,
    // drawerRight: false,
    right: false,
    left: false,
    expanded: false
  }),
  computed: {
    ...mapGetters([
      'loading',
      'isUserLoggedIn',
      // 'error',
      'pageHeader',
      // 'success',
      'user',
      'userLdap',
      'isUserAdmin',
      'users',
      'showToolbar',
      'taskCount',
      'allTasksCount',
      'readyForImport',
      'importCount',
      'publicAuthor',
      'publicDate'
    ]),
    ...mapFields([
      'drawerRight'
    ])
  },
  async beforeCreate () {
    try {
      const projects = await utils.getProjects()
      if (!this.users) {
        const users = await utils.getUsersSQL()
        this.$store.dispatch('setUsers', users)
        const currentUser = users.find(f => f.login === this.user)
        this.$store.dispatch('setUserLdap', currentUser)
      } else {
        const currentUser = this.users.find(f => f.login === this.user)
        this.$store.dispatch('setUserLdap', currentUser)
      }
      this.$store.dispatch('setProjects', projects.data)
      // console.log(projects.data)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    // taskCount () {
    //   if (gantt) {
    //     return gantt.getVisibleTaskCount()
    //   } else {
    //     return ''
    //   }
    // },
    getPublicAuthorAndDate () {
      if (this.users !== null) {
        var pUser = this.users.find(f => Number(f.id) === Number(this.publicAuthor))
        var date = new Date(this.publicDate).toLocaleDateString()
        if (pUser) {
          var result = `Автор публикации: ${pUser.fullName}, дата публикации: ${date}`
          return result
        } else {
          return ` `
        }
      }
      // if (find) {
      //   return find.shortName
      // } else {
      //   return ''
      // }
    },
    toggleToolbar () {
      this.$store.dispatch('setShowToolbar', !this.showToolbar)
      this.$nextTick(() => {
        gantt.refreshData()
        gantt.render()
      })
    },
    avatar () {
      return this.userLdap ? config.wasd_API + this.userLdap.avatar : `${config.wasd_API}Content/Images/x120/nophoto_120.gif`
    },
    handleFullScreen () {
      utils.toggleFullScreen()
      this.expanded = !this.expanded
    },
    toHome () {
      this.$store.dispatch('setPageHeader', '')
      window.location.href = '/'
      // console.log(this.$route.name)
    },
    toRequirements () {
      window.location.href = '/reports/requirements'
    },
    toWiki () {
      // this.$store.dispatch('setPageHeader', 'WIKI')
      window.location.href = '/wiki'
      // console.log(this.$route.name)
    },
    openThemeSettings () {
      this.$vuetify.goTo(0)
      this.drawer = !this.drawer
    },
    rightMenu () {
      this.right = !this.right
    },
    logout () {
      this.drawer = false
      this.drawerRight = false
      this.right = false
      this.left = false
      this.$cookie.delete('user_id')
      this.$store.dispatch('clearUser')
      this.$store.dispatch('setPortfolio', null)
      this.$store.dispatch('setPageHeader', '')
      this.$router.push('/login?loginError')
    }
  }
}
</script>

<style scoped>
.setting-fab {
  top: 40% !important;
  left: 0;
  border-radius: 0;
  max-width: 16px;
  width: 16px;
  height: 80px;
  max-height: 80px;
}
</style>
