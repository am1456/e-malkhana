# e-Malkhana - Digital Police Evidence Management System

## Overview

**e-Malkhana** is a comprehensive digital platform designed for police stations to manage seized property and evidence efficiently. The system provides a complete workflow from case registration to property disposal, with robust chain of custody tracking and role-based access control.

## Features Implemented

### 1. Authentication & Authorization
- Secure username/password based login system
- Three-tier role-based access control:
  - **SUPER_ADMIN**: Full system access, can create admin users
  - **ADMIN**: Case management, user creation (officers only), disposal authority
  - **OFFICER**: Case and property entry, custody log management
- Session-based authentication with automatic timeout

### 2. Dashboard
- Real-time statistics display:
  - Total Cases registered in the system
  - Pending Cases awaiting disposal
  - Disposed Cases that have been closed
- Role-specific navigation menu
- Quick access to all major functions

### 3. Case Management
**Create New Cases** with comprehensive details:
- Police Station Name
- Investigating Officer Name & ID
- Crime Number & Year (unique identifier)
- Date of FIR and Date of Seizure
- Act & Law, Section of Law

**View All Cases** with filtering options:
- Filter by status (Pending/Disposed)
- Search by crime number, officer name, or station

**Case Details View** with tabbed interface:
- Case Information (editable)
- Properties List
- Chain of Custody Logs
- Disposal Information

**Edit Cases**: Update case details with validation

**Delete Cases**: Admin-only permission with confirmation

### 4. Property Management
**Add Properties** to cases with:
- Category (Weapon, Drug, Vehicle, etc.)
- Belonging To (Accused/Complainant/Unknown)
- Nature of Property
- Quantity/Units
- Storage Location (Rack/Room/Locker ID)
- Detailed Description
- Photo Upload (via Cloudinary)

**QR Code Generation**:
- Automatic QR code creation for each property
- Contains property ID, case number, location
- Downloadable and printable for physical tagging

**View Property Details** with images

### 5. Chain of Custody Tracking
**Record Movement** of evidence:
- From Location/Officer
- To Location/Officer
- Purpose (Court, FSL, Analysis, Storage, etc.)
- Date & Time
- Remarks

**View Complete History**: Chronological custody log for audit trail

Critical for maintaining evidence integrity in legal proceedings

### 6. Property Disposal
**Mark Cases as Disposed** (Admin only):
- Disposal Type (Returned/Destroyed/Auctioned/Court Custody)
- Court Order Reference
- Date of Disposal
- Remarks

**Status Update**: Automatically changes case status to "DISPOSED"

**Update Disposal Info**: Modify disposal details if needed

### 7. User Management
- **View All Users**: List with role-based filtering
- **Create New Users**:
  - SUPER_ADMIN can create ADMIN and OFFICER users
  - ADMIN can create OFFICER users only
- **Edit Users**:
  - Update profile information
  - Change roles (permission-based)
  - Reset passwords
- **Delete Users**: SUPER_ADMIN only, cannot delete SUPER_ADMIN

### 8. Profile Management
- View personal profile information
- Edit own details (name, station, badge ID)
- Change password with validation

## Technology Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI Components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT
- **Validation**: Zod schemas
- **Form Handling**: React Hook Form
- **Image Storage**: Cloudinary
- **QR Code Generation**: qrcode library

## Setup and Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud - MongoDB Atlas recommended)
- Cloudinary account (for image uploads)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd e-malkhana
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_generated_secret_key
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**How to get these values:**

**MongoDB URI:**
- Sign up at MongoDB Atlas
- Create a cluster and get connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/e-malkhana`

**NEXTAUTH_SECRET:**
- Generate using: `openssl rand -base64 32`
- Or use any random 32+ character string

**Cloudinary Credentials:**
- Sign up at Cloudinary
- Find credentials in Dashboard → Account Details

### Step 4: Run Development Server
```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Step 5: First Login (Super Admin)
Use the pre-configured Super Admin credentials:
- **Username**: `superadmin`
- **Password**: `123abcxyz`

**Important**: Change this password immediately after first login for security.

### Step 6: Create First Case
1. Login as Super Admin
2. Navigate to "Cases" → "New Case"
3. Fill in case details and properties
4. System is now ready for use

## Project Structure
```
e-malkhana/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   └── login/                # Login page
│   │   ├── dashboard/                # Protected dashboard routes
│   │   │   ├── page.tsx              # Dashboard home (stats)
│   │   │   ├── cases/                # Case management
│   │   │   │   ├── page.tsx          # Cases list
│   │   │   │   ├── new/              # Create new case
│   │   │   │   └── [id]/             # Case details & sub-routes
│   │   │   │       ├── page.tsx      # Case details view
│   │   │   │       ├── properties/   # Property management
│   │   │   │       ├── custody/      # Custody logs
│   │   │   │       └── disposal/     # Disposal marking
│   │   │   ├── users/                # User management
│   │   │   │   ├── page.tsx          # Users list
│   │   │   │   ├── new/              # Create user
│   │   │   │   └── [id]/             # Edit user
│   │   │   └── profile/              # User profile
│   │   ├── api/                      # Backend API routes
│   │   │   ├── auth/                 # Authentication APIs
│   │   │   ├── cases/                # Case management APIs
│   │   │   ├── properties/           # Property & QR code APIs
│   │   │   ├── dashboard/            # Dashboard stats API
│   │   │   ├── users/                # User management APIs
│   │   │   └── upload/               # Image upload API
│   │   ├── layout.tsx                # Root layout with header
│   │   └── page.tsx                  # Home redirect
│   ├── components/                   # Reusable UI components
│   │   └── ui/                       # Shadcn UI components
│   │   └── Navbar.tsx                # Custom Navigation Bar
│   ├── context/                      # Context Provider
│   │   └── AuthProvider.tsx          # NextAuth Session Provider
│   ├── lib/                          # Utility functions
│   │   ├── dbConnect.ts              # MongoDB connection
│   │   └── auth.ts                   # NextAuth configuration
│   ├── models/                       # Mongoose database models
│   │   ├── User.model.ts             # User schema
│   │   └── Case.model.ts             # Case schema (includes properties, custody, disposal)
│   ├── schemas/                      # Zod validation schemas
│   │   ├── CreateUserSchema.ts       # New User validation
│   │   ├── CustodyLogSchema.ts       # Custody log validation
│   │   ├── DisposalSchema.ts         # Disposal validation
│   │   ├── LoginSchema.ts            # Login validation
│   │   ├── NewCaseSchema.ts          # New Case validation
│   │   ├── PasswordSchema.ts         # Password validation (only SUPER_ADMIN & ADMIN 
│   │   │                             # could change their own account password)
│   │   ├── ProfileSchema.ts          # Profile validation
│   │   ├── PropertySchema.ts         # Property validation
│   │   └── UpdateUserSchema.ts       # Update User validation
│   └── types/                        # TypeScript type definitions
│       └── next-auth.d.ts            # NextAuth type extensions
├── .env.local                        # Environment variables (create this)
├── package.json                      # Project dependencies
├── tsconfig.json                     # TypeScript configuration
└── tailwind.config.js                # Tailwind CSS configuration
```

## How the System Works

### User Roles & Permissions

| Feature | SUPER_ADMIN | ADMIN | OFFICER |
|---------|-------------|-------|---------|
| Create Cases | ✅ | ✅ | ✅ |
| Edit Cases | ✅ | ✅ | ✅ |
| Delete Cases | ✅ | ✅ | ❌ |
| Add Properties | ✅ | ✅ | ✅ |
| Generate QR Codes | ✅ | ✅ | ✅ |
| Add Custody Logs | ✅ | ✅ | ✅ |
| Mark Disposal | ✅ | ✅ | ❌ |
| Create Admin Users | ✅ | ❌ | ❌ |
| Create Officer Users | ✅ | ✅ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |

### Workflow

**1. Case Registration**
- Officer creates new case with FIR details
- System assigns unique crime number
- Case status: PENDING

**2. Property Entry**
- Officer adds seized items to the case
- Uploads photos of evidence
- System generates unique QR code for each item
- QR codes can be printed and attached to physical evidence

**3. Chain of Custody**
- Every movement of property is logged
- Records who handled it, when, and why
- Creates audit trail for legal proceedings

**4. Case Disposal (Admin only)**
- When case concludes, admin marks disposal
- Records disposal type and court order
- Case status changes to DISPOSED
- Appears in disposed cases count

### Security Features
- Password hashing with bcrypt
- JWT-based session management
- Role-based route protection
- API authentication on all endpoints
- Input validation with Zod schemas
- SUPER_ADMIN role cannot be deleted or modified

### Data Validation
All user inputs are validated using Zod schemas:
- **Case**: Ensures seizure date ≥ FIR date
- **Property**: Required fields enforcement
- **Custody**: Chronological date validation
- **User**: Username/password requirements

## Common Operations

### Creating a New Case
1. Navigate to Dashboard → Cases → New Case
2. Fill in all required fields (marked with *)
3. Click "Create Case"
4. You'll be redirected to case details page

### Adding Property to a Case
1. Open case details
2. Go to "Properties" tab
3. Click "Add Property"
4. Fill property details and upload photo (optional)
5. Submit to generate QR code automatically

### Recording Property Movement
1. Open case details
2. Go to "Custody Log" tab
3. Click "Add Log"
4. Record transfer details with date/time
5. Submit to create audit entry

### Marking Case as Disposed
1. Open case details (must be Admin)
2. Go to "Disposal" tab
3. Click "Mark as Disposed"
4. Enter court order details
5. Submit to close case

### Managing Users
1. Navigate to Dashboard → User Management
2. View all users with role filters
3. Create new user with appropriate role
4. Edit or delete existing users (permission-based)

## Troubleshooting

**Cannot login:**
- Verify MongoDB connection in `.env.local`
- Check if `NEXTAUTH_SECRET` is set
- Ensure Super Admin account exists in database

**Images not uploading:**
- Verify Cloudinary credentials in `.env.local`
- Check internet connection
- Ensure image size < 5MB

**QR codes not generating:**
- Check if property was successfully created
- Verify API route is accessible
- Check browser console for errors

**404 errors:**
- Restart development server: `npm run dev`
- Clear Next.js cache: `rm -rf .next`
- Check route file structure matches documentation

## Production Deployment

Before deploying to production:
1. **Change Super Admin Password**: Use a strong, unique password
2. **Environment Variables**: Set all variables in production environment
3. **Database**: Use production MongoDB cluster with backups
4. **NEXTAUTH_URL**: Update to production domain
5. **Security**: Enable HTTPS and secure headers

## Support & Maintenance

For issues or questions:
- Check logs in terminal/console
- Verify environment variables
- Ensure all dependencies are installed
- Review MongoDB connection status

## License

This project is developed for police evidence management purposes.

---

**System Status**: ✅ Production Ready  
**[Vercel Deployed](https://e-malkhana-flax.vercel.app/login)**
**Last Updated**: February 2026  
**Version**: 1.0.0
