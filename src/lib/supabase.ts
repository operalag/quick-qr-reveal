
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client with the provided credentials
const supabaseUrl = 'https://eaewkgdmpwzqbigzenfb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZXdrZ2RtcHd6cWJpZ3plbmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxODMzMjUsImV4cCI6MjA1Mzc1OTMyNX0.ARRLlhGPQh9Yr8t9EZHic_9DSlnOYFvF1v4NmoLhHE4'

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
