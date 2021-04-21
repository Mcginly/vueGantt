<template>
  <div>
    <div v-if="wikiCurrentArticle && wikiFlatCategories" class="pa-2">
      <v-row>
        <span v-if="wikiFlatCategories">Статья в категории: {{ wikiCategoryName }}</span>
        <v-spacer />
        <span class="caption">Дата создания: {{ new Date(wikiCurrentArticle.dateCreated).toLocaleDateString() }}, автор: {{ creatorName }}</span>
      </v-row>
      <v-row dense>
        <v-text-field
          v-model="wikiCurrentArticle.name"
          label="Наименование"
          :rules="[v => !!v || 'Введите наименование']"
          outlined
          dense
          required
          class="mt-3"
        />
        <v-spacer />
        <v-btn
          color="wasdmedium"
          dark
          class="mt-3"
          @click="update()"
        >
          Сохранить
        </v-btn>
        <v-btn
          color="wasdlight"
          dark
          class="mt-3 ml-3"
          @click="goBack()"
        >
          Вернуться к списку
        </v-btn>
      </v-row>
    </div>
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" :disabled="false" />
    <v-row dense>
      <v-spacer />
      <v-btn
        color="wasdmedium"
        dark
        class="mt-3"
        @click="update()"
      >
        Сохранить
      </v-btn>
      <v-btn
        color="wasdlight"
        dark
        class="mt-3 ml-3"
        @click="goBack()"
      >
        Вернуться к списку
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import utils from '../../config/utils'

export default {
  name: 'wikiArticleView',
  data: () => ({
    editor: ClassicEditor,
    categoryName: '',
    localEditorData: '',
    editorConfig: {
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
      },
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
      }
    }
  }),
  computed: {
    ...mapFields([
      'wikiCurrentArticle'
    ]),
    ...mapGetters([
      'users',
      'user',
      'wikiFlatCategories',
      'wikiCategoryName'
    ]),
    creatorName () {
      if (this.users && this.wikiCurrentArticle) {
        const find = this.users.find(f => Number(f.id) === Number(this.wikiCurrentArticle.creator))
        if (find) {
          return find.shortName
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    editorData: {
      get () {
        return this.wikiCurrentArticle ? this.wikiCurrentArticle.description : ''
      },
      set (v) {
        this.localEditorData = v
      }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    update () {
      const currUserId = this.users.find(f => f.login === this.user)
      // console.log(Number(currUserId.id))
      if (this.wikiCurrentArticle.name !== '') {
        const text = `UPDATE public.articles SET name=$2, description=$3, updater=$4, "dateUpdated"=NOW()  WHERE id=$1 RETURNING *;`
        const values = [this.wikiCurrentArticle.id, this.wikiCurrentArticle.name, this.localEditorData || this.editorData, Number(currUserId.id)]
        utils.insertWikiAny({ text, values })
          .then(r => {
            console.log(r.data)
            this.$store.dispatch('setSuccess', `Статья обновлена - ${r.data[0].name}`)
          })
          .catch(err => {
            console.log(err)
            this.$store.dispatch('setError', `Ошибка обновления статьи - ${this.wikiCurrentArticle.name}`)
          })
      } else {
        this.$store.dispatch('setError', `Введите наименование статьи!`)
      }
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
