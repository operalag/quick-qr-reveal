
# QR Code Stamp Collection System

## Overview

This is a web-based QR code stamp collection system designed to be embedded in iframes. The application allows users to scan QR codes and accumulate stamps on a digital stamp card. When users reach the maximum number of stamps (10), they become eligible for rewards and can start new cards.

## What the App Does

The application provides a digital loyalty card system where:
- Users scan QR codes using their device camera
- Each successful scan adds a stamp to their collection
- The system tracks stamp counts and reward eligibility in a Supabase database
- Users can redeem rewards and start new stamp cards when they reach the maximum
- The interface is optimized for mobile devices and iframe embedding

## Key Features

1. **QR Code Scanning**: Uses device camera to scan QR codes
2. **Stamp Collection**: Tracks stamps per unique QR code
3. **Reward System**: Manages goodie status and reward distribution
4. **Database Integration**: Persistent storage using Supabase
5. **Mobile Optimized**: Responsive design for mobile devices
6. **Iframe Ready**: Minimal height and spacing for iframe embedding

## How It Works

### User Flow
1. User opens the application and sees a "Scannen Starten" (Start Scanning) button
2. Clicking the button activates the camera for QR code scanning
3. When a QR code is detected, the app processes it:
   - If it's a new QR code: creates a new record with 1 stamp
   - If it's an existing QR code: increments the stamp count
4. The system shows scan results and current stamp status
5. At 10 stamps, users can redeem rewards or start new cards

### Technical Flow
1. **QR Scanning**: `react-qr-scanner` library captures QR codes
2. **Database Operations**: Supabase handles all data persistence
3. **State Management**: React hooks manage UI state
4. **Toast Notifications**: User feedback via shadcn/ui toast system

## Database Structure

The application uses a Supabase database with a `customers` table:

```
customers table:
- qr_code (text, primary key): The scanned QR code value
- stamp_count (integer): Number of stamps collected (max 10)
- goodie_status (integer): Number of available rewards
- created_at (timestamp): Record creation time
- updated_at (timestamp): Last modification time
```

## Code Structure

### Main Components

#### `/src/pages/Index.tsx`
- Main application page component
- Manages scanning state and results
- Handles navigation between scanning and results views
- Optimized for minimal height (iframe embedding)

#### `/src/components/QRScanner.tsx`
- QR code scanning functionality
- Camera access and QR detection
- Error handling for camera permissions
- Visual scanning interface with frame overlay

#### `/src/components/ScanResult.tsx`
- Displays scan results and QR code
- Shows stamp status and reward eligibility
- Handles stamp registration and reward distribution
- Manages buttons for new cards and bonus distribution

#### `/src/lib/supabase.ts`
- Supabase client configuration
- Database operations for stamp management
- Functions for adding scans, resetting cards, and distributing rewards
- Error handling and validation

### Key Functions

#### `addQrCodeScan(qrCode: string)`
- Processes QR code scans
- Creates new records or updates existing ones
- Enforces maximum stamp count (10)
- Returns success status and current count

#### `resetStampCount(qrCode: string)`
- Resets stamp count to 0 for new card
- Maintains goodie status
- Used when "Neue Karte" button is pressed

#### `distributeGoodie(qrCode: string)`
- Decrements goodie status by 1
- Used when "Bonus ausgeteilt" button is pressed

### UI Components

The application uses shadcn/ui components for consistent styling:
- `Card` and `CardContent` for layout containers
- `Button` for interactive elements
- `Alert` for error messages
- `Toast` for user notifications

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Blue theme (#003180) for branding
- **Minimal Spacing**: Optimized for iframe embedding

## How to Use the Application

### For End Users

1. **Starting a Scan**:
   - Open the application
   - Tap "Scannen Starten" to activate camera
   - Point camera at QR code within the frame

2. **After Scanning**:
   - View scan results and current stamp count
   - Tap "Stempeln" to register the stamp
   - Use "Erneut Scannen" to scan another code

3. **When Card is Full (10 stamps)**:
   - View goodie status (available rewards)
   - Tap "Neue Karte" to reset stamps and start fresh
   - Tap "Bonus ausgeteilt" to distribute a reward

### For Developers

1. **Environment Setup**:
   - Ensure Supabase credentials are configured
   - Install dependencies: `npm install`
   - Start development server: `npm run dev`

2. **Database Setup**:
   - Create `customers` table in Supabase
   - Set up appropriate RLS policies
   - Configure constraints (stamp_count <= 10)

3. **Deployment**:
   - Build application: `npm run build`
   - Deploy to preferred hosting platform
   - Ensure iframe embedding is allowed

## Configuration

### Environment Variables
- Supabase URL and API key are configured in `/src/lib/supabase.ts`
- Maximum stamp count is set via `MAX_STAMP_COUNT` constant (currently 10)

### Camera Settings
- Uses rear-facing camera by default (`facingMode: "environment"`)
- 300ms delay between scan attempts
- Automatic QR code detection

## Browser Compatibility

- Modern browsers with camera API support
- Mobile Safari, Chrome, Firefox
- Requires HTTPS for camera access in production

## Iframe Integration

The application is specifically optimized for iframe embedding:
- Minimal margins and padding
- Auto-height sizing
- No unnecessary scrollbars
- Responsive layout that adapts to container size

## Error Handling

- Camera permission errors with user-friendly messages
- Database connection error handling
- QR code format validation
- Toast notifications for user feedback

## Security Considerations

- Supabase RLS (Row Level Security) should be configured
- Camera permissions handled gracefully
- Input validation for QR code data
- Secure API key management

## Future Enhancements

Potential improvements could include:
- Admin dashboard for managing stamps and rewards
- Analytics and reporting features
- Multiple reward tiers
- Expiration dates for stamps
- Bulk QR code generation tools

## Support

For technical issues or questions about the codebase, refer to:
- Supabase documentation for database operations
- React documentation for component development
- Tailwind CSS documentation for styling
