import { AuthProvider } from '@/components/auth-provider'
import { Header } from '@/components/header'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  )
}
