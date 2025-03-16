'use client'

import React, { useEffect, useState } from 'react'
import { newData } from './page'

interface useProps {
  data: newData[]
}

const Graph: React.FC<useProps> = ({ data }) => {
  const [newData, setData] = useState<newData[]>(data)

  useEffect(() => {
    setData(data)
  }, [data])
  return (
    <div className={`grid grid-cols-[repeat(14,1fr)] border rounded mt-8 border-gray-600`}>
      {newData.map((item, index) => (
        <div key={index} className='flex flex-col items-center justify-center border-r last:border-none  border-gray-600'>
          <p className='p-2'>{item.debut}</p>
          <p className='p-2'>{item.fin}</p>
          <p className='p-2'>{item.delais}</p>
        </div>
      ))}
    </div>

    
  )
}

export default Graph
