'use client'

import React, { useEffect, useState } from 'react'
import { newData } from './page'
interface GraphProps {
  data: newData[]
  critics: string[]
}

const Graph: React.FC<GraphProps> = ({ data, critics }) => {
  const [graphData, setGraphData] = useState<newData[]>(data)
  const [nodePositions, setNodePositions] = useState<{
    [key: string]: { x: number; y: number }
  }>({})

  useEffect(() => {
    setGraphData(data)
    generateNodePositions(data)
  }, [data])

  const [newCritics, setNewCritics] = useState(critics)

  useEffect(() => {
    setNewCritics(critics)
  }, [critics])

  const generateNodePositions = (data: newData[]) => {
    const nodes = Array.from(new Set(data.flatMap(d => [d.debut, d.fin])))
    const positions: { [key: string]: { x: number; y: number } } = {}
    const spacingX = 120
    const spacingY = 100

    nodes.forEach((node, index) => {
      positions[node] = {
        x: 100 + index * spacingX,
        y: 200 + (index % 2 === 0 ? 0 : spacingY)
      }
    })

    setNodePositions(positions)
  }

  const isCritics = (node: string) => {
    return newCritics.includes(node);
  }

  return (
    <div className='flex justify-center items-center'>
      <svg
        width='100%'
        height='500'
        className='flex items-center justify-center bg-gray-100'
      >
        {graphData.map((edge, index) => {
          const { debut, fin, delais } = edge
          const start = nodePositions[debut]
          const end = nodePositions[fin]

          if (!start || !end) return null

          return (
            <g key={index}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke='black'
                strokeWidth='2'
              />
              <text
                x={(start.x + end.x) / 2 + (start.y < end.y ? 10 : -10)}
                y={(start.y + end.y) / 2 + (start.x < end.x ? -10 : 10)}
                fontSize='18'
                fill='black'
                fontWeight='semibold'
              >
                {delais}
              </text>
            </g>
          )
        })}

        {Object.entries(nodePositions).map(([node, pos]) => (
          <g key={node}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r='20'
              fill={`${ isCritics(node) ? 'red' : 'white'}`}
              stroke={`${ isCritics(node) ? 'blue' : 'black'}`}
              strokeWidth='2'
            />
            <text x={pos.x - 5} y={pos.y + 5} fontSize='16' fill={`${ isCritics(node) ? 'white' : 'black'}`}>
              {node}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default Graph
