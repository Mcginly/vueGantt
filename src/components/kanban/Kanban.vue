<template>
  <div>
    <v-row
      dense
      class="pa-2"
    >
      <draggable
        group="all-board"
        v-model="categories"
        tag="v-row"
        :animation="300"
        ghost-class="moving-card"
        handle=".handlecategories"
        @change="log"
      >
        <v-col
          v-for="c in categories"
          :key="c.order"
          cols="sm"

        >
          <v-card
            rounded
            :color="c.color + ' lighten-5'"
          >
            <v-app-bar
              flat
              dense
              :color="c.color + ' lighten-3'"
              class="handlecategories"
            >
              <!-- <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon> -->
              <v-toolbar-title class="body-1 text--primary pl-0">
                {{ c.name }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-grey lighten-1"
                small
                icon
              >
                <v-icon small>fa fa-pencil</v-icon>
              </v-btn>
            </v-app-bar>
            <v-card-text class="pa-1">
              <draggable
                group="all-cards"
                v-model="c.tasks"
                :animation="300"
                ghost-class="moving-card"
                handle=".handlecards"
                @change="log"
              >
                <v-card
                  v-for="t in c.tasks"
                  :key="t.id"
                  class="pa-1 mt-2"
                  outlined
                >
                  <v-app-bar
                    flat
                    dense
                    :color="c.color + ' lighten-4'"
                    height="30"
                    class="pa-0 handlecards"
                  >
                    <!-- <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon> -->
                    <v-toolbar-title :class="t.status === 1 ? `text-decoration-line-through body-2 text--disabled pl-0` : `body-2 text--primary pl-0`">
                      {{ t.name }}
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-card-text class="pa-1">
                    {{ t.description }}
                  </v-card-text>
                  <v-divider />
                  <v-card-actions class="pa-0">
                    <v-chip
                      class="ma-2"
                      :color="t.status == 1 ? '' : checkDate(t) === 0 ? 'success' : checkDate(t) === 1 ? 'warning' : 'error'"
                      :disabled="t.status == 1"
                      outlined
                      small
                    >
                      {{ t.finish.toLocaleDateString() }}
                    </v-chip>
                    <v-spacer />
                    <v-btn
                      color="blue-grey lighten-1"
                      small
                      icon
                    >
                      <v-icon small>fa fa-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      color="blue-grey lighten-1"
                      small
                      icon
                    >
                      <v-icon small>fa fa-trash-o</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </draggable>
            </v-card-text>
            <v-divider />
            <v-card-actions class="pa-0">
              <v-spacer />
              <v-btn
                color="blue-grey lighten-1"
                small
                icon
              >
                <v-icon small>fa fa-plus-square-o</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <!-- <v-btn slot="header">Add</v-btn> -->
      </draggable>
    </v-row>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  data: () => ({
    categories: [
      // { order: 0, name: 'Потребности', color: 'grey lighten-3' },
      { order: 1,
        name: 'К обсуждению',
        color: 'yellow',
        tasks: [
          { order: 0, name: 'Задача 1', description: 'Описание очень нужной задачи 1', finish: new Date('2020-11-28 18:00:00'), status: 0 },
          { order: 1, name: 'Задача 2', description: 'Описание очень нужной задачи 2', finish: new Date('2020-11-20 18:00:00'), status: 1 },
          { order: 2, name: 'Задача 3', description: 'Описание очень нужной задачи 3', finish: new Date('2020-11-23 18:00:00'), status: 0 },
          { order: 3, name: 'Задача 4', description: 'Описание очень нужной задачи 4', finish: new Date('2020-11-24 18:00:00'), status: 0 },
          { order: 4, name: 'Задача 5', description: 'Описание очень нужной задачи 5', finish: new Date('2020-11-24 18:00:00'), status: 1 }
        ] },
      // { order: 2, name: 'Документирование', color: 'yellow', tasks: [
      //   { order: 1, name: 'Задача 1' }
      // ] },
      { order: 3, name: 'В работе', color: 'teal', tasks: [] },
      { order: 4, name: 'Тестирование', color: 'purple', tasks: [] },
      { order: 5, name: 'На доработку', color: 'red', tasks: [] },
      { order: 6, name: 'Готово', color: 'green', tasks: [] }
    ]
  }),
  methods: {
    log (value) {
      console.log(value)
      // if (value.added) {
      //   value.added.element.order = value.added.newIndex
      // }
      // if (value.moved) {
      //   value.moved.element.order = value.moved.newIndex
      // }
      // console.log(this.categories)
    },
    checkDate (item) {
      let dateTask = new Date(item.finish).setHours(0, 0, 0, 0)
      let dateNow = new Date().setHours(0, 0, 0, 0)
      if (dateNow.valueOf() < dateTask.valueOf()) {
        return 0
      } else {
        if (dateNow.valueOf() === dateTask.valueOf()) {
          return 1
        } else {
          return 2
        }
      }
    }
  }
}
</script>

<style>
  .moving-card {
    opacity: 0.5;
    background: rgba(128, 128, 128, 0.247);
  }
  .handlecategories {
    cursor: move;
  }
  .handlecards {
    cursor: move;
  }
</style>
