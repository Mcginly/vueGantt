<template>
  <v-app>
    <v-btn
      v-if="isUserLoggedIn"
      fab
      dark
      falt
      fixed
      class="setting-fab rounded-r-xl"
      color="primary"
      @click="openThemeSettings"
    >
      <v-icon small>fa fa-angle-right</v-icon>
    </v-btn>
    <v-navigation-drawer
      v-model="drawerRight"
      app
      clipped
      right
      width="300"
      v-if="isUserLoggedIn"
    >
      <rightMenu />
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-right
      color="primary"
      dark
    >
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <div class="d-flex align-center">
        <v-img
          style="cursor: pointer;"
          alt="WASD Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo_start_main.png"
          transition="scale-transition"
          width="156"
          @click.stop="drawer = !drawer"
        />
        <!-- <h4 class="display-0">АО "РАСУ"</h4> -->
      </div>
      <v-spacer />
      <div class="d-flex align-center justify-end" v-if="isUserLoggedIn">
        <h4 class="display-0">
          {{ pageHeader }}
        </h4>
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

      <v-btn
        icon
        @click="drawerRight = !drawerRight"
        v-if="isUserLoggedIn"
      >
        <v-icon>{{ !drawerRight ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right' }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="toggleToolbar()"
        v-if="isUserLoggedIn"
      >
        <v-icon>{{ !showToolbar ? 'fa fa-angle-double-down' : 'fa fa-angle-double-up' }}</v-icon>
      </v-btn>
      <template v-slot:extension v-if="showToolbar">
        <ganttTopMenu />
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      absolute
      temporary
      v-if="isUserLoggedIn"
    >
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <span>Главное меню</span>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item to="/" @click="toHome()">
          <v-list-item-action>
            <v-icon>fa fa-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Главная страница</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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

    <v-navigation-drawer
      v-model="right"
      fixed
      right
      temporary
    />

    <template v-if="error">
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
    </template>

    <v-footer
      app
      inset
      color="primary"
      class="white--text"
    >
      <span>РАСУ</span>
      <v-spacer />
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import rightMenu from './components/RightMenu'
import utils from './config/utils'
import config from './config/config'
import ganttTopMenu from './components/gantt/GanttTopMenu'
// eslint-disable-next-line
import { gantt } from 'dhtmlx-gantt'

export default {
  name: 'biview',
  components: {
    rightMenu,
    ganttTopMenu
  },
  data: () => ({
    drawer: false,
    drawerRight: false,
    right: false,
    left: false,
    expanded: false
  }),
  computed: {
    ...mapGetters([
      'loading',
      'isUserLoggedIn',
      'error',
      'pageHeader',
      'success',
      'user',
      'userLdap',
      'users',
      'showToolbar'
    ])
  },
  async beforeCreate () {
    try {
      const projects = await utils.getProjects()
      const users = await utils.getUsersSQL()
      this.$store.dispatch('setUsers', users)
      this.$store.dispatch('setProjects', projects.data)
      const currentUser = users.find(f => f.login === this.user)
      this.$store.dispatch('setUserLdap', currentUser)
      // console.log(currentUser)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    toggleToolbar () {
      this.$store.dispatch('setShowToolbar', !this.showToolbar)
      this.$nextTick(() => {
        gantt.refreshData()
        gantt.render()
      })
    },
    avatar () {
      return this.userLdap ? config.WASD_API + this.userLdap.avatar : `${config.WASD_API}Content/Images/x120/nophoto_120.gif`
    },
    handleFullScreen () {
      utils.toggleFullScreen()
      this.expanded = !this.expanded
    },
    toHome () {
      this.$store.dispatch('setPageHeader', '')
    },
    openThemeSettings () {
      this.$vuetify.goTo(0)
      this.drawer = !this.drawer
    },
    rightMenu () {
      this.right = !this.right
    },
    closeError () {
      this.$store.dispatch('clearError')
    },
    closeSuccess () {
      this.$store.dispatch('setSuccess', null)
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
