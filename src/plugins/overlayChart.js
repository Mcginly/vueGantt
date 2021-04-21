// eslint-disable-next-line
// var overlayControl = gantt.ext.overlay
// eslint-disable-next-line
var dateToStr = gantt.date.date_to_str('%d.%m.%Y')
var today = new Date()
function getChartScaleRange () {
  // eslint-disable-next-line
  var tasksRange = gantt.getSubtaskDates()
  var cells = []
  // eslint-disable-next-line
  var scale = gantt.getScale()
  if (!tasksRange.start_date) {
    return scale.trace_x
  }
  scale.trace_x.forEach(function (date) {
    if (date >= tasksRange.start_date && date <= tasksRange.end_date) {
      cells.push(date)
    }
  })
  return cells
}
// function getProgressLine () {
//   // eslint-disable-next-line
//   var tasks = gantt.getTaskByTime()
//   // eslint-disable-next-line
//   var scale = gantt.getScale()
//   var step = scale.unit
//   var timegrid = {}
//   var totalDuration = 0
//   // eslint-disable-next-line
//   gantt.eachTask(function (task) {
//     // eslint-disable-next-line
//     if (gantt.isSummaryTask(task)) {
//       return
//     }
//     if (!task.duration) {
//       return
//     }
//     var currDate = gantt.date[scale.unit + '_start'](new Date(task.start_date))
//     while (currDate < task.end_date) {
//       var date = currDate
//       // eslint-disable-next-line
//       currDate = gantt.date.add(currDate, 1, step)
//       // eslint-disable-next-line
//       if (!gantt.isWorkTime({ date: date, task: task, unit: step })) {
//         continue
//       }
//       var timestamp = currDate.valueOf()
//       if (!timegrid[timestamp]) {
//         timegrid[timestamp] = {
//           planned: 0,
//           real: 0
//         }
//       }
//       timegrid[timestamp].planned += 1
//       if (date <= today) {
//         timegrid[timestamp].real += 1 * (task.progress || 0)
//       }
//       totalDuration += 1
//     }
//   })
//   var cumulativePlannedDurations = []
//   var cumulativeRealDurations = []
//   var cumulativePredictedDurations = []
//   var totalPlanned = 0
//   var totalReal = 0
//   var chartScale = getChartScaleRange()
//   var dailyRealProgress = -1
//   var totalPredictedProgress = 0
//   for (var i = 0; i < chartScale.length; i++) {
//     var start = new Date(chartScale[i])
//     // eslint-disable-next-line
//     var end = gantt.date.add(start, 1, step)
//     var cell = timegrid[start.valueOf()] || { planned: 0, real: 0 }
//     totalPlanned = cell.planned + totalPlanned
//     cumulativePlannedDurations.push(totalPlanned)
//     if (start <= today) {
//       totalReal = (cell.real||0) + totalReal
//       cumulativeRealDurations.push(totalReal)
//       cumulativePredictedDurations.push(null)
//     } else {
//       if (dailyRealProgress < 0) {
//         dailyRealProgress = totalReal / cumulativeRealDurations.length
//         totalPredictedProgress = totalReal
//         cumulativePredictedDurations.pop()
//         cumulativePredictedDurations.push(totalPredictedProgress)
//       }
//       totalPredictedProgress += dailyRealProgress
//       cumulativePredictedDurations.push(totalPredictedProgress)
//     }
//   }
//   for (var i = 0; i < cumulativePlannedDurations.length; i++) {
//     cumulativePlannedDurations[i] = Math.round(cumulativePlannedDurations[i] / totalPlanned * 100)
//     if (cumulativeRealDurations[i] !== undefined) {
//       cumulativeRealDurations[i] = Math.round(cumulativeRealDurations[i] / totalPlanned * 100)
//     }
//     if (cumulativePredictedDurations[i] !== null) {
//       cumulativePredictedDurations[i] = Math.round(cumulativePredictedDurations[i] / totalPlanned * 100)
//     }
//   }
//   return { planned: cumulativePlannedDurations, real: cumulativeRealDurations, predicted: cumulativePredictedDurations }
// }
function getProgressLine () {
  // eslint-disable-next-line
  var tasks = gantt.getTaskByTime()
  // eslint-disable-next-line
  var scale = gantt.getScale()
  var step = scale.unit
  var timegrid = {}
  // eslint-disable-next-line
  var totalDuration = 0
  // eslint-disable-next-line
  gantt.eachTask(function (task) {
    // eslint-disable-next-line
    if (gantt.isSummaryTask(task) || task.type == gantt.config.types.phase) {
      return
    }
    if (!task.duration) {
      return
    }
    // eslint-disable-next-line
    var currDate = gantt.date[scale.unit + '_start'](new Date(task.start_date))
    while (currDate < task.end_date) {
      var date = currDate
      // eslint-disable-next-line
      currDate = gantt.date.add(currDate, 1, step)
      // eslint-disable-next-line
      if (!gantt.isWorkTime({ date: date, task: task, unit: step })) {
        continue
      }
      var timestamp = currDate.valueOf()
      if (!timegrid[timestamp]) {
        timegrid[timestamp] = {
          planned: 0,
          real: 0
        }
      }
      timegrid[timestamp].planned += 1
      if (date <= today) {
        timegrid[timestamp].real += 1 * (task.progress || 0)
      }
      totalDuration += 1
    }
  })
  var cumulativePlannedDurations = []
  var cumulativeDeviations = []
  var cumulativeRealDurations = []
  var cumulativePredictedDurations = []
  var totalPlanned = 0
  var totalReal = 0
  // eslint-disable-next-line
  var totalDeviation = 0
  var chartScale = getChartScaleRange()
  var dailyRealProgress = -1
  var totalPredictedProgress = 0
  for (var i = 0; i < chartScale.length; i++) {
    var start = new Date(chartScale[i])
    // eslint-disable-next-line
    var end = gantt.date.add(start, 1, step)
    var cell = timegrid[start.valueOf()] || { planned: 0, real: 0 }
    totalPlanned = cell.planned + totalPlanned
    cumulativePlannedDurations.push(totalPlanned)
    cumulativeDeviations.push(totalPlanned)

    if (start <= today) {
      totalReal = (cell.real || 0) + totalReal
      cumulativeRealDurations.push(totalReal)
      cumulativePredictedDurations.push(null)
    } else {
      if (dailyRealProgress < 0) {
        dailyRealProgress = totalReal / cumulativeRealDurations.length
        totalPredictedProgress = totalReal
        cumulativePredictedDurations.pop()
        cumulativePredictedDurations.push(totalPredictedProgress)
      }
      totalPredictedProgress += dailyRealProgress
      cumulativePredictedDurations.push(totalPredictedProgress)
    }
  }

  for (var j = 0; j < cumulativePlannedDurations.length; j++) {
    cumulativePlannedDurations[j] = Math.round(cumulativePlannedDurations[j] / totalPlanned * 100)
    if (cumulativeRealDurations[j] !== undefined) {
      cumulativeRealDurations[j] = Math.round(cumulativeRealDurations[j] / totalPlanned * 100)
      cumulativeDeviations[j] = Math.round(cumulativePlannedDurations[j] - cumulativeRealDurations[j])
    }

    if (cumulativePredictedDurations[j] !== null) {
      cumulativePredictedDurations[j] = Math.round(cumulativePredictedDurations[j] / totalPlanned * 100)
      cumulativeDeviations[j] = Math.round(cumulativePlannedDurations[j] - cumulativePredictedDurations[j])
    }
  }
  // console.log('deviation', cumulativePlannedDurations, cumulativeRealDurations, cumulativePredictedDurations, cumulativeDeviations)
  return { planned: cumulativePlannedDurations, real: cumulativeRealDurations, predicted: cumulativePredictedDurations, deviation: cumulativeDeviations }
}
function getScalePaddings () {
  // eslint-disable-next-line
  var scale = gantt.getScale()
  // eslint-disable-next-line
  var dataRange = gantt.getSubtaskDates()
  // eslint-disable-next-line
  var chartScale = getChartScaleRange()
  // eslint-disable-next-line
  var newWidth = scale.col_width
  var padding = {
    left: 0,
    right: 0
  }
  if (dataRange.start_date) {
    var yScaleLabelsWidth = 48
    // fine tune values in order to align chart with the scale range
    // eslint-disable-next-line
    padding.left = gantt.posFromDate(dataRange.start_date) - yScaleLabelsWidth
    // eslint-disable-next-line
    padding.right = scale.full_width - gantt.posFromDate(dataRange.end_date) - yScaleLabelsWidth
    // eslint-disable-next-line
    padding.top = gantt.config.row_height - 12
    // eslint-disable-next-line
    padding.bottom = gantt.config.row_height - 12
  }
  return padding
}

export default {
  lineOverlay (overlayControl) {
    var myChart
    return overlayControl.addOverlay(function (container) {
      var scaleLabels = []
      var chartScale = getChartScaleRange()
      chartScale.forEach(function (date) {
        scaleLabels.push(dateToStr(date))
      })
      var values = getProgressLine()
      var canvas = document.createElement('canvas')
      container.appendChild(canvas)
      canvas.style.height = container.offsetHeight + 'px'
      canvas.style.width = container.offsetWidth + 'px'
      var ctx = canvas.getContext('2d')
      if (myChart) {
        myChart.destroy()
      }
      // eslint-disable-next-line
      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Запланированное выполнение',
              backgroundColor: '#001eff',
              borderColor: '#001eff',
              data: values.planned,
              fill: false,
              cubicInterpolationMode: 'monotone'
            },
            {
              label: 'Фактическое выполнение',
              backgroundColor: '#ff5454',
              borderColor: '#ff5454',
              data: values.real,
              fill: false,
              cubicInterpolationMode: 'monotone'
            },
            {
              label: 'Планируемое выполнение (прогноз)',
              backgroundColor: '#ff5454',
              borderColor: '#ff5454',
              data: values.predicted,
              // borderDash: [5, 10],
              fill: false,
              cubicInterpolationMode: 'monotone'
            },
            {
              label: 'Отклонение от плана',
              backgroundColor: '#ffa011',
              borderColor: '#ffa011',
              data: values.deviation,
              borderDash: [5, 10],
              fill: false,
              cubicInterpolationMode: 'monotone'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: getScalePaddings()
          },
          onResize: function (chart, newSize) {
            // eslint-disable-next-line
            var dataRange = gantt.getSubtaskDates()
            if (dataRange.start_date) {
              // align chart with the scale range
              chart.options.layout.padding = getScalePaddings()
            }
          },
          legend: {
            display: false
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex]
                return dataset.label + ': ' + dataset.data[tooltipItem.index] + '%'
              }
            }
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              labels: scaleLabels,
              gridLines: {
                display: false
              },
              ticks: {
                display: false
              }
            },
            {
              position: 'top',
              labels: scaleLabels,
              gridLines: {
                display: false
              },
              ticks: {
                display: false
              }
            }
            ],
            yAxes: [{
              display: true,
              gridLines: {
                display: false
              },
              ticks: {
                display: true,
                min: 0,
                max: 100,
                stepSize: 10,
                callback: function (current) {
                  if (current > 100) { return '' }
                  return current + '%'
                }
              }
            },
            {
              display: true,
              position: 'right',
              gridLines: {
                display: false
              },
              ticks: {
                display: true,
                min: 0,
                max: 100,
                stepSize: 10,
                callback: function (current) {
                  if (current > 100) { return '' }
                  return current + '%'
                }
              } }
            ]
          }
        }
      })
      // console.log(canvas)
      return canvas
    })
  }
}
