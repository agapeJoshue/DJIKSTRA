'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { newData } from './page'

interface TableProps {
  entities: string[]
  data: newData[]
}

interface colsUsed {
  indexLine: number
  indexCol: number
  debut: string
  distance: number
}

const NewTable: React.FC<TableProps> = ({ entities, data }) => {
  const [initData, setData] = useState<newData[]>(data)

  useEffect(() => {
    setData(data)
  }, [data])

  const createTableArray = useMemo(() => {
    return (rows: number, cols: number) => {
      return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          value: '',
          min: false,
          from: ''
        }))
      )
    }
  }, [])

  const [newTable, setTable] = useState(
    createTableArray(entities.length, entities.length)
  )

  useEffect(() => {
    setTable(createTableArray(entities.length, entities.length))
  }, [entities])

  const verifyIfFirstRun = () => {
    let isFirst = true
    for (let i = 0; i < newTable.length; i++) {
      const line = newTable[i]
      if (line) {
        for (let j = 0; j < line.length; j++) {
          const cell = line[j]
          if (cell.value !== '') {
            isFirst = false
            break
          }
        }
      }
    }
    return isFirst
  }

  const verifyTable = () => {
    let haseEmpty = false
    for (let i = 0; i < newTable.length; i++) {
      const line = newTable[i]
      if (line) {
        for (let j = 0; j < line.length; j++) {
          const cell = line[j]
          if (cell.value === '') {
            haseEmpty = true
            break
          }
        }
      }
    }
    return haseEmpty
  }

  const [colsAlredyUsed, setCols] = useState<colsUsed[]>([])

  const verifyColumnIfHasMinValue = (col: number) => {
    let hasMin = false
    for (let i = 0; i < entities.length; i++) {
      const cell = newTable[i][col]
      if (cell && cell.min === true) {
        hasMin = true
      }
    }
    return hasMin
  }

  const verifyIfHasDuplicValue = (col: number, minValue: number) => {
    let line = 0
    for (let i = 0; i < entities.length; i++) {
      const cell = newTable[i][col]
      if (cell && parseInt(cell.value) === minValue) {
        line = i
      }
    }
    return line
  }

  const findMinTable = () => {
    let minValue = Number.MAX_SAFE_INTEGER
    let indexLine = 0
    let indexColumn = 0

    for (let i = 0; i < newTable.length; i++) {
      const line = newTable[i]
      if (line) {
        for (let j = 0; j < line.length; j++) {
          const cell = line[j]
          if (
            colsAlredyUsed &&
            colsAlredyUsed.filter(
              col => col.indexCol === j && col.indexLine === i
            ).length
          ) {
            console.log('i :', i, ' et j :', j)
          } else {
            if (
              cell.value !== '' &&
              cell.value !== '-' &&
              !verifyColumnIfHasMinValue(j) &&
              parseInt(cell.value) < minValue
            ) {
              minValue = parseInt(cell.value)
              indexLine = verifyIfHasDuplicValue(j, parseInt(cell.value))
              indexColumn = j
            }
          }
        }
      }
    }

    newTable[indexLine][indexColumn].min = true
    setCols(prev => [
      ...prev,
      {
        indexLine: indexLine,
        indexCol: indexColumn,
        debut: entities[indexColumn],
        distance: minValue
      }
    ])

    for (let i = colsAlredyUsed.length + 1; i < newTable.length; i++) {
      const verifyCol = colsAlredyUsed.filter(l => l.indexCol === indexColumn)
      const verifyLn = verifyCol.filter(l => l.indexLine === i)

      if (verifyLn.length === 0 && verifyCol.length === 0) {
        newTable[i][indexColumn].value = '-'
      }
    }
  }

  const concateTable = (From: string, lastDist: number, items: newData[]) => {
    const lineIndex = colsAlredyUsed.length
    const LineTable = newTable[lineIndex]

    items.forEach(item => {
      let indexItem
      if (From === item.debut) {
        indexItem = entities.indexOf(item.fin)
      } else {
        indexItem = entities.indexOf(item.debut)
      }
      if (LineTable && LineTable[indexItem].value === '') {
        const valueCell = {
          value: (lastDist + item.delais).toString(),
          min: false,
          from: From
        }
        LineTable[indexItem] = valueCell
      }
    })

    for (let i = 0; i < newTable.length; i++) {
      if (LineTable[i].value === '') {
        const valueCellPrec = newTable[lineIndex - 1][i]
        if (valueCellPrec && valueCellPrec.value !== '') {
          LineTable[i] = valueCellPrec
        } else {
          LineTable[i].value = '∞'
        }
      }
    }
  }

  const nextStep = () => {
    const hasEmpty = verifyTable()
    if (hasEmpty) {
      const isFirstRun = verifyIfFirstRun()
      if (isFirstRun) {
        const line = newTable[0]
        if (line && line.length) {
          for (let i = 0; i < line.length; i++) {
            if (i === 0) {
              line[i].value = '0'
            } else {
              line[i].value = '∞'
            }
          }
        }
        findMinTable()
      } else {
        const items = initData.filter(
          item =>
            item.debut === colsAlredyUsed[colsAlredyUsed.length - 1].debut ||
            item.fin === colsAlredyUsed[colsAlredyUsed.length - 1].debut
        )
        const fromValue = colsAlredyUsed[colsAlredyUsed.length - 1].debut
        const distLastFrom = colsAlredyUsed[colsAlredyUsed.length - 1].distance
        if (items) {
          concateTable(fromValue, distLastFrom, items)
          findMinTable()
        }
      }
    } else {
      console.log('update graph')
      console.log('colsAlredyUsed :', colsAlredyUsed)
    }
  }

  return (
    <>
      {entities.length > 0 && (
        <div className=''>
          <h2 className='text-lg font-semibold mb-4'>Table logique</h2>

          <table className='w-full border-collapse'>
            {/* TABLE HEADER */}
            <thead className='bg-gray-200'>
              <tr>
                {entities.map((entity, i) => (
                  <th key={i} className='p-3 border border-gray-400'>
                    {entity}
                  </th>
                ))}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {newTable.map((lines, index) => (
                <tr key={index}>
                  {lines.map((cell, i) => (
                    <td
                      key={i}
                      className={`border border-gray-400 ${
                        cell.min
                          ? 'bg-yellow-200 text-blue-500'
                          : cell.value === '-'
                          ? 'bg-gray-100 text-transparent'
                          : ''
                      }`}
                    >
                      <div className='h-[40px] flex items-center justify-center font-semibold'>
                        <p>
                          {cell.value} <sub>{cell.from}</sub>
                        </p>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className='flex justify-end mt-6'>
            <button
              onClick={nextStep}
              className='px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300'
            >
              CONTINUER
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default NewTable
