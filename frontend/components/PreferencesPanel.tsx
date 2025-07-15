import { Preference } from '@/lib/types'

interface PreferencesPanelProps {
  preferences: Preference[]
  onUpdate: (preference: Preference) => void
  onClose: () => void
}

export default function PreferencesPanel({ preferences, onUpdate, onClose }: PreferencesPanelProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order':
        return 'Order Confirmations'
      case 'invoice':
        return 'Invoices'
      case 'shipping':
        return 'Shipping Updates'
      default:
        return type
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Choose which types of notifications you want to receive in your inbox.
      </p>
      <div className="space-y-3">
        {preferences.map((pref) => (
          <label key={pref.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <span className="text-sm font-medium text-gray-700">
              {getTypeLabel(pref.message_type)}
            </span>
            <input
              type="checkbox"
              checked={pref.enabled}
              onChange={(e) => onUpdate({ ...pref, enabled: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </label>
        ))}
      </div>
    </div>
  )
}