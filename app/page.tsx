'use client'

import { useMemo, useState } from 'react'
import Dialog from './dialog'
import Formulaire from './formulaire'
import NewGraph from './graph'
import NewTable from './NewTable'
import {
  INIT_DATA,
  InitData,
  newData,
  TableCell,
  updateEntity,
  complete_table,
  find_critics_path
} from './logique'

const Dijkstra = () => {
  const [model, setModel] = useState(false)
  const [initData, setInitialData] = useState<InitData[]>(INIT_DATA)
  const [data, setData] = useState<newData[]>([])
  const [entities, setEntities] = useState<string[]>([])
  const [my_table, setTable] = useState<TableCell[][]>([])
  const [step, setStep] = useState(0)
  const [critics, setCritics] = useState<string[]>([])
  const [modal_finished, set_modal_finished] = useState(false)

  const createTableArray = useMemo(() => {
    return (rows: number, cols: number) => {
      return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          value: '',
          min: false,
          from: '',
          already_used: false,
          isCritics: false
        }))
      )
    }
  }, [])

  const onDataChange = (data: InitData[]) => {
    setInitialData(data)
  }

  const [conditionsStep, updateConditionsStep] = useState({
    show_graph: false,
    table_completed: false,
    show_critics: false
  })

  const saveData = () => {
    const { newData, ArrayString } = updateEntity(initData)
    setTable(createTableArray(ArrayString.length, ArrayString.length))
    setEntities(ArrayString)
    setData(newData)
    setModel(false)
    setStep(0)
    updateConditionsStep({
      show_graph: true,
      table_completed: false,
      show_critics: false
    })
  }

  const nextStep = () => {
    if (conditionsStep.show_graph && !conditionsStep.table_completed) {
      // complete table
      if (step < entities.length) {
        complete_table(my_table, data, step, entities)
        setStep(step + 1)
      } else {
        conditionsStep.table_completed = true
        const { table, nextStep, critic } = find_critics_path(
          my_table,
          entities.length - 1,
          entities
        )
        setCritics(prev => [...prev, critic])
        setTable(table)
        setStep(nextStep)
      }
    } else if (
      conditionsStep.table_completed &&
      !conditionsStep.show_critics &&
      step >= 0
    ) {
      // show critics
      const { table, nextStep, critic } = find_critics_path(
        my_table,
        step,
        entities
      )
      setCritics(prev => [...prev, critic])
      setTable(table)
      setStep(nextStep)
    } else {
      set_modal_finished(true)
    }
  }

  return (
    <div className='pb-16'>
      <nav className='flex items-center justify-between bg-blue-500 px-24 py-4 shadow-md fixed top-0 left-0 w-screen'>
        <h3 className='text-gray-100 font-semibold text-2xl'>
          Algorithme de DIJKSTRA
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

      {conditionsStep.show_graph ? (
        <section className='bg-white p-8 rounded-md shadow-lg w-[80%] mx-auto mt-24'>
          <div>
            <h2 className='font-bold text-lg mb-5'>Graph</h2>
          </div>

          <NewGraph data={data} critics={critics} />
          <NewTable entities={entities} table={my_table} />

          <Dialog
            model={modal_finished}
            title='FINISHED'
            onClose={() => set_modal_finished(false)}
            onSave={() => set_modal_finished(false)}
            btnPropriety={{ color: 'grey', label: 'Okay' }}
          >
            <p className='font-semibold text-lg text-gray-700'>
              Merci de votre aimable attention!
            </p>
          </Dialog>

          <div
            className={`flex items-center justify-end mt-8 ${
              entities.length > 0 ? '' : 'hidden'
            }`}
          >
            <button
              onClick={nextStep}
              className='py-2 px-5 text-sm font-semibold text-white bg-blue-400 rounded shadow-md hover:bg-blue-500'
            >
              continue
            </button>
          </div>
        </section>
      ) : (
        <section></section>
      )}

      <Dialog
        model={model}
        title='Title'
        onClose={() => setModel(false)}
        onSave={saveData}
      >
        <Formulaire initData={initData} onDataChange={onDataChange} />
      </Dialog>
    </div>
  )
}

export default Dijkstra
