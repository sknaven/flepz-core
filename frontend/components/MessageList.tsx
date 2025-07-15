import { Message } from '@/lib/types'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'order':
        return '🛍️'
      case 'invoice':
        return '📄'
      case 'shipping':
        return '📦'
      default:
        return '📧'
    }
  }

  const getTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-800'
      case 'invoice':
        return 'bg-green-100 text-green-800'
      case 'shipping':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (messages.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No messages in your inbox</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Messages</h2>
      {messages.map((message) => (
        <div key={message.id} className="card hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-2xl">
              {getTypeIcon(message.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                    {message.type}
                  </span>
                  <span className="text-sm text-gray-600">
                    from {message.sender_domain}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(message.created_at)}
                </span>
              </div>
              <div className="mt-2">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded">
                  {JSON.stringify(message.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}