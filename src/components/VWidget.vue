<template>
  <div id="v-widget">
    <v-card>
      <v-app-bar color="blue-grey lighten-5" flat dense v-if="enableHeader">
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <slot name="widget-header-action"></slot>
      </v-app-bar>
      <v-divider v-if="enableHeader"></v-divider>
      <v-card-text :class="contentBg">
        <slot name="widget-content"></slot>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'VWidget',
  props: {
    title: {
      type: String,
      default: ''
    },
    enableHeader: {
      type: Boolean,
      default: true
    },
    contentBg: {
      type: String,
      default: 'white'
    }
  },
  data () {
    return {}
  },
  computed: {}
}
</script>
