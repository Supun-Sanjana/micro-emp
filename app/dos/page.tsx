'use client'
import React, { useEffect, useRef, useState } from 'react'

const Page = () => {
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(true)
  const runningRef = useRef(true)

  useEffect(() => {
    runningRef.current = running
  }, [running])

  useEffect(() => {
    let active = true

    const hammer = async () => {
      while (active && runningRef.current) {
        try {
          await fetch('/api/employees')
          setCount((c) => c + 1)
        } catch (e) {
          console.error('request failed', e)
        }
      }
    }

    // fire multiple parallel loops for more concurrent load
    const workers = 20
    for (let i = 0; i < workers; i++) {
      hammer()
    }

    return () => {
      active = false
    }
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Load Test Page</h1>
      <p>Requests sent: {count}</p>
      <button onClick={() => setRunning(false)}>Stop</button>
    </div>
  )
}

export default Page