'use client'

import React, { ChangeEvent, useEffect, useState } from 'react'
import { InitData } from './logique'

interface useProps {
  initData: InitData[]
  onDataChange: (newData: InitData[]) => void
}

const Formulaire: React.FC<useProps> = ({ initData, onDataChange }) => {
  const [data, setData] = useState<InitData[]>(initData)

  const handleChangeInput = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    type: 'debut' | 'fin' | 'delais'
  ) => {
    setData(prevData =>
      prevData.map((task, i) => {
        if (i === index) {
          if (type === 'delais') {
            const newValue = parseInt(e.target.value, 10) || 0
            return { ...task, delais: newValue }
          } else {
            const newValue = e.target.value
            if (type === 'debut') {
              return { ...task, debut: newValue }
            } else {
              return { ...task, fin: newValue }
            }
          }
        }
        return task
      })
    )
  }

  const handleAddData = () => {
    setData(prevData => [
      ...prevData,
      {
        debut: data.length === 0 ? 'A' : '',
        fin: '',
        delais: 1,
        editable: true
      }
    ])
  }

  const handleDeleteData = (index: number) => {
    setData(prevData => prevData.filter((d, i) => i !== index))
  }

  useEffect(() => {
    setData(initData)
  }, [initData])

  useEffect(() => {
    onDataChange(data)
  }, [data, onDataChange])
  return (
    <div className='flex flex-col gap-4'>
      {data.map((d, i) => (
        <div
          key={i}
          className='grid grid-cols-[3rem_6rem_3rem_1rem_5rem_1.4rem] items-center justify-between mr-2'
        >
          <input
            type='text'
            value={i === 0 ? 'A' : d.debut}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeInput(e, i, 'debut')
            }
            className='outline-none border border-gray-500 rounded text-lg font-medium py-2 px-4 text-center'
            maxLength={1}
            disabled={i === 0}
            required
          />
          <div className='flex items-center gap-2'>
            <p className='border border-gray-600 w-full'></p>
            <p className='text-center text-lg font-medium'>vers</p>
            <p className='border border-gray-600 w-full'></p>
          </div>
          <input
            type='text'
            value={d.fin}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeInput(e, i, 'fin')
            }
            className='outline-none border border-gray-500 rounded text-lg font-medium py-2 px-4 text-center'
            maxLength={1}
            required
          />
          <p>=</p>
          <input
            type='text'
            value={d.delais}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeInput(e, i, 'delais')
            }
            className='outline-none border border-gray-500 rounded text-lg font-medium py-2 px-4 text-center'
            maxLength={2}
            required
          />

          <button
            onClick={() => handleDeleteData(i)}
            className='w-[40px] h-[40px] flex items-center justify-center text-gray-500 my-transition rounded-full hover:bg-gray-200 hover:text-gray-800'
          >
            <i className='ri-delete-back-2-line text-2xl font-semibold'></i>
          </button>
        </div>
      ))}

      <button
        onClick={handleAddData}
        className='mt-6 p-3 w-full text-base font-semibold rounded border-2 border-dashed border-gray-600 text-gray-600'
      >
        Add input
      </button>
    </div>
  )
}

export default Formulaire
