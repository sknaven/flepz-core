import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Layout from '@/components/Layout'
import MessageList from '@/components/MessageList'
import PreferencesPanel from '@/components/PreferencesPanel'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { Message, Preference } from '@/lib/types'

export default function Inbox() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [preferences, setPreferences] = useState<Preference[]>([])
  const [loading, setLoading] = useState(true)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/')
    } else {
      fetchData()
    }
  }, [session, router])

  const fetchData = async () => {
    if (!session) return

    try {
      // Fetch user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('preferences')
        .select('*')
        .eq('user_id', session.user.id)

      if (prefsError) throw prefsError

      // If no preferences exist, create defaults
      if (!prefsData || prefsData.length === 0) {
        const defaultPrefs = ['order', 'invoice', 'shipping'].map(type => ({
          user_id: session.user.id,
          message_type: type,
          enabled: true
        }))

        const { data: newPrefs, error: createError } = await supabase
          .from('preferences')
          .insert(defaultPrefs)
          .select()

        if (createError) throw createError
        setPreferences(newPrefs || [])
      } else {
        setPreferences(prefsData)
      }

      // Fetch messages
      const enabledTypes = (prefsData || [])
        .filter(p => p.enabled)
        .map(p => p.message_type)

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_email', session.user.email)
        .in('type', enabledTypes.length > 0 ? enabledTypes : ['none'])
        .order('created_at', { ascending: false })

      if (messagesError) throw messagesError
      setMessages(messagesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handlePreferenceUpdate = async (preference: Preference) => {
    const { error } = await supabase
      .from('preferences')
      .update({ enabled: preference.enabled })
      .eq('id', preference.id)

    if (!error) {
      await fetchData()
    }
  }

  if (!session || loading) {
    return <LoadingSpinner />
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Flepz Inbox</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{session.user.email}</span>
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="btn-secondary text-sm"
                >
                  Preferences
                </button>
                <button
                  onClick={handleSignOut}
                  className="btn-primary text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MessageList messages={messages} />
            </div>
            {showPreferences && (
              <div className="lg:col-span-1">
                <PreferencesPanel
                  preferences={preferences}
                  onUpdate={handlePreferenceUpdate}
                  onClose={() => setShowPreferences(false)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  )
}