'use client'
import React, { useEffect, useRef, useState } from 'react'

const Page = () => {
  const [reads, setReads] = useState(0)
  const [writes, setWrites] = useState(0)
  const [errors, setErrors] = useState(0)
  const [running, setRunning] = useState(true)
  const runningRef = useRef(true)

  useEffect(() => {
    runningRef.current = running
  }, [running])

  useEffect(() => {
    let active = true

    const hammer = async () => {
      let i = 0
      while (active && runningRef.current) {
        try {
          if (i % 2 === 0) {
            // WRITE
            await fetch('/api/employees', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                firstName: 'Load',
                lastName: 'Test',
                email: `loadtest+${Date.now()}${Math.random()}@test.com`,
                designation: 'Tester',
                branch: 'LoadTest',
              }),
            })
            setWrites((w) => w + 1)
          } else {
            // READ
            await fetch('/api/employees')
            setReads((r) => r + 1)
          }
        } catch (e) {
          setErrors((e) => e + 1)
        }
        i++
      }
    }

    const workers = 20
    for (let w = 0; w < workers; w++) {
      hammer()
    }

    return () => {
      active = false
    }
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Load Test Page (Read + Write)</h1>
      <p>Reads: {reads}</p>
      <p>Writes: {writes}</p>
      <p>Errors: {errors}</p>
      <button onClick={() => setRunning(false)}>Stop</button>
    </div>
  )
}

export default Page