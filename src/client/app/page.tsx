'use client'

import { useSession } from 'next-auth/react'

export default function Home() {
  const { data, status } = useSession()
  return (
    <main>
      <div>Home</div>
      <div>{JSON.stringify(data)}</div>
    </main>
  )
}
