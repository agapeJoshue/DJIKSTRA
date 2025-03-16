'use client'

import { useState } from 'react'
import Dialog from './dialog'
import Formulaire from './formulaire'
import Graph from './graph'
import NewTable from './NewTable'

export interface newData {
  debut: string
  fin: string
  delais: number
  editable: boolean
}

export default function Home () {
  const dataDefault = [
    { debut: 'A', fin: 'B', delais: 2, editable: false },
    { debut: 'A', fin: 'C', delais: 1, editable: false },
    { debut: 'A', fin: 'D', delais: 4, editable: false },
    { debut: 'B', fin: 'E', delais: 1, editable: false },
    { debut: 'B', fin: 'D', delais: 3, editable: false },
    { debut: 'B', fin: 'C', delais: 2, editable: false },
    { debut: 'C', fin: 'E', delais: 4, editable: false },
    { debut: 'C', fin: 'F', delais: 5, editable: false },
    { debut: 'D', fin: 'C', delais: 3, editable: false },
    { debut: 'D', fin: 'E', delais: 3, editable: false },
    { debut: 'D', fin: 'F', delais: 1, editable: false },
    { debut: 'E', fin: 'G', delais: 5, editable: false },
    { debut: 'E', fin: 'F', delais: 6, editable: false },
    { debut: 'F', fin: 'G', delais: 2, editable: false }
  ]

  const [model, setModel] = useState(false)

  const [initData, setInitialData] = useState<newData[]>([
    { debut: 'A', fin: 'B', delais: 1, editable: false }
  ])

  const onDataChange = (data: newData[]) => {
    setInitialData(data)
  }

  const saveData = () => {
    updateEntity()
    setModel(false)
  }

  const [entities, setEntity] = useState<string[]>([])
  const updateEntity = () => {
    const ArrayString: string[] = []

    const debut = dataDefault.filter(d => d.fin === 'A') ? 'A' : ''
    if (debut) {
      const debut = dataDefault.filter(d => d.fin === 'A') ? 'A' : ''
      ArrayString.push(debut)
    }

    dataDefault.map(data => {
      if (!ArrayString.includes(data.debut)) {
        ArrayString.push(data.debut)
      }
      if (!ArrayString.includes(data.fin)) {
        ArrayString.push(data.fin)
      }
      return data
    })
    setEntity(ArrayString)
  }
  return (
    <>
      <nav className='flex items-center justify-between bg-blue-500 px-24 py-4 shadow-md fixed top-0 left-0 w-screen'>
        <h3 className='text-gray-100 font-semibold text-2xl'>
          Algorithme de DJIKSTRA
        </h3>
        <div className='flex items-center gap-1'>
          <button
            onClick={() => setModel(true)}
            className='text-white border-2 border-gray-50 h-[45px] px-8 rounded font-semibold text-base'
          >
            Create data
          </button>
        </div>
      </nav>

      <section className='bg-white p-8 rounded-md shadow-lg w-[80%] mx-auto mt-24'>
        <h2 className='font-bold text-xl'>Graph</h2>
        <Graph data={dataDefault} />
      </section>

      <section className='bg-white p-8 rounded-md shadow-lg w-[80%] mx-auto mt-8'>
        <NewTable entities={entities} data={dataDefault} />
      </section>

      <Dialog
        model={model}
        title='Title'
        onClose={() => setModel(false)}
        onSave={saveData}
      >
        <Formulaire initData={initData} onDataChange={onDataChange} />
      </Dialog>
    </>
  )
}
