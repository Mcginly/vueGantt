<template>
  <div id="v-ganttapp" class="ganttview">
    <v-overlay
      :value="loading"
    >
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
    <ganttContextMenu />
    <ganttView />
    <ganttTaskDialog />
  </div>
  <!-- <ganttView /> -->
</template>

<script>
import { mapGetters } from 'vuex'
import ganttView from './GanttView'
import ganttContextMenu from './GanttContextMenu'
import ganttTaskDialog from './GanttTaskDialog'

export default {
  name: 'GanttApp',
  components: {
    ganttView,
    ganttContextMenu,
    ganttTaskDialog
  },
  props: {
    planId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'loading'
    ])
  },
  mounted () {
    console.log(this.$route.params.plan_id)
    this.$emit('plan_id', this.$route.params.plan_id)
    this.$store.dispatch('setPlanId', this.$route.params.plan_id)
  }
}
</script>

<style>
.ganttview {
  height: 100%;
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-button {
  background-image: url('');
  background-repeat: no-repeat;
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-track {
  background-color:#ecedee;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.082);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.082);
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 0px;
  border-radius: 0px;
  background-color: #8a8a8a;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #b3b3b3;
  cursor: pointer;
}

::-webkit-resizer {
  background-image: url('');
  background-repeat: no-repeat;
  width: 0px;
  height: 0px;
}
</style>
