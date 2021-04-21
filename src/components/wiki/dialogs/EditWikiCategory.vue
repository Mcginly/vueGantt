<template>
  <div class="text-center">
    <v-dialog
      v-model="dialogEditCatWiki"
      width="700"
      @click:outside="clear()"
    >
      <v-form
        v-if="editedWikiCategory"
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="headline wasdmedium white--text">
            Редактирование категории
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editedWikiCategory.name"
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
              :rules="[v => (!!v || editedWikiCategory.id ===1) || 'Выберите категорию']"
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
                    :active.sync="parent"
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
                    v-model="editedWikiCategory.icon"
                    :items="wikiIcons"
                    label="Иконка категории"
                    hint="Если не выбрать, то для родителей применится иконка по умолчанию"
                    persistent-hint
                    outlined
                    dense
                    class="mt-3"
                  >
                    <template v-slot:prepend>
                      <v-icon :color="editedWikiCategory.color">
                        {{ editedWikiCategory.icon }}
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
  name: 'editWikiCategory',
  data: () => ({
    newCategory: {
      name: null,
      color: null,
      icon: null,
      parent: null
    },
    active: [],
    categoryPanel: [],
    iconPanel: [],
    valid: true,
    selectedCategory: null,
    colorType: 'hex',
    hex: '#767576'
    // hex: () => {
    //   return this.editedWikiCategory ? this.editedWikiCategory.color ? this.editedWikiCategory.color : '#767576' : '#767576'
    // }
  }),
  computed: {
    ...mapFields([
      'dialogEditCatWiki',
      'wikiCategories',
      'wikiFlatCategories',
      'wikiActiveCategory',
      'editedWikiCategory'
    ]),
    ...mapGetters([
      'users',
      'user',
      'wikiIcons'
    ]),
    parent: {
      get () {
        if (this.editedWikiCategory.parent) {
          // eslint-disable-next-line
          this.selectedCategory = this.wikiFlatCategories.find(f => Number(f.id) === Number(this.editedWikiCategory.parent)).name
        }
        return [this.editedWikiCategory.parent]
      },
      set (v) {
        // console.log(v)
        // console.log(this.wikiFlatCategories.find(f => Number(f.id)=== Number(v[0])))
        this.selectedCategory = this.wikiFlatCategories.find(f => Number(f.id) === Number(v[0])).name
        this.editedWikiCategory.parent = v[0]
      }
    },
    color: {
      get () {
        return this.editedWikiCategory ? this.editedWikiCategory.color ? this.editedWikiCategory.color : this.hex : this.hex
      },
      set (v) {
        this.hex = v
        this.editedWikiCategory.color = v
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
      // this.editedWikiCategory.color = this.showColor
    },
    log (item) {
      // this.editedWikiCategory.parent = item.id
      // this.selectedCategory = item.name
    },
    create () {
      this.$refs.form.validate()
      if (this.$refs.form.validate() && this.editedWikiCategory.parent) {
        // console.log(this.editedWikiCategory)
        // this.clear()
        // this.dialogEditCatWiki = false
        const currUserId = this.users.find(f => f.login === this.user)
        const text = `UPDATE public.categories SET name=$1, updater=$2, "dateUpdated"=NOW(), icon=$3, description=null, color=$4, parent=$5 WHERE id=$6 RETURNING *;`
        const values = [this.editedWikiCategory.name, Number(currUserId.id), this.editedWikiCategory.icon, this.editedWikiCategory.color, this.editedWikiCategory.parent, this.editedWikiCategory.id]
        // console.log({ text, values })
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
      // this.newCategory.name = null
      // this.newCategory.color = null
      // this.newCategory.icon = null
      // this.newCategory.parent = null
      this.active = []
      this.categoryPanel = []
      this.selectedCategory = null
      this.color = '#767576'
      this.iconPanel = []
      this.editedWikiCategory = null
      this.$refs.form.resetValidation()
    },
    updateCategies (newId) {
      utils.getWikiCategories()
        .then(r => {
          if (r.error) {
            this.$store.dispatch('setError', `${r.message}: ${r.data}`)
            this.clear()
            this.dialogEditCatWiki = false
          } else {
            this.wikiCategories = r.data
            this.wikiFlatCategories = r.flat
            // this.wikiActiveCategory.pop()
            // this.wikiActiveCategory.push(newId)
            this.$store.dispatch('setSuccess', `Категория обновлена - ${this.editedWikiCategory.name}`)
            this.clear()
            this.dialogEditCatWiki = false
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
