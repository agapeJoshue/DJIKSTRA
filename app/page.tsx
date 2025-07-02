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
  complete_table2,
  find_critics_path,
  find_critics_path_max
} from './logique'

const Dijkstra = () => {
  const [message, setMessage] = useState('Merci de votre aimable attention!');
  const [model, setModel] = useState(false)
  const [initData, setInitialData] = useState<InitData[]>(INIT_DATA)
  const [data, setData] = useState<newData[]>([]);
  const [data2, setData2] = useState<newData[]>([]);
  const [entities, setEntities] = useState<string[]>([])
  const [entities2, setEntities2] = useState<string[]>([])
  const [my_table, setTable] = useState<TableCell[][]>([])
  const [my_table2, setTable2] = useState<TableCell[][]>([])
  const [step, setStep] = useState(0)
  const [step2, setStep2] = useState(0)
  const [critics, setCritics] = useState<string[]>([])
  const [critics2, setCritics2] = useState<string[]>([])
  const [modal_finished, set_modal_finished] = useState(false)

  const createTableArray = useMemo(() => {
    return (rows: number, cols: number) => {
      return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          value: '',
          min: false,
          max: false,
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
    show_critics: false,
    show_graph_max: false,
    table_max_completed: false,
    show_max_critics: false
  })

  const saveData = () => {
    const { newData, ArrayString } = updateEntity(initData)
    setTable(createTableArray(ArrayString.length, ArrayString.length))
    setTable2(createTableArray(ArrayString.length, ArrayString.length))
    setEntities(ArrayString)
    setEntities2(ArrayString)
    setData(newData)
    setData2(newData)
    setModel(false)
    setStep(0)
    setCritics([])
    setCritics2([])
    updateConditionsStep({
      show_graph: true,
      table_completed: false,
      show_critics: false,
      show_graph_max: false,
      table_max_completed: false,
      show_max_critics: false
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
    } else if (conditionsStep.table_completed && !conditionsStep.show_critics && step >= 0) {
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
      conditionsStep.show_critics = true;
      conditionsStep.show_graph_max = true;
      setMessage("Très bien ! Maintenant que le calcul du minimum est terminé, nous allons nous concentrer sur le maximum.");
      set_modal_finished(true);
    }
  }

  const nextStep2 = () => {
    if (conditionsStep.show_graph_max && !conditionsStep.table_max_completed) {
      // complete table max
      if (step2 < entities2.length) {
        complete_table2(my_table2, data2, step2, entities2)
        setStep2(step2 + 1)
      } else {
        conditionsStep.table_max_completed = true
        const { table, nextStep, critic } = find_critics_path_max(
          my_table2,
          entities2.length - 1,
          entities2
        )
        setCritics2(prev => [...prev, critic])
        setTable2(table)
        setStep2(nextStep)
      }
    } else if (conditionsStep.table_max_completed && !conditionsStep.show_max_critics && step2 >= 0) {
      // show critics
      const { table, nextStep, critic } = find_critics_path_max(
        my_table2,
        step2,
        entities2
      )
      setCritics2(prev => [...prev, critic])
      setTable2(table)
      setStep2(nextStep)
    } else {
      conditionsStep.show_max_critics = true
      setMessage('Merci de votre aimable attention!');
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
            <h2 className='font-bold text-lg mb-5'>Graph MIN</h2>
          </div>

          <NewGraph data={data} critics={critics} />
          <NewTable entities={entities} table={my_table} />

          {conditionsStep.show_critics && (
            <div className='mt-10 py-8'>
              <div>
                <h2 className='font-bold text-lg mb-5'>Graph MAX</h2>
              </div>

              <NewGraph data={data2} critics={critics2} />
              <NewTable entities={entities2} table={my_table2} />
            </div>
          )}

          <Dialog
            model={modal_finished}
            title='FINISHED'
            onClose={() => set_modal_finished(false)}
            onSave={() => set_modal_finished(false)}
            btnPropriety={{ color: 'grey', label: 'Okay' }}
          >
            <p className='font-semibold text-lg text-gray-700'>
              {message}
            </p>
          </Dialog>

          <div
            className={`flex items-center justify-end mt-8 ${entities.length > 0 ? '' : 'hidden'
              }`}
          >
            {conditionsStep.show_critics ? (
              <button
                onClick={nextStep2}
                className='py-2 px-5 text-sm font-semibold text-white bg-blue-400 rounded shadow-md hover:bg-blue-500 my-transition'
              >
                continue
              </button>
            ) : (
              <button
                onClick={nextStep}
                className='py-2 px-5 text-sm font-semibold text-white bg-blue-400 rounded shadow-md hover:bg-blue-500 my-transition'
              >
                continue
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className='bg-white p-8 rounded-md shadow-lg w-[80%] mx-auto mt-24 py-32'>
          <div className='flex flex-col items-center justify-center'>
            <i className='ri-error-warning-line text-[100px] text-gray-500'></i>
            <p className='font-medium text-base text-gray-600'>You have no data</p>
          </div>
        </section>
      )}

      <Dialog
        model={model}
        title='Create data'
        onClose={() => setModel(false)}
        onSave={saveData}
      >
        <Formulaire initData={initData} onDataChange={onDataChange} />
      </Dialog>
    </div>
  )
}

export default Dijkstra
