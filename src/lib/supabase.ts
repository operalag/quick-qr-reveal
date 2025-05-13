
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Function to add a QR code scan to the customers table
export async function addQrCodeScan(qrCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('customers')
      .insert([{ qr_code: qrCode, scanned_at: new Date().toISOString() }])

    if (error) {
      console.error('Error adding QR scan to database:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error adding QR scan:', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}
