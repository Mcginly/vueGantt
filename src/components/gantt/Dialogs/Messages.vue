<template>
  <div>
    <template v-if="error">
      <v-snackbar
        color="error"
        :multi-line="true"
        :timeout="15000"
        @input="closeError"
        :value="true">
        {{ error }}
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
          dark
          @click="closeError"
        >
          <v-icon small>fa fa-times</v-icon>
        </v-btn>
      </v-snackbar>
    </template>
    <template v-if="success">
      <v-snackbar
        color="success"
        :multi-line="true"
        :timeout="15000"
        @input="closeSuccess"
        :value="true">
        {{ success }}
        <v-btn
          small
          icon
          rounded
          depressed
          class="mx-0"
          dark
          @click="closeSuccess"
        >
          <v-icon small>fa fa-times</v-icon>
        </v-btn>
      </v-snackbar>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'messages',
  computed: {
    ...mapGetters([
      'error',
      'success'
    ])
  },
  methods: {
    closeError () {
      this.$store.dispatch('clearError')
    },
    closeSuccess () {
      this.$store.dispatch('setSuccess', null)
    }
  }
}
</script>
