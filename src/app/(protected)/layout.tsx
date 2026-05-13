import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Camera, LogOut, LayoutDashboard } from 'lucide-react'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Optional: Fetch photographer profile from DB if you want to display their name
  const { data: photographer } = await supabase
    .from('photographers')
    .select('name')
    .eq('email', user.email)
    .single()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass sticky top-0 z-50 border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                <Camera size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">
                SelectAssist
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-lg border border-foreground/10">
                <span className="text-sm font-medium text-foreground/80">
                  {photographer?.name || user.email}
                </span>
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
