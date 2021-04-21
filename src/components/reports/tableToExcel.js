import store from '../../store'
import { saveAs } from 'file-saver'
function projectID (val) {
  var res = store.getters.projects.find(f => f.Name === val)
  if (res) {
    return res.Id
  } else {
    return ''
  }
}
//
function compleatedCount (data) {
  const find = data.find(f => f.Status === 3)
  if (find) {
    return find.data.length
  } else {
    return 0
  }
}
function compleatedOverdueCount (data) {
  const find = data.find(f => f.Status === 3)
  if (find) {
    const filtered = find.data.filter(fi => fi.Delay > 0)
    if (filtered && filtered.length > 0) {
      return filtered.length
    } else {
      return 0
    }
  } else {
    return 0
  }
}
function inworkCount (data) {
  const find = data.filter(f => f.Status === 5 || f.Status === 2)
  if (find && find.length > 0) {
    let count = 0
    for (let i = 0; i < find.length; i++) {
      count += find[i].data.length
    }
    return count
  } else {
    return 0
  }
}
function overdueCount (data) {
  const find = data.find(f => f.Status === 5)
  if (find) {
    return find.data.length
  } else {
    return 0
  }
}
function shsCount (data) {
  const findOverPir = data.find(f => f.Status === 5)
  let count = 0
  if (findOverPir) {
    const filteredPir = findOverPir.data.filter(f => f.IsPenaltiesApplied)
    if (filteredPir && filteredPir.length > 0) {
      count += filteredPir.length
    }
  }
  return count
}
function pirCount (data) {
  const findPir = data.find(f => f.Status === 6)
  let count = 0
  if (findPir) {
    count += findPir.data.length
  }
  return count
}
//
export default {
  toExcel (data, images, finalData) {
    const ExcelJS = require('exceljs')
    let wb = new ExcelJS.Workbook()
    let workbookName = data.fileName + '.xlsx'
    for (let i = 0; i < data.datas.length; i++) {
      let sheet = data.datas[i]
      let ws = wb.addWorksheet(sheet.sheetName, { properties: { tabColor: { argb: sheet.sheetColor } } })
      let sheetCols = []
      let colIDNumber = 0
      let colDmsNumber = 0
      let colProjectNumber = 0
      for (let s = 0; s < sheet.sheetHeader.length; s++) {
        sheetCols.push({ key: sheet.sheetFilter[s], header: sheet.sheetHeader[s], width: sheet.columnWidths[s] * 4 })
        ws.getCell(1, s + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        ws.getCell(1, s + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3EAFF' } }
        if (sheet.sheetFilter[s] === 'Project') {
          colProjectNumber = s + 1
        }
        if (sheet.sheetFilter[s] === 'Dms') {
          colDmsNumber = s + 1
        }
        if (sheet.sheetFilter[s] === 'Name') {
          colIDNumber = s + 1
        }
      }
      ws.columns = sheetCols
      ws.getRow(1).font = { bold: true }
      ws.getRow(1).height = 36
      ws.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' }
      ws.views = [{ state: 'frozen', ySplit: 1 }]
      ws.addRows(sheet.sheetData)
      for (let d = 0; d < sheet.sheetData.length; d++) {
        // if (d < 5) {
        //   sheet.sheetData[d].level = 1
        //   ws.getRow(d + 2).outlineLevel = 1
        // }
        // if (d >= 5 && d < 10) {
        //   sheet.sheetData[d].level = 1.1
        //   ws.getRow(d + 2).outlineLevel = 1
        // }
        // if (d >= 10 && d < 24) {
        //   sheet.sheetData[d].level = 1.2
        //   ws.getRow(d + 2).outlineLevel = 1
        // }
        // console.log('colProjectNumber', colProjectNumber)
        if (colProjectNumber !== 0) {
          ws.getCell(d + 2, colProjectNumber).value = {
            text: sheet.sheetData[d].Project,
            hyperlink: 'http://' + window.location.hostname + '/Projects/Project/AllInfo/' + projectID(sheet.sheetData[d].Project),
            tooltip: 'Перейти к проекту'
          }
          ws.getCell(d + 2, colProjectNumber).font = {
            color: { argb: '3E6579' },
            underline: false
          }
        }
        if (colDmsNumber !== 0) {
          ws.getCell(d + 2, colDmsNumber).value = {
            text: sheet.sheetData[d].Dms,
            hyperlink: 'http://' + window.location.hostname + '/Documents/Document/View/' + sheet.sheetData[d].Contract,
            tooltip: 'Перейти к договору'
          }
          ws.getCell(d + 2, colDmsNumber).font = {
            color: { argb: '3E6579' },
            underline: false
          }
        }
        if (colIDNumber !== 0) {
          ws.getCell(d + 2, colIDNumber).value = {
            text: sheet.sheetData[d].Name,
            hyperlink: 'http://' + window.location.hostname + sheet.sheetData[d].Id + '?uid=6513f28b-13a3-4e74-aa8f-010353c88ef2',
            tooltip: 'Перейти к обязательству'
          }
          ws.getCell(d + 2, colIDNumber).font = {
            color: { argb: '3E6579' },
            underline: false
          }
        }
      }
    }
    //
    // Сводные данные
    let wsi = wb.addWorksheet('Сводные данные', { properties: { tabColor: { argb: 'd1d1d1' } } })
    let headerStyle = { font: { bold: true }, alignment: { horizontal: 'left', vertical: 'middle', wrapText: true } }
    let headerStyleCenter = { font: { bold: true }, alignment: { horizontal: 'center', vertical: 'middle', wrapText: true } }
    let border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    let fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3EAFF' } }
    let font = { color: { argb: 'A10303' } }
    let width = 15
    //
    wsi.views = [{ showGridLines: false }]
    // Merge cells
    wsi.mergeCells('A1:H2')
    wsi.getCell('A1').style = headerStyle
    wsi.getCell('A1').border = border
    wsi.getCell('H2').border = border
    wsi.getCell('A1').master.border = border
    wsi.getCell('A1').fill = fill
    wsi.getCell('A1').value = 'Сводные данные'
    // expect(wsi.getCell('A1').value).toBe(wsi.getCell('H2').value)
    // expect(wsi.getCell('A1').master).toBe(wsi.getCell('H2'))
    // expect(wsi.getCell('A1').border).toBe(wsi.getCell('H2').border)
    // const rows = wsi.getRows(5, 2)
    // row.eachCell(function(cell, colNumber) {
    //   console.log('Cell ' + colNumber + ' = ' + cell.value);
    // })
    //
    wsi.mergeCells('I1:I2')
    wsi.getCell('I1').style = headerStyleCenter
    wsi.getCell('I1').border = border
    wsi.getCell('I2').border = border
    wsi.getCell('I1').master.border = border
    wsi.getCell('I1').fill = fill
    wsi.getCell('I1').value = 'Всего'
    //
    wsi.mergeCells('J1:K1')
    wsi.getCell('J1').style = headerStyleCenter
    wsi.getCell('J1').border = border
    wsi.getCell('K1').border = border
    wsi.getCell('J1').master.border = border
    wsi.getColumn('J').width = width
    wsi.getColumn('K').width = width
    wsi.getCell('J1').fill = fill
    wsi.getCell('J1').value = 'Исполнено'
    //
    wsi.mergeCells('L1:M1')
    wsi.getCell('L1').style = headerStyleCenter
    wsi.getCell('L1').border = border
    wsi.getCell('M1').border = border
    wsi.getCell('L1').master.border = border
    wsi.getColumn('L').width = width
    wsi.getColumn('M').width = width
    wsi.getCell('L1').fill = fill
    wsi.getCell('L1').value = 'В работе'
    //
    wsi.mergeCells('N1:O1')
    wsi.getCell('N1').style = headerStyleCenter
    wsi.getCell('N1').border = border
    wsi.getCell('O1').border = border
    wsi.getCell('N1').master.border = border
    wsi.getColumn('N').width = width
    wsi.getColumn('O').width = width
    wsi.getCell('N1').fill = fill
    wsi.getCell('N1').value = 'ПИР'
    //
    wsi.getCell('J2').style = headerStyleCenter
    wsi.getCell('J2').border = border
    wsi.getCell('J2').fill = fill
    // wsi.getCell('J2').width = width
    wsi.getCell('J2').value = 'Всего'
    //
    wsi.getCell('K2').style = headerStyleCenter
    wsi.getCell('K2').border = border
    wsi.getCell('K2').fill = fill
    // wsi.getCell('K2').width = width
    wsi.getCell('K2').value = 'С просрочкой'
    //
    wsi.getCell('L2').style = headerStyleCenter
    wsi.getCell('L2').border = border
    wsi.getCell('L2').fill = fill
    // wsi.getCell('L2').width = width
    wsi.getCell('L2').value = 'Всего'
    //
    wsi.getCell('M2').style = headerStyleCenter
    wsi.getCell('M2').border = border
    wsi.getCell('M2').fill = fill
    // wsi.getCell('M2').width = width
    wsi.getCell('M2').value = 'Просрочено'
    //
    wsi.getCell('N2').style = headerStyleCenter
    wsi.getCell('N2').border = border
    wsi.getCell('N2').fill = fill
    // wsi.getCell('N2').width = width
    wsi.getCell('N2').value = 'Просрочено (ШС)'
    //
    wsi.getCell('O2').style = headerStyleCenter
    wsi.getCell('O2').border = border
    wsi.getCell('O2').fill = fill
    // wsi.getCell('O2').width = width
    wsi.getCell('O2').value = 'Инициирована'
    //
    const lastRow = finalData.length + 5
    for (let i = 0; i < finalData.length; i++) {
      const item = finalData[i]
      let co = compleatedOverdueCount(item.data)
      let oc = overdueCount(item.data)
      let sh = shsCount(item.data)
      let pc = pirCount(item.data)
      wsi.mergeCells(`A${i + 3}:H${i + 3}`)
      wsi.getCell('A' + (i + 3)).value = item.Name
      wsi.getCell('A' + (i + 3)).border = border
      wsi.getCell('H' + (i + 3)).border = border
      wsi.getCell('I' + (i + 3)).value = item.Count
      wsi.getCell('I' + (i + 3)).border = border
      wsi.getCell('J' + (i + 3)).value = compleatedCount(item.data)
      wsi.getCell('J' + (i + 3)).border = border
      if (co > 0) {
        wsi.getCell('K' + (i + 3)).font = font
      }
      wsi.getCell('K' + (i + 3)).value = compleatedOverdueCount(item.data)
      wsi.getCell('K' + (i + 3)).border = border
      wsi.getCell('L' + (i + 3)).value = inworkCount(item.data)
      wsi.getCell('L' + (i + 3)).border = border
      if (oc > 0) {
        wsi.getCell('M' + (i + 3)).font = font
      }
      wsi.getCell('M' + (i + 3)).value = oc
      wsi.getCell('M' + (i + 3)).border = border
      if (sh > 0) {
        wsi.getCell('N' + (i + 3)).font = font
      }
      wsi.getCell('N' + (i + 3)).value = sh
      wsi.getCell('N' + (i + 3)).border = border
      if (pc > 0) {
        wsi.getCell('O' + (i + 3)).font = font
      }
      wsi.getCell('O' + (i + 3)).value = pc
      wsi.getCell('O' + (i + 3)).border = border
    }
    let row1 = wsi.getRow(1)
    let row2 = wsi.getRow(2)
    row1.height = 30
    row2.height = 30

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageId = wb.addImage({
          base64: images[i].url,
          extension: 'png'
        })
        if (i === 0) {
          wsi.addImage(imageId, {
            tl: { col: 1, row: lastRow },
            ext: { width: images[i].width, height: images[i].height }
          })
        }
        if (i === 1) {
          wsi.addImage(imageId, {
            tl: { col: 9, row: lastRow },
            ext: { width: images[i].width, height: images[i].height }
          })
        }
        if (i === 2) {
          wsi.addImage(imageId, {
            tl: { col: 1, row: lastRow + 11 },
            ext: { width: images[i].width, height: images[i].height }
          })
        }
        if (i === 3) {
          wsi.addImage(imageId, {
            tl: { col: 9, row: lastRow + 11 },
            ext: { width: images[i].width, height: images[i].height }
          })
        }
      }
    }

    // const myBase64Image = ''

    // // ws.addImage(imageId, 'B2:N25')

    //
    console.log(data)
    wb.xlsx.writeBuffer()
      .then(function (buffer) {
        saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          workbookName
        )
      })
  }
}
