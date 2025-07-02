'use client'
import React, { useEffect, useState } from 'react'
import { TableCell } from './logique'

interface useProps {
  table: TableCell[][]
  entities: string[]
}

const NewTable: React.FC<useProps> = ({ table, entities }) => {
  const [newEntities, setEntities] = useState<string[]>(entities)
  const [newArray, setArray] = useState<TableCell[][]>(table)

  useEffect(() => {
    console.log('table changed')
    setEntities(entities)
    setArray(table)
  }, [table, entities])

  return (
    <>
      {newEntities.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-lg font-semibold mb-4'>Table logique</h2>

          <table className='w-full border-collapse'>
            {/* TABLE HEADER */}
            <thead className='bg-gray-200'>
              <tr>
                {newEntities.map((entity, i) => (
                  <th key={i} className='p-3 border border-gray-400'>
                    {entity}
                  </th>
                ))}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {newArray.map((lines, index) => (
                <tr key={index}>
                  {lines.map((cell, i) => (
                    <td
                      key={i}
                      className={`border border-gray-400 ${cell.min || cell.max && !cell.isCritics
                        ? 'bg-yellow-200 text-blue-500'
                        : cell.value === '-'
                          ? 'bg-gray-100 text-transparent'
                          : cell.min && cell.isCritics
                            ? 'bg-yellow-500 text-white'
                            : cell.max && cell.isCritics ? 'bg-yellow-200 text-blue-500' : ''
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
        </div>
      )}
    </>
  )
}

export default NewTable
