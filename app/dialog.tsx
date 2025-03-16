'use client'

import React, { useEffect, useState } from 'react'

interface useProps {
  model: boolean
  title: string
  onClose: () => void
  onSave: () => void
  children?: React.ReactNode
}

const Dialog: React.FC<useProps> = ({ model, title, onClose, children, onSave }) => {
  const [isOpen, setModel] = useState(model)

  useEffect(() => {
    setModel(model)
  }, [model])
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.8)] ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-screen max-h-[96%] overflow-y-auto'>
        <div className='bg-white w-[500px] rounded-md shadow-lg mx-auto mt-8'>
          {/* HEADER */}
          <div className='flex items-center justify-between pl-8 pr-5 py-6'>
            <h3 className='font-semibold text-xl'>{title}</h3>
            <button
              onClick={onClose}
              className='w-[36px] h-[36px] flex items-center justify-center text-gray-500 my-transition rounded-full hover:bg-gray-200 hover:text-red-500'
            >
              <i className='ri-close-fill text-2xl font-semibold'></i>
            </button>
          </div>

          {/* BODY */}
          <div className='px-8 pb-6'>{children}</div>

          {/* FOOTER */}
          <div className='p-6 flex items-center justify-end'>
            <button
              onClick={onSave}
              className='bg-blue-400 text-base text-white py-2 px-5 rounded hover:bg-blue-500 font-semibold my-transition'
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog
