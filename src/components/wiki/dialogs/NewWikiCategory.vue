<template>
  <div class="text-center">
    <v-dialog
      v-model="dialogNewCatWiki"
      width="700"
      @click:outside="clear()"
    >
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="headline wasdmedium white--text">
            Создание новой категории
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newCategory.name"
              label="Наименование"
              :rules="[v => !!v || 'Введите наименование']"
              outlined
              dense
              required
              class="mt-3"
            />
            <v-text-field
              v-model="selectedCategory"
              label="Родительская категория"
              :rules="[v => !!v || 'Выберите категорию']"
              class="mt-4"
              readonly
              dense
              required
            />
            <v-expansion-panels
              v-model="categoryPanel"
              focusable
              multiple
              class="mt-0"
            >
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Выберите родительскую категорию
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-treeview
                    :items="wikiCategories"
                    :active.sync="active"
                    hoverable
                    activatable
                    color="wasdlight"
                    dense
                    open-all
                  >
                    <template v-slot:prepend="{ item }">
                      <v-icon
                        v-if="(item.children && item.children.length > 0) || item.icon"
                        v-text="`${item.icon ? item.icon : 'fa fa-folder-open'}`"
                        :color="item.color"
                      ></v-icon>
                    </template>
                    <template v-slot:label="{ item }">
                      <div @click="log(item)">{{ item.name }}</div>
                    </template>
                  </v-treeview>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-expansion-panels
              v-model="iconPanel"
              focusable
              multiple
            >
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Иконка категории
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-select
                    v-model="newCategory.icon"
                    :items="wikiIcons"
                    label="Иконка категории"
                    hint="Если не выбрать, то для родителей применится иконка по умолчанию"
                    persistent-hint
                    outlined
                    dense
                    class="mt-3"
                  >
                    <template v-slot:prepend>
                      <v-icon :color="newCategory.color">
                        {{ newCategory.icon }}
                      </v-icon>
                    </template>
                    <template v-slot:item="{ item }">
                      <v-icon>
                        {{ item }}
                      </v-icon>
                    </template>
                  </v-select>
                  <v-color-picker
                    v-model="color"
                    class="ma-2"
                    show-swatches
                    swatches-max-height="300px"
                    @input="changeColor()"
                  ></v-color-picker>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="wasdmedium"
              dark
              @click="create()"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import utils from '../../../config/utils'

export default {
  name: 'newWikiCategory',
  data: () => ({
    newCategory: {
      name: null,
      color: null,
      icon: null,
      parent: null
    },
    active: [],
    categoryPanel: [0],
    iconPanel: [],
    valid: true,
    selectedCategory: null,
    colorType: 'hex',
    hex: '#767576'
  }),
  computed: {
    ...mapFields([
      'dialogNewCatWiki',
      'wikiCategories',
      'wikiFlatCategories',
      'wikiActiveCategory'
    ]),
    ...mapGetters([
      'users',
      'user',
      'wikiIcons'
    ]),
    color: {
      get () {
        return this.newCategory ? this.newCategory.color ? this.newCategory.color : this.hex : this.hex
      },
      set (v) {
        this.hex = v
        this.newCategory.color = v
      }
    },
    showColor () {
      if (typeof this.color === 'string') return this.color
      return JSON.stringify(Object.keys(this.color).reduce((color, key) => {
        color[key] = Number(this.color[key].toFixed(2))
        return color
      }, {}), null, 2)
    }
  },
  methods: {
    changeColor () {
      this.newCategory.color = this.showColor
    },
    log (item) {
      this.newCategory.parent = item.id
      this.selectedCategory = item.name
    },
    create () {
      this.$refs.form.validate()
      if (this.$refs.form.validate() && this.newCategory.parent) {
        // this.clear()
        // this.dialogNewCatWiki = false
        const currUserId = this.users.find(f => f.login === this.user)
        const text = `INSERT INTO public.categories(name, creator, updater, "dateCreated", "dateUpdated", icon, description, color, parent) VALUES ($1, $2, null, NOW(), null, $3, null, $4, $5) RETURNING *;`
        const values = [this.newCategory.name, Number(currUserId.id), this.newCategory.icon, this.newCategory.color, this.newCategory.parent]
        utils.insertWikiAny({ text, values })
          .then(r => {
            console.log(r)
            if (r.error) {
              this.$store.dispatch('setError', `${r.message}: ${r.data}`)
            } else {
              this.updateCategies(Number(r.data[0].id))
            }
          })
          .catch(err => {
            console.log(err)
            this.$store.dispatch('setError', `${err.stack}`)
          })
      } else {
        this.$store.dispatch('setError', `Заполните обязательные поля`)
      }
    },
    clear () {
      this.newCategory.name = null
      this.newCategory.color = null
      this.newCategory.icon = null
      this.newCategory.parent = null
      this.active = []
      this.categoryPanel = [0]
      this.selectedCategory = null
      this.color = '#767576'
      this.iconPanel = []
      this.$refs.form.resetValidation()
    },
    updateCategies (newId) {
      utils.getWikiCategories()
        .then(r => {
          if (r.error) {
            this.$store.dispatch('setError', `${r.message}: ${r.data}`)
            this.clear()
            this.dialogNewCatWiki = false
          } else {
            this.wikiCategories = r.data
            this.wikiFlatCategories = r.flat
            this.wikiActiveCategory.pop()
            this.wikiActiveCategory.push(newId)
            this.$store.dispatch('setSuccess', `Новая категория - ${this.newCategory.name}`)
            this.clear()
            this.dialogNewCatWiki = false
          }
        })
        .catch(e => {
          this.$store.dispatch('setError', `${e.stack}`)
          console.log(e)
        })
    }
  }
}
</script>
