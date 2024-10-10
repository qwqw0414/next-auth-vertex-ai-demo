'use client'

import { SessionProvider, SessionProviderProps } from "next-auth/react"
import { Fragment } from "react"

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session: SessionProviderProps["session"]
}) {
  return (
    <Fragment>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </Fragment>
  )
}