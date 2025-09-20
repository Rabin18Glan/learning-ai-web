import React, { ReactNode } from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <div >
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1488998427799-e3362cec87c3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0dWR5fGVufDB8fDB8fHww')] bg-cover bg-center -z-10" />
        {
        children}</div>
  )
}

export default layout