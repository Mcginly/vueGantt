<template>
  <div>
    <v-row
      justify="center"
    >
      <v-dialog
        v-model="dialogNewWikiArticle"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
        @click:outside="clear()"
      >
        <v-card tile>
          <!-- <v-toolbar
            flat
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="dialogNewWikiArticle = false"
            >
              <v-icon>fa fa-times</v-icon>
            </v-btn>
            <v-toolbar-title>Новая статья</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="dialogNewWikiArticle = false"
              >
                Сохранить
              </v-btn>
            </v-toolbar-items>
          </v-toolbar> -->

          <v-card-title class="headline wasdmedium">
            <v-btn
              icon
              dark
              class="mr-3"
              @click="clear(); dialogNewWikiArticle = false"
            >
              <v-icon>fa fa-times</v-icon>
            </v-btn>
            <div class="white--text">Новая статья</div>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="newArticle.name"
                label="Наименование"
                :rules="[v => !!v || 'Введите наименование']"
                outlined
                dense
                required
                class="mt-3"
              />
              <v-text-field
                v-model="selectedCategory"
                label="Выбранная категория"
                :rules="[v => (!!v || selectedCategory) || 'Выберите категорию']"
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
                    Выберите категорию
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
              <!-- <div class="editor"></div> -->
              <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" :disabled="false" @input="onEditorInput" />
            </v-form>
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
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
import utils from '../../../config/utils'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import '../../../styles/styles.css'

export default {
  name: 'newWikiArticleAdd',
  components: {
    // TiptapVuetify
  },
  data: () => ({
    editor: ClassicEditor,
    editorData: '',
    editorConfig: {
      toolbar: {
        items: [
          'removeFormat',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'alignment',
          'fontFamily',
          'fontSize',
          'fontColor',
          'fontBackgroundColor',
          'highlight',
          '|',
          'indent',
          'outdent',
          '|',
          'superscript',
          'subscript',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'imageUpload',
          'blockQuote',
          'insertTable',
          'code',
          'codeBlock',
          'todoList',
          'horizontalLine',
          '|',
          'undo',
          'redo'
        ],
        language: 'ru',
        image: {
          toolbar: [
            'imageTextAlternative',
            'linkImage'
          ]
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableCellProperties',
            'tableProperties'
          ]
        }
      },
      codeBlock: {
        languages: [
          { language: 'plaintext', label: 'Простой текст', class: 'css' },
          { language: 'cs', label: 'C#', class: 'cs' },
          { language: 'javascript', label: 'JS', class: 'javascript' },
          { language: 'sql', label: 'SQL', class: 'sql' },
          { language: 'css', label: 'CSS', class: 'css' },
          { language: 'html', label: 'HTML', class: 'html' },
          { language: 'json', label: 'JSON', class: 'json' },
          { language: 'xml', label: 'XML', class: 'xml' }
        ]
      }
    },
    newArticle: {
      name: null,
      color: null,
      icon: null,
      category: null
    },
    // active: [],
    categoryPanel: [],
    iconPanel: [],
    valid: true,
    selectedCategory: null,
    colorType: 'hex',
    hex: '#767576'
  }),
  computed: {
    ...mapFields([
      'dialogNewWikiArticle',
      'wikiCategories',
      'wikiFlatCategories',
      'wikiActiveCategory',
      'editedWikiCategory'
    ]),
    ...mapGetters([
      'users',
      'user'
    ]),
    active: {
      get () {
        // if (this.editedWikiCategory.parent) {
        //   // eslint-disable-next-line
        //   this.selectedCategory = this.wikiFlatCategories.find(f => Number(f.id) === Number(this.editedWikiCategory.parent)).name
        // }
        // console.log(this.newArticle.category)
        return [this.newArticle.category]
      },
      set (v) {
        // console.log(v)
        this.newArticle.category = v[0]
      }
    }
  },
  methods: {
    onEditorInput (data) {
      // console.log(data)
    },
    changeColor () {
      // this.editedWikiCategory.color = this.showColor
    },
    log (item) {
      // this.editedWikiCategory.parent = item.id
      // if (this.active && this.active.length > 0) {
      //   this.newArticle.category = this.active[0]
      // }
      this.selectedCategory = item.name
    },
    create () {
      this.$refs.form.validate()
      if (this.$refs.form.validate() && this.newArticle.category) {
        // console.log(this.newArticle.category)
        // this.clear()
        // this.dialogNewWikiArticle = false
        const currUserId = this.users.find(f => f.login === this.user)
        const text = `INSERT INTO public.articles(category, name, description, icon, color, creator, "dateCreated") VALUES ($1, $2, $3, null, null, $4, NOW()) RETURNING *;`
        const values = [Number(this.newArticle.category), this.newArticle.name, this.editorData, Number(currUserId.id)]
        // console.log(values)
        utils.insertWikiAny({ text, values })
          .then(r => {
            console.log(r)
            if (r.error) {
              this.$store.dispatch('setError', `${r.message}: ${r.data}`)
            } else {
              this.updateArticles(r.data[0].name)
              this.$store.dispatch('setSuccess', `Статья добавлена - ${r.data[0].name}`)
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
      this.newArticle.name = null
      this.newArticle.color = null
      this.newArticle.icon = null
      this.newArticle.category = null
      this.editorData = ''
      this.active = []
      this.categoryPanel = []
      this.selectedCategory = null
      this.iconPanel = []
      this.editedWikiCategory = null
      this.$refs.form.resetValidation()
    },
    updateArticles (newName) {
      utils.getWikiCategories()
        .then(r => {
          if (r.error) {
            console.error(r)
            this.$store.dispatch('setError', `${r.message}: ${r.data}`)
            this.clear()
            this.dialogNewWikiArticle = false
          } else {
            this.wikiCategories = r.data
            this.wikiFlatCategories = r.flat
            // this.wikiActiveCategory.pop()
            // this.wikiActiveCategory.push(newId)
            // this.$store.dispatch('setSuccess', `Статья добавлена - ${newName}`)
            this.clear()
            this.dialogNewWikiArticle = false
          }
        })
        .catch(e => {
          // this.$store.dispatch('setError', `Ошибка добавления статьи - ${newName}`)
          this.$store.dispatch('setError', `${e.stack}`)
          console.log(e)
        })
    }
  }
}
</script>

<style>
pre {
    display: block !important;
    line-height: 1.42857 !important;
    /* word-break: break-all !important; */
    word-wrap: break-word !important;
    color: #333 !important;
    background: #282b2e !important;
    border: none;
    border-radius: 0px !important;
  }
  pre code {
    display: block !important;
    font: 1em / 1.3em 'Source Code Pro', monospace !important;
    color: #f8f8f8 !important;
  }
  pre code:after {
    display: block; text-align: right !important;
    font: 1em / 1.3em 'Lucida Console', 'courier new', monospace !important;
    color: #546a7e !important;
    padding-top: 0.5em !important;
  }
  .hljs {
  display: block !important;
  overflow-x: auto !important;
  padding: 0.5em !important;
  background: #000 !important;
  color: #f8f8f8 !important;
}

.hljs-comment,
.hljs-quote {
  color: #aeaeae !important;
  font-style: italic !important;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-type {
  color: #e28964 !important;
}

.hljs-string {
  color: #65b042 !important;
}

.hljs-subst {
  color: #daefa3 !important;
}

.hljs-regexp,
.hljs-link {
  color: #e9c062 !important;
}

.hljs-title,
.hljs-section,
.hljs-tag,
.hljs-name {
  color: #89bdff !important;
}

.hljs-class .hljs-title,
.hljs-doctag {
  text-decoration: underline !important;
}

.hljs-symbol,
.hljs-bullet,
.hljs-number {
  color: #3387cc !important;
}

.hljs-params,
.hljs-variable,
.hljs-template-variable {
  color: #3e87e3 !important;
}

.hljs-attribute {
  color: #cda869 !important;
}

.hljs-meta {
  color: #8996a8 !important;
}

.hljs-formula {
  background-color: #0e2231 !important;
  color: #f8f8f8 !important;
  font-style: italic !important;
}

.hljs-addition {
  background-color: #253b22 !important;
  color: #f8f8f8 !important;
}

.hljs-deletion {
  background-color: #420e09 !important;
  color: #f8f8f8 !important;
}

.hljs-selector-class {
  color: #9b703f !important;
}

.hljs-selector-id {
  color: #8b98ab !important;
}

.hljs-emphasis {
  font-style: italic !important;
}

.hljs-strong {
  font-weight: bold !important;
}

pre .comment,
pre .template_comment,
pre .javadoc {
  color: #aeaeae !important;
  font-style: italic !important;
}
pre .keyword,
pre .ruby .function .keyword,
pre .request,
pre .status,
pre .nginx .title {
  color: #E28964 !important;
}
pre .function .keyword,
pre .sub .keyword,
pre .method,
pre .list .title {
  color: #99CF50 !important;
}
pre .string,
pre .tag .value,
pre .cdata,
pre .filter .argument,
pre .attr_selector,
pre .apache .cbracket,
pre .date,
pre .tex .command {
  color: #65B042 !important;
}
pre .subst {
  color: #DAEFA3 !important;
}
pre .regexp {
  color: #E9C062 !important;
}
pre .title,
pre .sub .identifier,
pre .pi,
pre .tag,
pre .tag .keyword,
pre .decorator,
pre .shebang,
pre .prompt {
  color: #89BDFF !important;
}
pre .class .title,
pre .haskell .type,
pre .smalltalk .class,
pre .javadoctag,
pre .yardoctag,
pre .phpdoc {
  text-decoration: underline !important;
}
pre .symbol,
pre .ruby .symbol .string,
pre .number {
  color: #3387CC !important;
}
pre .params,
pre .variable,
pre .clojure .attribute {
  color: #3E87E3 !important;
}
pre .css .tag,
pre .rules .property,
pre .pseudo,
pre .tex .special {
  color: #CDA869 !important;
}
pre .css .class {
  color: #9B703F !important;
}
pre .rules .keyword {
  color: #C5AF75 !important;
}
pre .rules .value {
  color: #CF6A4C !important;
}
pre .css .id {
  color: #8B98AB !important;
}
pre .annotation,
pre .apache .sqbracket,
pre .nginx .built_in {
  color: #9B859D !important;
}
pre .preprocessor {
  color: #8996A8 !important;
}
pre .hexcolor,
pre .css .value .number {
  color: #DD7B3B !important;
}
pre .css .function {
  color: #DAD085 !important;
}
pre .diff .header,
pre .chunk,
pre .tex .formula {
  background-color: #0E2231 !important;
  color: #F8F8F8 !important;
  font-style: italic !important;
}
pre .diff .change {
  background-color: #4A410D !important;
  color: #F8F8F8 !important;
}
pre .addition {
  background-color: #253B22 !important;
  color: #F8F8F8 !important;
}
pre .deletion {
  background-color: #420E09 !important;
  color: #F8F8F8 !important;
}
pre .coffeescript .javascript,
pre .javascript .xml,
pre .tex .formula,
pre .xml .javascript,
pre .xml .vbscript,
pre .xml .css,
pre .xml .cdata {
  opacity: 0.5 !important;
}
</style>
