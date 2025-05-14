
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client with the provided credentials
const supabaseUrl = 'https://eaewkgdmpwzqbigzenfb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZXdrZ2RtcHd6cWJpZ3plbmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxODMzMjUsImV4cCI6MjA1Mzc1OTMyNX0.ARRLlhGPQh9Yr8t9EZHic_9DSlnOYFvF1v4NmoLhHE4'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Maximum allowed stamp count based on the constraint in the database
// NOTE: This must match the database constraint value
const MAX_STAMP_COUNT = 5;

// Function to add a QR code scan to the customers table or update stamp count if already exists
export async function addQrCodeScan(qrCode: string): Promise<{ success: boolean; error?: string; message?: string; maxReached?: boolean; currentCount?: number }> {
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
      console.log('Existing data found:', existingData)
      
      // QR code exists, check current stamp count
      const currentStampCount = typeof existingData.stamp_count === 'number' ? existingData.stamp_count : 0
      
      // Check if we've already reached the maximum stamps
      if (currentStampCount >= MAX_STAMP_COUNT) {
        return { 
          success: true, 
          maxReached: true,
          currentCount: currentStampCount,
          message: `Stempelkarte ist voll!`
        }
      }
      
      // Calculate new stamp count, ensuring it doesn't exceed the maximum
      const newStampCount = Math.min(currentStampCount + 1, MAX_STAMP_COUNT)
      const isMaxReached = newStampCount >= MAX_STAMP_COUNT
      
      console.log('Current stamp count:', currentStampCount)
      console.log('New stamp count:', newStampCount)
      
      // Update with the new timestamp to prevent any caching issues
      const updateData: any = { 
        stamp_count: newStampCount,
        updated_at: new Date().toISOString()
      }
      
      // If we're reaching the maximum, update the goodie_status as well
      if (isMaxReached) {
        updateData.goodie_status = existingData.goodie_status + 1;
      }
      
      const { error: updateError } = await supabase
        .from('customers')
        .update(updateData)
        .eq('qr_code', qrCode)

      if (updateError) {
        console.error('Error updating stamp count:', updateError)
        return { success: false, error: updateError.message }
      }
      
      // Verify the update by fetching the record again
      const { data: verifyData, error: verifyError } = await supabase
        .from('customers')
        .select('*')
        .eq('qr_code', qrCode)
        .single()
        
      if (verifyError) {
        console.error('Error verifying update:', verifyError)
      } else {
        console.log('Verified data after update:', verifyData)
      }

      return { 
        success: true,
        currentCount: newStampCount,
        maxReached: isMaxReached,
        message: isMaxReached 
          ? `Stempelkarte ist voll!` 
          : `Stempelanzahl erhöht auf ${newStampCount}` 
      }
    } else {
      console.log('No existing data, creating new record')
      // QR code doesn't exist, insert a new record
      const { error: insertError } = await supabase
        .from('customers')
        .insert([{ 
          qr_code: qrCode, 
          stamp_count: 1,
          goodie_status: 0
        }])

      if (insertError) {
        console.error('Error adding new QR scan to database:', insertError)
        return { success: false, error: insertError.message }
      }

      return { 
        success: true,
        currentCount: 1,
        maxReached: false,
        message: 'Erster Stempel registriert' 
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
