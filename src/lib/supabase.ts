
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client with the provided credentials
const supabaseUrl = 'https://eaewkgdmpwzqbigzenfb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZXdrZ2RtcHd6cWJpZ3plbmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxODMzMjUsImV4cCI6MjA1Mzc1OTMyNX0.ARRLlhGPQh9Yr8t9EZHic_9DSlnOYFvF1v4NmoLhHE4'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Function to add a QR code scan to the customers table or update stamp count if already exists
export async function addQrCodeScan(qrCode: string): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    // First, check if the QR code already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('qr_code', qrCode)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking for existing QR code:', fetchError)
      return { success: false, error: fetchError.message }
    }

    if (existingData) {
      // QR code exists, update the stamp_count
      const currentStampCount = existingData.stamp_count || 0
      const newStampCount = currentStampCount + 1
      
      const { error: updateError } = await supabase
        .from('customers')
        .update({ 
          stamp_count: newStampCount,
          last_scanned_at: new Date().toISOString() 
        })
        .eq('qr_code', qrCode)

      if (updateError) {
        console.error('Error updating stamp count:', updateError)
        return { success: false, error: updateError.message }
      }

      return { 
        success: true, 
        message: `Stamp count increased to ${newStampCount}` 
      }
    } else {
      // QR code doesn't exist, insert a new record
      const { error: insertError } = await supabase
        .from('customers')
        .insert([{ 
          qr_code: qrCode, 
          stamp_count: 1,
          first_scanned_at: new Date().toISOString(),
          last_scanned_at: new Date().toISOString()
        }])

      if (insertError) {
        console.error('Error adding new QR scan to database:', insertError)
        return { success: false, error: insertError.message }
      }

      return { 
        success: true,
        message: 'First stamp recorded' 
      }
    }
  } catch (err) {
    console.error('Unexpected error processing QR scan:', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}
