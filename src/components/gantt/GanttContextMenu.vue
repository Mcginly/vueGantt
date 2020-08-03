<template>
  <div>
    <nav id="context-menu" class="context-menu">
      <ul class="context-menu__items">
        <li class="context-menu__item">
          <div class="context-menu__link" data-action="view"><i class="fa fa-eye" aria-hidden="true"></i><span data-action="view" class="context-menu__span" style="color: #606266; font-size: 14px !important; font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif; font-weight: 400; -webkit-font-smoothing: antialiased;">{{`  просмотр`}}</span></div>
        </li>
        <!-- <li class="context-menu__item">
          <div class="context-menu__link" data-action="edit"><i class="el-icon-edit"></i><span style="color: #606266; font-size: 14px; font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif; font-weight: 400; -webkit-font-smoothing: antialiased;">{{`  редактировать`}}</span></div>
        </li> -->
        <hr style="width: 100%; color: #606266;" v-if="predecessor || successor">
        <li class="context-menu__item" v-if="predecessor">
          <div class="context-menu__link" data-action="predecessor"><i class="fa fa-arrow-up" aria-hidden="true"></i><span data-action="predecessor" class="context-menu__span" style="color: #606266; font-size: 14px !important; font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif; font-weight: 400; -webkit-font-smoothing: antialiased;">{{`  предшественники`}}</span></div>
          <!-- <div v-else class="context-menu__link" style="cursor: context-menu;" data-action="predecessor"><i class="el-icon-top-left"></i><span style="color: #606266; font-size: 14px; font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif; font-weight: 400; -webkit-font-smoothing: antialiased;">{{`  предшественник`}}</span></div> -->
        </li>
        <li class="context-menu__item" v-if="successor">
          <div class="context-menu__link" data-action="successor"><i class="fa fa-arrow-down" aria-hidden="true"></i><span data-action="successor" class="context-menu__span" style="color: #606266; font-size: 14px !important; font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif; font-weight: 400; -webkit-font-smoothing: antialiased;">{{`  последователи`}}</span></div>
        </li>
        <!-- <hr style="width: 75%; color: #606266;"> -->
        <!-- <li class="context-menu__item">
          <div class="context-menu__link" data-action="delete"><i class="el-icon-delete" style="color: red;"></i><span style="color: #606266; font-size: 14px; font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif; font-weight: 400; -webkit-font-smoothing: antialiased;">{{`  удалить`}}</span></div>
        </li> -->
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ganttContextMenu',
  data () {
    return {
      style: null,
      ctxMenuData: null,
      ctxMenuRect: null
    }
  },
  mounted () {
    // Listen on contextmenu event through the $root instance
    this.$root.$on('contextmenu', data => {
      // if the data is null reset and handler the action
      if (data === null) this.resetCtx()
      else this.onContextMenu(data.event, data.ctxMenuData)
    })
  },
  beforeDestroy () {
    this.$root.$off('contextmenu', () => {})
  },
  computed: {
    ...mapGetters([
      'predecessor',
      'successor',
      'predecessorsTasks',
      'successorsTask'
    ])
  },
  methods: {
    onContextMenu (ev, ctxMenuData) {
      // prevent default behaviours
      ev.preventDefault()
      ev.stopPropagation()
      this.ctxMenuData = ctxMenuData
      this.ctxMenuRect = {
        x: ev.x,
        y: ev.y
      }
      // populate the option
      this.onData()
      // then reevaluate and set context-menu position
      this.reevaluatePosition()
    },
    async reevaluatePosition () {
      if (this.ctxMenuRect) {
        // using $nextTick to daley and make sure that the context-menu
        // options are fully rendered which will help us
        // to get the accurate height
        await this.$nextTick()
        await this.$nextTick()
        let { x, y } = this.ctxMenuRect
        // get the window current inner height and width
        let { innerHeight, innerWidth } = window
        // get the component height and width through element.getClientRects
        console.log(this.$el)
        let height = 500
        let width = 500
        // let { height, width } = this.$el.getBoundingClientRect()[0]; //getBoundingClientRect getClientRects
        // then subtract window inner height and width with
        // context-menu event source points (x, y)
        let dY = innerHeight - y
        let dX = innerWidth - x
        // check if the context-menu height is not
        // longer than the available
        if (dY < height) {
          y = y - height
        }
        if (dX < width) {
          x = x - width
        }
        // set the position
        this.style = { left: x + 'px', top: y + 'px' }
      }
    },
    async onData () {
      // validate if the ctxMenuData is an array and the lenght is not less then 1
      if (Array.isArray(this.ctxMenuData) && this.ctxMenuData.length) {
        await this.$nextTick()
        // loop through the options
        this.ctxMenuData.forEach((item, index) => {
          // if this option type is equal's to divider and the handler property value is a function
          if (item.type !== 'divider' && typeof item.handler === 'function') {
            // select the option element with the help of the refs id
            let refs = this.$refs['ctx_' + index]
            // accessing $refs prooerty with object square bracket notation alwasys returns arrays of
            // HTML Elements of Vue components instance
            // so you have to validate
            if (Array.isArray(refs)) {
              let el = refs[0]
              console.log(el)
              // then attach click event and pass an arrow function as a the
              // event handler callback
              el.addEventListener('click', () => {
                // then on click on the option
                // envoke the handler
                // and reset the the ctxMenuData to hide the context-menu
                item.handler()
                this.resetCtx()
              },
              false
              )
            }
          }
        })
      }
    }
  }
}
</script>

<style>
  .context-menu {
    display: none;
    position: absolute;
    z-index: 1000000;
    padding: 2px 0;
    width: 240px;
    background-color: #f4f2ea;
    border: solid 1px #dfdfdf;
    box-shadow: 1px 1px 2px #cfcfcf;
  }
  .context-menu--active {
    display: block;
  }
  .context-menu__items {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .context-menu__item {
    display: block;
    margin-bottom: 1px;
  }
  .context-menu__item:last-child {
    margin-bottom: 0;
  }
  .context-menu__link {
    font-size: 14px !important;
    cursor: context-menu;
    display: block;
    padding: 2px 8px;
    text-decoration: none;
  }
  .context-menu__link:hover {
    color: #fff;
    background-color: #0066aa2f;
  }
</style>
