import { getField, updateField } from 'vuex-map-fields'

export default {
  state: {
    loading: false,
    error: null,
    success: null,
    planId: null,
    search: '',
    selectedTaskId: null,
    startLoading: null,
    endLoading: null,
    predecessor: true,
    successor: true,
    predecessorsTasks: [],
    successorsTasks: [],
    taskDialogVisible: false,
    dialogCaption: '',
    selectedTask: null,
    selectedDialogTask: null,
    taskeditform: null,
    tabDialogTask: null,
    showToolbar: false,
    showPanel: false,
    isMainTask: false,
    taskId: 'all',
    fromPath: null,
    taskCount: null,
    criticalPath: false,
    drawerRight: false,
    viewPredicted: false,
    viewMarked: false,
    calculatePredictedDialog: false,
    readyForImport: false,
    importCount: 0,
    dialogBeforeCreate: false,
    viewResource: false,
    onlyGrid: false,
    dialogNewCatWiki: false,
    wikiCategories: [],
    wikiFlatCategories: [],
    wikiActiveCategory: [],
    editedWikiCategory: null,
    dialogEditCatWiki: false,
    wikiItemsPerPage: 4,
    wikiPage: 1,
    dialogNewWikiArticle: false,
    wikiArticles: null,
    wikiLoading: false,
    wikiSelectedTree: [],
    wikiCurrentArticle: null,
    wikiSearch: '',
    wikiPanelVisible: true,
    wikiIcons: [
      'fas fa-atom',
      'fas fa-code',
      'fas fa-scroll',
      'far fa-file-code',
      'fab fa-microsoft',
      'fas fa-database',
      'fas fa-coins',
      'fab fa-vuejs',
      'fab fa-js-square',
      'fab fa-node',
      'fab fa-node-js',
      'fab fa-npm',
      'fab fa-dev',
      'fa fa-folder-open',
      'fa fa-folder',
      'fa fa-folder-open-o',
      'fa fa-folder-o',
      'fa fa-star',
      'fa fa-star-o',
      'fas fa-cogs',
      'fas fa-tools',
      'fas fa-hammer',
      'fas fa-life-ring',
      'fas fa-magic',
      'fas fa-desktop',
      'fas fa-chalkboard',
      'fas fa-project-diagram',
      'fas fa-network-wired',
      'fas fa-book',
      'fas fa-file-invoice',
      'fas fa-chart-bar',
      'fas fa-chart-line',
      'fab fa-stack-exchange',
      'fas fa-download',
      'fas fa-drum',
      'fab fa-gripfire',
      'fas fa-infinity',
      'fas fa-paperclip',
      'fas fa-trophy',
      'fas fa-user-secret',
      'fas fa-filter',
      'fas fa-location-arrow',
      'fas fa-brain',
      'fas fa-tasks',
      'far fa-thumbs-up',
      'fas fa-thumbs-up',
      'fas fa-question',
      'fas fa-info',
      'fas fa-info-circle',
      'far fa-comments',
      'fas fa-comments',
      'far fa-comment',
      'fas fa-comment',
      'fas fa-clipboard-check',
      'far fa-file',
      'fas fa-file',
      'far fa-file-alt',
      'fas fa-file-alt',
      'far fa-file-archive',
      'fas fa-file-archive'
    ],
    wikiGridTitle: 'Все категории',
    beforeImportDialog: false,
    enableAutoShedulling: true,
    startImport: false,
    accountContractData: null,
    allContractors: null,
    profitableContractData: null,
    projectOfficeData: null,
    dataForTable: null,
    reportQuery: {
      project: null,
      projectOffice: null,
      date: null,
      isProfitable: false,
      isAccount: false,
      contractType: 0,
      isNotDeadline: false,
      profitableContractor: null,
      accountContractor: null,
      profitableContract: null,
      accountContract: null,
      contractCurator: null,
      responsible: null
    },
    flatTable: {
      CRDO: null,
      RCDO: null,
      REDO: null,
      ERDO: null,
      CRA: null,
      CRD: null,
      CRN: null,
      CRC: null,
      RCA: null,
      RCD: null,
      RCN: null,
      RCC: null,
      REA: null,
      RED: null,
      REN: null,
      REC: null,
      ERA: null,
      ERD: null,
      ERN: null,
      ERC: null
    },
    requirementsFullData: null,
    selectedHeaders: [
      {
        text: '№',
        align: 'start',
        sortable: false,
        value: 'Id',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '1%'
      },
      {
        text: 'Проект',
        sortable: false,
        value: 'Project',
        divider: true,
        class: 'wasdlight white--text text-center',
        visible: true,
        exportable: true,
        width: '12%'
      },
      {
        text: 'Договор',
        align: 'start',
        sortable: false,
        value: 'Dms',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '11%'
      },
      {
        text: 'Обязательство',
        align: 'start',
        sortable: false,
        value: 'RequirementEssence',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '11%'
      },
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'Name',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '9%'
      },
      {
        text: 'Исполнитель',
        align: 'start',
        sortable: false,
        value: 'RequirementExecutorName',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '6%'
      },
      {
        text: 'Ответственный от WASD',
        align: 'start',
        sortable: false,
        value: 'Responsible',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '7%'
      },
      {
        text: 'Срок исполнения',
        align: 'start',
        sortable: false,
        value: 'Deadline',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '4%'
      },
      {
        text: 'Дата исполнения',
        align: 'start',
        sortable: false,
        value: 'EndDate',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '4%'
      },
      {
        text: 'Просрочка (дней)',
        align: 'start',
        sortable: false,
        value: 'Delay',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '3%'
      },
      {
        text: 'Штрафные санкции',
        align: 'start',
        sortable: false,
        value: 'PenaltiesClause',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '7%'
      },
      {
        text: 'Статус ПИР',
        align: 'start',
        sortable: false,
        value: 'StatusPIR',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '5%'
      },
      {
        text: 'Действия',
        align: 'start',
        sortable: false,
        value: 'selected',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: false,
        width: '3%'
      }
    ],
    allHeaders: [
      {
        text: '№',
        align: 'start',
        sortable: false,
        value: 'Id',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '1%'
      },
      {
        text: 'Проект',
        sortable: false,
        value: 'Project',
        divider: true,
        class: 'wasdlight white--text text-center',
        visible: true,
        exportable: true,
        width: '12%'
      },
      {
        text: 'Договор',
        align: 'start',
        sortable: false,
        value: 'Dms',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '11%'
      },
      {
        text: 'Обязательство',
        align: 'start',
        sortable: false,
        value: 'RequirementEssence',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '11%'
      },
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'Name',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '9%'
      },
      {
        text: 'Условия возникновения',
        align: 'start',
        sortable: false,
        value: 'StartConditions',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: false,
        exportable: true,
        width: '11%'
      },
      {
        text: 'Исполнитель',
        align: 'start',
        sortable: false,
        value: 'RequirementExecutorName',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '6%'
      },
      {
        text: 'Ответственный от WASD',
        align: 'start',
        sortable: false,
        value: 'Responsible',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '7%'
      },
      {
        text: 'Срок исполнения',
        align: 'start',
        sortable: false,
        value: 'Deadline',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '4%'
      },
      {
        text: 'Дата исполнения',
        align: 'start',
        sortable: false,
        value: 'EndDate',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '4%'
      },
      {
        text: 'Просрочка (дней)',
        align: 'start',
        sortable: false,
        value: 'Delay',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '3%'
      },
      {
        text: 'Штрафные санкции',
        align: 'start',
        sortable: false,
        value: 'PenaltiesClause',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '7%'
      },
      {
        text: 'Статус',
        align: 'start',
        sortable: false,
        value: 'Status',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: false,
        exportable: true,
        width: '7%'
      },
      {
        text: 'КС',
        align: 'start',
        sortable: false,
        value: 'KeyEvent',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: false,
        exportable: true,
        width: '7%'
      },
      {
        text: 'Статус ПИР',
        align: 'start',
        sortable: false,
        value: 'StatusPIR',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: true,
        width: '5%'
      },
      {
        text: 'Подсистема',
        align: 'start',
        sortable: false,
        value: 'Subsystem',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: false,
        exportable: true,
        width: '5%'
      },
      {
        text: 'Результат',
        align: 'start',
        sortable: false,
        value: 'DepVerificationUser',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: false,
        exportable: false,
        width: '10%'
      },
      {
        text: 'Действия',
        align: 'start',
        sortable: false,
        value: 'selected',
        class: 'wasdlight white--text text-center',
        divider: true,
        visible: true,
        exportable: false,
        width: '3%'
      }
    ],
    tabsAdditional: null,
    groupedBy: [],
    reqsearch: '',
    dialogExportPdf: false,
    requirementTitle: '',
    dataForMatrix: null,
    allMatrixData: null,
    matrixPanel: [0],
    // viewMarked: false,
    allTasksCount: 0,
    isGap: false,
    dialogGap: false,
    gapTasks: []
  },
  mutations: {
    setGapTasks (state, payload) {
      state.gapTasks = payload
    },
    setDialogGap (state, payload) {
      state.dialogGap = payload
    },
    setIsGap (state, payload) {
      state.isGap = payload
    },
    setAllTasksCount (state, payload) {
      state.allTasksCount = payload
    },
    setViewMarked (state, payload) {
      state.viewMarked = payload
    },
    setWikiGridTitle (state, payload) {
      state.wikiGridTitle = payload
    },
    setMatrixPanel (state, payload) {
      state.matrixPanel = payload
    },
    setAllMatrixData (state, payload) {
      state.allMatrixData = payload
    },
    setDataForMatrix (state, payload) {
      state.dataForMatrix = payload
    },
    setRequirementTitle (state, payload) {
      state.requirementTitle = payload
    },
    setDialogExportPdf (state, payload) {
      state.dialogExportPdf = payload
    },
    setReqsearch (state, payload) {
      state.reqsearch = payload
    },
    setGroupedBy (state, payload) {
      state.groupedBy = payload
    },
    setTabsAdditional (state, payload) {
      state.tabsAdditional = payload
    },
    setAllHeaders (state, payload) {
      state.allHeaders = payload
    },
    setSelectedHeaders (state, payload) {
      state.selectedHeaders = payload
    },
    setRequirementsFullData (state, payload) {
      state.requirementsFullData = payload
    },
    setFlatTable (state, payload) {
      state.flatTable = payload
    },
    setReportQuery (state, payload) {
      state.reportQuery = payload
    },
    setDataForTable (state, payload) {
      state.dataForTable = payload
    },
    setProjectOfficeData (state, payload) {
      state.projectOfficeData = payload
    },
    setAllContractors (state, payload) {
      state.allContractors = payload
    },
    setProfitableContractData (state, payload) {
      state.profitableContractData = payload
    },
    setAccountContractData (state, payload) {
      state.accountContractData = payload
    },
    setBeforeImportDialog (state, payload) {
      state.beforeImportDialog = payload
    },
    setEnableAutoShedulling (state, payload) {
      state.enableAutoShedulling = payload
    },
    setStartImport (state, payload) {
      state.startImport = payload
    },
    setWikiPanelVisible (state, payload) {
      state.wikiPanelVisible = payload
    },
    setWikiSearch (state, payload) {
      state.wikiSearch = payload
    },
    setWikiCurrentArticle (state, payload) {
      state.wikiCurrentArticle = payload
    },
    setWikiSelectedTree (state, payload) {
      state.wikiSelectedTree = payload
    },
    setWikiLoading (state, payload) {
      state.wikiLoading = payload
    },
    setWikiArticles (state, payload) {
      state.wikiArticles = payload
    },
    setDialogNewWikiArticle (state, payload) {
      state.dialogNewWikiArticle = payload
    },
    setWikiPage (state, payload) {
      state.wikiPage = payload
    },
    setWikiItemsPerPage (state, payload) {
      state.wikiItemsPerPage = payload
    },
    setDialogEditCatWiki (state, payload) {
      state.dialogEditCatWiki = payload
    },
    setWikiFlatCategories (state, payload) {
      state.wikiFlatCategories = payload
    },
    setEditedWikiCategory (state, payload) {
      state.editedWikiCategory = payload
    },
    setWikiActiveCategory (state, payload) {
      state.wikiActiveCategory = payload
    },
    setWikiCategories (state, payload) {
      state.wikiCategories = payload
    },
    setDialogNewCatWiki (state, payload) {
      state.dialogNewCatWiki = payload
    },
    setOnlyGrid (state, payload) {
      state.onlyGrid = payload
    },
    setViewResource (state, payload) {
      state.viewResource = payload
    },
    setDialogBeforeCreate (state, payload) {
      state.dialogBeforeCreate = payload
    },
    setImportCount (state, payload) {
      state.importCount = payload
    },
    setReadyForImport (state, payload) {
      state.readyForImport = payload
    },
    setCalculatePredictedDialog (state, payload) {
      state.calculatePredictedDialog = payload
    },
    setViewPredicted (state, payload) {
      state.viewPredicted = payload
    },
    // setViewMarked (state, payload) {
    //   state.viewMarked = payload
    // },
    setDrawerRight (state, payload) {
      state.drawerRight = payload
    },
    setCriticalPath (state, payload) {
      state.criticalPath = payload
    },
    setTaskCount (state, payload) {
      state.taskCount = payload
    },
    setFromPath (state, payload) {
      state.fromPath = payload
    },
    setIsMainTask (state, payload) {
      state.isMainTask = payload
    },
    setShowPanel (state, payload) {
      state.showPanel = payload
    },
    setShowToolbar (state, payload) {
      state.showToolbar = payload
    },
    setTabDialogTask (state, payload) {
      state.tabDialogTask = payload
    },
    setSelectedDialogTask (state, payload) {
      state.selectedDialogTask = payload
    },
    setSelectedTask (state, payload) {
      if (state.isMainTask) {
        // state.taskeditform.dateRange = []
        // state.taskeditform.text = payload ? payload.text : ''
        // state.taskeditform.description = payload ? payload.description : ''
        // state.taskeditform.dateRange.push(payload.start_date)
        // state.taskeditform.dateRange.push(payload.end_date)
        // state.taskeditform.progress = payload.progress
        // state.taskeditform.duration = Math.round(payload.duration / 8)
        // state.taskeditform.type = payload.type
        state.taskeditform = payload
        state.selectedDialogTask = payload
        state.selectedTask = payload
      } else {
        state.selectedTask = payload
      }
      // state.taskeditform.dateRange = []
      // // task.type == gantt.config.types.phase
      // state.taskeditform.text = payload ? payload.text : ''
      // state.taskeditform.description = payload ? payload.description : ''
      // state.taskeditform.dateRange.push(payload.start_date)
      // state.taskeditform.dateRange.push(payload.end_date)
      // state.taskeditform.progress = payload.progress
      // state.taskeditform.duration = Math.round(payload.duration / 8)
      // state.taskeditform.type = payload.type
      // state.selectedTask = payload
    },
    setDialogCaption (state, payload) {
      state.dialogCaption = payload
    },
    setTaskDialogVisible (state, payload) {
      state.taskDialogVisible = payload
    },
    setSuccessorsTasks (state, payload) {
      state.successorsTasks = payload
    },
    setPredecessorsTasks (state, payload) {
      state.predecessorsTasks = payload
    },
    setPredecessor (state, payload) {
      state.predecessor = payload
    },
    setSuccessor (state, payload) {
      state.successor = payload
    },
    setStartLoading (state, payload) {
      state.startLoading = payload
    },
    setEndLoading (state, payload) {
      state.endLoading = payload
    },
    setSelectedTaskId (state, payload) {
      state.selectedTaskId = payload
    },
    setPlanId (state, payload) {
      state.planId = payload
    },
    setTaskId (state, payload) {
      state.taskId = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setSuccess (state, payload) {
      state.success = payload
    },
    clearError (state) {
      state.error = null
    },
    setSearch (state, payload) {
      state.search = payload
    },
    updateField,
    setPredictDate (state, payload) {
      state.PredictDate = payload
      // console.log('state.PredictDate: ', state.PredictDate)
    }
  },
  actions: {
    setGapTasks ({ commit }, payload) {
      commit('setGapTasks', payload)
    },
    setDialogGap ({ commit }, payload) {
      commit('setDialogGap', payload)
    },
    setIsGap ({ commit }, payload) {
      commit('setIsGap', payload)
    },
    setAllTasksCount ({ commit }, payload) {
      commit('setAllTasksCount', payload)
    },
    setViewMarked ({ commit }, payload) {
      commit('setViewMarked', payload)
    },
    setWikiGridTitle ({ commit }, payload) {
      commit('setWikiGridTitle', payload)
    },
    setMatrixPanel ({ commit }, payload) {
      commit('setMatrixPanel', payload)
    },
    setAllMatrixData ({ commit }, payload) {
      commit('setAllMatrixData', payload)
    },
    setDataForMatrix ({ commit }, payload) {
      commit('setDataForMatrix', payload)
    },
    setRequirementTitle ({ commit }, payload) {
      commit('setRequirementTitle', payload)
    },
    setDialogExportPdf ({ commit }, payload) {
      commit('setDialogExportPdf', payload)
    },
    setReqsearch ({ commit }, payload) {
      commit('setReqsearch', payload)
    },
    setGroupedBy ({ commit }, payload) {
      commit('setGroupedBy', payload)
    },
    setTabsAdditional ({ commit }, payload) {
      commit('setTabsAdditional', payload)
    },
    setAllHeaders ({ commit }, payload) {
      commit('setAllHeaders', payload)
    },
    setSelectedHeaders ({ commit }, payload) {
      commit('setSelectedHeaders', payload)
    },
    setRequirementsFullData ({ commit }, payload) {
      commit('setRequirementsFullData', payload)
    },
    setFlatTable ({ commit }, payload) {
      commit('setFlatTable', payload)
    },
    setReportQuery ({ commit }, payload) {
      commit('setReportQuery', payload)
    },
    setDataForTable ({ commit }, payload) {
      commit('setDataForTable', payload)
    },
    setProjectOfficeData ({ commit }, payload) {
      commit('setProjectOfficeData', payload)
    },
    setAllContractors ({ commit }, payload) {
      commit('setAllContractors', payload)
    },
    setProfitableContractData ({ commit }, payload) {
      commit('setProfitableContractData', payload)
    },
    setAccountContractData ({ commit }, payload) {
      commit('setAccountContractData', payload)
    },
    setBeforeImportDialog ({ commit }, payload) {
      commit('setBeforeImportDialog', payload)
    },
    setEnableAutoShedulling ({ commit }, payload) {
      commit('setEnableAutoShedulling', payload)
    },
    setStartImport ({ commit }, payload) {
      commit('setStartImport', payload)
    },
    setWikiPanelVisible ({ commit }, payload) {
      commit('setWikiPanelVisible', payload)
    },
    setWikiSearch ({ commit }, payload) {
      commit('setWikiSearch', payload)
    },
    setWikiCurrentArticle ({ commit }, payload) {
      commit('setWikiCurrentArticle', payload)
    },
    setWikiSelectedTree ({ commit }, payload) {
      commit('setWikiSelectedTree', payload)
    },
    setWikiLoading ({ commit }, payload) {
      commit('setWikiLoading', payload)
    },
    setWikiArticles ({ commit }, payload) {
      commit('setWikiArticles', payload)
    },
    setDialogNewWikiArticle ({ commit }, payload) {
      commit('setDialogNewWikiArticle', payload)
    },
    setWikiPage ({ commit }, payload) {
      commit('setWikiPage', payload)
    },
    setWikiItemsPerPage ({ commit }, payload) {
      commit('setWikiItemsPerPage', payload)
    },
    setDialogEditCatWiki ({ commit }, payload) {
      commit('setDialogEditCatWiki', payload)
    },
    setWikiFlatCategories ({ commit }, payload) {
      commit('setWikiFlatCategories', payload)
    },
    setEditedWikiCategory ({ commit }, payload) {
      commit('setEditedWikiCategory', payload)
    },
    setWikiActiveCategory ({ commit }, payload) {
      commit('setWikiActiveCategory', payload)
    },
    setWikiCategories ({ commit }, payload) {
      commit('setWikiCategories', payload)
    },
    setDialogNewCatWiki ({ commit }, payload) {
      commit('setDialogNewCatWiki', payload)
    },
    setOnlyGrid ({ commit }, payload) {
      commit('setOnlyGrid', payload)
    },
    setViewResource ({ commit }, payload) {
      commit('setViewResource', payload)
    },
    setDialogBeforeCreate ({ commit }, payload) {
      commit('setDialogBeforeCreate', payload)
    },
    setImportCount ({ commit }, payload) {
      commit('setImportCount', payload)
    },
    setReadyForImport ({ commit }, payload) {
      commit('setReadyForImport', payload)
    },
    setCalculatePredictedDialog ({ commit }, payload) {
      commit('setCalculatePredictedDialog', payload)
    },
    setViewPredicted ({ commit }, payload) {
      commit('setViewPredicted', payload)
    },
    // setViewMarked ({ commit }, payload) {
    //   commit('setViewMarked', payload)
    // },
    setDrawerRight ({ commit }, payload) {
      commit('setDrawerRight', payload)
    },
    setCriticalPath ({ commit }, payload) {
      commit('setCriticalPath', payload)
    },
    setTaskCount ({ commit }, payload) {
      commit('setTaskCount', payload)
    },
    setFromPath ({ commit }, payload) {
      commit('setFromPath', payload)
    },
    setIsMainTask ({ commit }, payload) {
      commit('setIsMainTask', payload)
    },
    setShowPanel ({ commit }, payload) {
      commit('setShowPanel', payload)
    },
    setShowToolbar ({ commit }, payload) {
      commit('setShowToolbar', payload)
    },
    setTabDialogTask ({ commit }, payload) {
      commit('setTabDialogTask', payload)
    },
    setSelectedDialogTask ({ commit }, payload) {
      commit('setSelectedDialogTask', payload)
    },
    setSelectedTask ({ commit }, payload) {
      commit('setSelectedTask', payload) //
    },
    setDialogCaption ({ commit }, payload) {
      commit('setDialogCaption', payload)
    },
    setTaskDialogVisible ({ commit }, payload) {
      commit('setTaskDialogVisible', payload)
    },
    setSuccessorsTasks ({ commit }, payload) {
      // commit('setPredecessorsTasks', [])
      // var pred = []
      // for (let index = 0; index < payload.length; index++) {
      //   const element = payload[index]
      //   // eslint-disable-next-line
      //   const task = gantt.getTask(element)
      //   // eslint-disable-next-line
      //   var formatFunc = gantt.date.date_to_str('%d.%m.%Y')
      //   pred.push({
      //     id: task.id,
      //     index: task.global_id,
      //     start_date: formatFunc(new Date(task.start_date)),
      //     text: task.text
      //   })
      // }
      commit('setSuccessorsTasks', payload)
    },
    setPredecessorsTasks ({ commit }, payload) {
      // commit('setPredecessorsTasks', [])
      // var pred = []
      // for (let index = 0; index < payload.length; index++) {
      //   const element = payload[index]
      //   // eslint-disable-next-line
      //   const task = gantt.getTask(element)
      //   // eslint-disable-next-line
      //   var formatFunc = gantt.date.date_to_str('%d.%m.%Y')
      //   pred.push({
      //     id: task.id,
      //     index: task.global_id,
      //     start_date: formatFunc(new Date(task.start_date)),
      //     text: task.text
      //   })
      // }
      commit('setPredecessorsTasks', payload)
    },
    setPredecessor ({ commit }, payload) {
      commit('setPredecessor', payload)
    },
    setSuccessor ({ commit }, payload) {
      commit('setSuccessor', payload)
    },
    setStartLoading ({ commit }, payload) {
      commit('setStartLoading', payload)
    },
    setEndLoading ({ commit }, payload) {
      commit('setEndLoading', payload)
    },
    setSelectedTaskId ({ commit }, payload) {
      commit('setSelectedTaskId', payload)
    },
    setPlanId ({ commit }, payload) {
      commit('setPlanId', payload)
    },
    setTaskId ({ commit }, payload) {
      commit('setTaskId', payload)
    },
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    setError ({ commit }, payload) {
      commit('setError', payload)
    },
    setSuccess ({ commit }, payload) {
      commit('setSuccess', payload)
    },
    clearError ({ commit }) {
      commit('clearError')
    },
    setSearch ({ commit }, payload) {
      commit('setSearch', payload)
    },
    setPredictDate ({ commit }, payload) {
      commit('setPredictDate', payload)
    }
  },
  getters: {
    gapTasks (state) {
      return state.gapTasks
    },
    dialogGap (state) {
      return state.dialogGap
    },
    isGap (state) {
      return state.isGap
    },
    allTasksCount (state) {
      return state.allTasksCount
    },
    viewMarked (state) {
      return state.viewMarked
    },
    wikiGridTitle (state) {
      return state.wikiGridTitle
    },
    matrixPanel (state) {
      return state.matrixPanel
    },
    allMatrixData (state) {
      return state.allMatrixData
    },
    dataForMatrix (state) {
      return state.dataForMatrix
    },
    requirementTitle (state) {
      return state.requirementTitle
    },
    dialogExportPdf (state) {
      return state.dialogExportPdf
    },
    reqsearch (state) {
      return state.reqsearch
    },
    groupedBy (state) {
      return state.groupedBy
    },
    tabsAdditional (state) {
      return state.tabsAdditional
    },
    allHeaders (state) {
      return state.allHeaders
    },
    selectedHeaders (state) {
      return state.selectedHeaders
    },
    requirementsFullData (state) {
      return state.requirementsFullData
    },
    flatTable (state) {
      return state.flatTable
    },
    reportQuery (state) {
      return state.reportQuery
    },
    dataForTable (state) {
      return state.dataForTable
    },
    profitableContractData (state) {
      return state.profitableContractData
    },
    accountContractData (state) {
      return state.accountContractData
    },
    allContractors (state) {
      return state.allContractors
    },
    projectOfficeData (state) {
      return state.projectOfficeData
    },
    beforeImportDialog (state) {
      return state.beforeImportDialog
    },
    enableAutoShedulling (state) {
      return state.enableAutoShedulling
    },
    startImport (state) {
      return state.startImport
    },
    wikiIcons (state) {
      return state.wikiIcons
    },
    wikiPanelVisible (state) {
      return state.wikiPanelVisible
    },
    wikiSearch (state) {
      return state.wikiSearch
    },
    wikiCategoryName (state) {
      const categoryName = state.wikiFlatCategories && state.wikiFlatCategories.length > 0 && state.wikiCurrentArticle ? state.wikiFlatCategories.find(f => f.id === state.wikiCurrentArticle.category).name : ''
      return categoryName
    },
    wikiCurrentArticle (state) {
      return state.wikiCurrentArticle
    },
    wikiSelectedTree (state) {
      return state.wikiLoading
    },
    wikiLoading (state) {
      return state.wikiLoading
    },
    wikiArticles (state) {
      return state.wikiArticles
    },
    dialogNewWikiArticle (state) {
      return state.dialogNewWikiArticle
    },
    wikiPage (state) {
      return state.wikiPage
    },
    wikiItemsPerPage (state) {
      return state.wikiItemsPerPage
    },
    dialogEditCatWiki (state) {
      return state.dialogEditCatWiki
    },
    wikiFlatCategories (state) {
      return state.wikiFlatCategories
    },
    editedWikiCategory (state) {
      return state.editedWikiCategory
    },
    wikiActiveCategory (state) {
      return state.wikiActiveCategory
    },
    wikiCategories (state) {
      return state.wikiCategories
    },
    dialogNewCatWiki (state) {
      return state.dialogNewCatWiki
    },
    onlyGrid (state) {
      return state.onlyGrid
    },
    viewResource (state) {
      return state.viewResource
    },
    dialogBeforeCreate (state) {
      return state.dialogBeforeCreate
    },
    importCount (state) {
      return state.importCount
    },
    readyForImport (state) {
      return state.readyForImport
    },
    calculatePredictedDialog (state) {
      return state.calculatePredictedDialog
    },
    viewPredicted (state) {
      return state.viewPredicted
    },
    // viewMarked (state) {
    //   return state.viewMarked
    // },
    drawerRight (state) {
      return state.drawerRight
    },
    criticalPath (state) {
      return state.criticalPath
    },
    taskCount (state) {
      return state.taskCount
    },
    fromPath (state) {
      return state.fromPath
    },
    taskId (state) {
      return state.taskId
    },
    isMainTask (state) {
      return state.isMainTask
    },
    showPanel (state) {
      return state.showPanel
    },
    showToolbar (state) {
      return state.showToolbar
    },
    tabDialogTask (state) {
      return state.tabDialogTask
    },
    selectedDialogTask (state) {
      return state.selectedDialogTask
    },
    taskeditform (state) {
      return state.taskeditform
    },
    selectedTask (state) {
      return state.selectedTask
    },
    dialogCaption (state) {
      return state.dialogCaption
    },
    taskDialogVisible (state) {
      return state.taskDialogVisible
    },
    successorsTasks (state) {
      return state.successorsTasks
    },
    predecessorsTasks (state) {
      return state.predecessorsTasks
    },
    predecessor (state) {
      return state.predecessor
    },
    successor (state) {
      return state.successor
    },
    startLoading (state) {
      return state.startLoading
    },
    endLoading (state) {
      return state.endLoading
    },
    search (state) {
      return state.search
    },
    selectedTaskId (state) {
      return state.selectedTaskId
    },
    planId (state) {
      return state.planId
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    success (state) {
      return state.success
    },
    getField,
    predictDate (state) {
      return state.predictDate
    }
  }
}
