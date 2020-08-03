<template>
  <div id="pageHome">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg8 sm12 xs12>
          <plain-table></plain-table>
        </v-flex>
        <v-flex lg4 sm12 xs12>
          <v-widget title="Задачи" content-bg="white">
            <v-btn icon slot="widget-header-action">
              <v-icon class="text--secondary">fa fa-refresh</v-icon>
            </v-btn>
            <div slot="widget-content">
              <!-- <v-col
                class="text-left"
                cols="12" sm="4"
              >
                <div class="my-2">
                  <v-btn text small :to="`/projectplan/${10710}`">План проекта</v-btn>
                </div>
              </v-col>
              <v-col
                v-for="key in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                :key="key"
                class="text-left"
                cols="12" sm="4"
              >
                <div class="my-2">
                  <v-btn text small to="portfolio">Портфель проектов</v-btn>
                </div>
              </v-col> -->
            </div>
          </v-widget>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import VWidget from '@/components/VWidget'
import PlainTable from '@/components/widgets/list/PlainTable'

export default {
  components: {
    VWidget,
    PlainTable
  },
  data: () => ({
  //
  })
}
</script>
