import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const seedData = async () => {
  console.log('🌱 Starting seed process...')

  try {
    // Sample messages
    const messages = [
      {
        sender_domain: 'shop.example.com',
        recipient_email: 'test@example.com',
        type: 'order',
        payload: {
          order_id: 'ORD-12345',
          amount: 99.99,
          items: [
            { name: 'Product A', quantity: 2, price: 29.99 },
            { name: 'Product B', quantity: 1, price: 40.01 }
          ],
          status: 'confirmed'
        }
      },
      {
        sender_domain: 'billing.saas.com',
        recipient_email: 'test@example.com',
        type: 'invoice',
        payload: {
          invoice_id: 'INV-2024-001',
          amount: 49.00,
          period: 'January 2024',
          due_date: '2024-02-01',
          status: 'pending'
        }
      },
      {
        sender_domain: 'logistics.shipping.com',
        recipient_email: 'test@example.com',
        type: 'shipping',
        payload: {
          tracking_number: 'SHIP-789-XYZ',
          carrier: 'FastShip Express',
          status: 'in_transit',
          estimated_delivery: '2024-01-25',
          last_location: 'Distribution Center, Amsterdam'
        }
      }
    ]

    // Insert messages
    console.log('📬 Inserting sample messages...')
    const { error: messagesError } = await supabase
      .from('messages')
      .insert(messages)

    if (messagesError) {
      console.error('Error inserting messages:', messagesError)
    } else {
      console.log('✅ Messages inserted successfully')
    }

    console.log('🎉 Seed process complete!')
  } catch (error) {
    console.error('❌ Seed process failed:', error)
    process.exit(1)
  }
}

seedData()