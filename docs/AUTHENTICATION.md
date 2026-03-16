# Authentication System Documentation

## Overview

The Church Management System uses Laravel Sanctum for API authentication. The frontend implements JWT-based token management with automatic authorization header injection.

## Setup

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Configure the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. API Endpoints

The following API endpoints are available:

#### Authentication

- **POST** `/api/login` - User login
- **GET** `/api/logout` - User logout (requires authentication)
- **POST** `/api/register` - User registration

#### Password Reset

- **POST** `/api/password/request-reset` - Request password reset
- **POST** `/api/password/verify-token` - Verify reset token
- **POST** `/api/password/create-new-password` - Create new password (requires `reset-password` ability)

#### Protected Routes

- **GET** `/api/dashboard` - Dashboard data (requires authentication)
- **GET** `/api/dashboard-stats` - Dashboard statistics
- **POST** `/api/member/save` - Create member
- **PUT** `/api/member/{id}` - Update member
- **GET** `/api/member/{id}` - Get member details
- **GET** `/api/member/count` - Get member count

## Login Flow

### 1. User Login

```typescript
import { useAuth } from '@/hooks/use-auth'

function LoginPage() {
  const { login, isLoading, error } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password, remmeberMe: true })
      // User is automatically redirected to /dashboard on success
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    // Form JSX
  )
}
```

### 2. Login Request Format

```json
{
  "email": "super_admin@freedomtemple.com",
  "password": "password",
  "remmeberMe": true
}
```

### 3. Login Response Format

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "status": true,
    "user": {
      "id": "019cf307-65a8-7300-a3dc-90e912694c0c",
      "firstname": "John",
      "lastname": "Doe",
      "email": "super_admin@freedomtemple.com",
      "roles": [
        {
          "id": 1,
          "name": "super_admin",
          "permissions": [
            {
              "id": 1,
              "name": "view_dashboard"
            }
          ]
        }
      ]
    },
    "token": "019cf307-848c-72f0-af0b-a2daabf00221|roqPn93EtGSqQyY6F4nCMp5UV5lPTrer82Vw96LQ7012c8b6",
    "token_expires_at": "2026-03-15 21:44:42"
  }
}
```

## Token Management

### Storage

Tokens are stored in `localStorage` with the following keys:

- `auth_token` - The bearer token
- `auth_user` - User object (JSON stringified)

### Automatic Injection

All API requests automatically include the Authorization header:

```
Authorization: Bearer {token}
```

## Protected Routes

### Using ProtectedRoute Component

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

### Redirect Behavior

- If no token is found, user is redirected to `/login`
- If user is logged in, dashboard is accessible

## Permission System

### User Permissions

Permissions are loaded from the user's roles:

```typescript
import { getUserPermissions, hasPermission } from '@/utils/auth'

// Get all permissions
const permissions = getUserPermissions() // ['view_dashboard', 'create', 'edit', ...]

// Check specific permission
if (hasPermission('view_dashboard')) {
  // Show dashboard
}
```

### User Roles

```typescript
import { getUserRoles } from '@/utils/auth'

const roles = getUserRoles() // ['super_admin']
```

## Logout

### Manual Logout

```typescript
import { useAuth } from '@/hooks/use-auth'

function UserMenu() {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    // User is redirected to /login
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

### Automatic Cleanup

On logout:
- Auth token is cleared from localStorage
- User object is cleared from localStorage
- User is redirected to `/login`
- Backend logout endpoint is called

## Member Registration

### Registration Request

```json
{
  "first_name": "john",
  "last_name": "doe",
  "gender": "male",
  "dob_month": "June",
  "dob_day": "17",
  "dob_year": "1998",
  "phone": "0232580279",
  "address": "215 location unnamed here",
  "email": "john@doe.com",
  "contact_person": "Ama Asaah",
  "city": "Accra",
  "country": "Ghana",
  "family_id": "2XP-ASD",
  "occupation": "Student",
  "marital_status": "single",
  "membership_status": "active",
  "baptism_location": "weija dam",
  "ministry": "youth ministry",
  "is_baptised": true,
  "baptism_date": "10/20/2020",
  "baptism_church": "chuch of pentecost, manhia",
  "profile_photo": "photo location",
  "notes": "a choir member..."
}
```

### Validation Rules

Field validation is based on `HasMemberValidationRules`:

**Required Fields:**
- `first_name` (string, max 255)
- `last_name` (string, max 255)
- `gender` (male/female)
- `dob_month` (January-December)
- `dob_day` (string, max 255)
- `phone` (string, max 255)
- `address` (string, max 255)

**Optional Fields:**
- `dob_year` (string, max 255)
- `email` (email format, max 255)
- `contact_person` (string, max 255)
- `city` (string, max 255)
- `country` (string, max 255)
- `family_id` (string, max 255)
- `occupation` (string, max 255)
- `marital_status` (single/married/divorced/widowed)
- `membership_status` (active/inactive/visitor)
- `baptism_location` (string, max 255)
- `ministry` (string, max 255)
- `is_baptised` (boolean)
- `baptism_date` (date format)
- `baptism_church` (string, max 255)
- `profile_photo` (string, max 255)
- `notes` (string)

## API Client Usage

### Using the API Client

```typescript
import { api } from '@/utils/api-client'

// Create member
const newMember = await api.members.create({
  first_name: 'John',
  last_name: 'Doe',
  // ... other fields
})

// Get member
const member = await api.members.getById('member-id')

// Update member
const updated = await api.members.update('member-id', {
  first_name: 'Jane',
})

// Get member count
const count = await api.members.getCount()
```

## Error Handling

### Login Errors

```typescript
const { login, error } = useAuth()

try {
  await login(credentials)
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message)
  }
}

// Error is also available in the hook
if (error) {
  <Alert>{error}</Alert>
}
```

### API Errors

```typescript
try {
  await api.members.create(memberData)
} catch (error) {
  console.error('[v0] API Error:', error)
  // Handle error appropriately
}
```

## Demo Credentials

For development and testing:

- **Email:** `super_admin@freedomtemple.com`
- **Password:** `password`

## Security Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely** (localStorage is used, but consider upgrading to secure cookies in production)
3. **Validate user permissions** on both client and server
4. **Clear tokens on logout** (automatically handled)
5. **Implement token refresh** if needed (add to `use-auth` hook)
6. **Use environment variables** for API URLs
7. **Implement rate limiting** on the backend
8. **Add CSRF protection** for state-changing operations

## Troubleshooting

### Login Failed

- Verify API URL in `.env.local`
- Check backend server is running
- Verify credentials are correct
- Check browser console for error details

### User Auto-Redirected to Login

- Token may have expired
- Token may have been cleared from localStorage
- Check network tab for 401 responses

### Permission Denied

- Verify user role and permissions
- Check backend permissions configuration
- Verify `hasPermission()` checks are correct

## Future Enhancements

- Token refresh mechanism
- Secure cookie-based storage
- Two-factor authentication
- OAuth integration
- Session management UI
