# CCongregation

A comprehensive web-based church management platform built with Next.js 15, React 19, and modern web technologies. This system helps churches manage members, services, finances, communications, and groups efficiently.

## 🚀 Latest Updates (v1.0.0)

### Package Updates
- **Next.js**: 15.0.0 → 15.1.3
- **React**: 18.2.0 → 19.0.0
- **React DOM**: 18.2.0 → 19.0.0
- **Lucide React**: 0.263.1 → 0.344.0
- **date-fns**: 2.30.0 → 3.6.0
- **TypeScript**: 5.0.0 → 5.6.3
- **Tailwind CSS**: 3.3.0 → 3.4.14
- **Added**: SWR 2.2.5 (for data fetching)

### New Features
- Added React 19 support with improved rendering
- Integrated SWR for efficient client-side data fetching
- Enhanced type checking with latest TypeScript
- Improved development experience with type-check script
- Modern React hooks and patterns

## 📋 Features

### 1. Member Management
- Complete member profiles with personal, contact, and family information
- Baptism tracking (date, location, status)
- Member tithe and donation tracking
- Image uploads for member profiles
- Member details modal with comprehensive information display

### 2. Service Management
- Service scheduling with start/end dates and times
- Service types (Sunday Service, Prayer Meeting, Bible Study, etc.)
- Leadership tracking (preacher, chairman, supporters)
- Special guest management
- Attendance recording and tracking
- Recurring service support (weekly, monthly)
- Announcement message for member notifications

### 3. Finance Management
- Financial event creation and tracking
- Donation recording with multiple payment methods
- Individual member tithe tracking
- Financial reports and analytics
- Multi-day event financial tracking (crusades, conferences)

### 4. Communication System
- Bulk SMS and email messaging
- Message scheduling for future delivery
- SMS credit management and purchase
- Communication event creation
- Group and individual messaging
- Message delivery tracking

### 5. Group Management
- Group creation and categorization
- Member assignment with roles
- Group details and information display
- Meeting schedule management

### 6. Settings & Configuration
- Church information management with logo upload
- User and role management
- Role-based permission system
- SMS provider integration (Twilio, Vonage, MessageBird)
- SMS credit purchase and tracking

## 🛠 Tech Stack

- **Frontend**: Next.js 15.1.3, React 19.0.0, TypeScript 5.6.3
- **Styling**: Tailwind CSS 3.4.14, shadcn/ui components
- **Data Fetching**: SWR 2.2.5
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React 0.344.0
- **Utilities**: date-fns 3.6.0, clsx, tailwind-merge

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev

# Open browser to http://localhost:3000
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── members/                 # Members module
│   ├── services/                # Services module
│   ├── finance/                 # Finance module
│   ├── communication/           # Communication module
│   ├── groups/                  # Groups module
│   └── settings/                # Settings module
│
├── components/                   # React components
│   ├── layout/                  # Layout components
│   ├── dashboard/               # Dashboard components
│   ├── members/                 # Member management components
│   ├── services/                # Service management components
│   ├── finance/                 # Finance management components
│   ├── communication/           # Communication components
│   ├── groups/                  # Group management components
│   ├── settings/                # Settings components
│   └── ui/                      # Reusable UI components (shadcn/ui)
│
├── hooks/                        # Custom React hooks
│   ├── use-members.ts
│   ├── use-services.ts
│   ├── use-finance.ts
│   ├── use-groups.ts
│   ├── use-communication.ts
│   └── use-mobile.ts
│
├── utils/                        # Utility functions
│   ├── api-client.ts            # HTTP client for API calls
│   ├── date-helpers.ts          # Date formatting utilities
│   └── validation.ts            # Form validation utilities
│
├── models-migration/            # Laravel migration files
│   ├── 2024_01_01_000001_create_churches_table.php
│   ├── 2024_01_01_000002_create_users_table.php
│   └── ... (more migrations)
│
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.mjs              # Next.js configuration
└── package.json                 # Project dependencies
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#0066FF)
- **Secondary**: Yellow/Gold (#FFC107)
- **Neutrals**: White, Grays, Black variants
- **Accent**: Blue tints and shades

### Typography
- **Headings**: Inter (via Google Fonts)
- **Body**: Inter (via Google Fonts)
- **Monospace**: System monospace fonts

### Component Library
All UI components follow shadcn/ui patterns with customizations for the blue/yellow theme.

## 🔗 API Integration

The application uses a custom API client utility (`/utils/api-client.ts`) that provides methods for:
- HTTP requests (GET, POST, PUT, PATCH, DELETE)
- Error handling
- Authentication token management
- Request/response serialization

### Usage Example

```typescript
import { api } from '@/utils/api-client'

// Fetch members
const members = await api.members.getAll()

// Create a new member
const newMember = await api.members.create({ name: 'John Doe', ... })

// Update a member
await api.members.update('member-id', { name: 'Jane Doe' })
```

## 🗄️ Database Schema

Complete Laravel migration files are available in `/models-migration/` directory, defining:
- Churches (multi-tenant support)
- Users and Roles
- Members and Family relationships
- Groups and Group memberships
- Services and Service attendance
- Finance events and Donations
- Communication events and Messages
- SMS credits and integrations
- Activity logs

## 🔐 Security Features

- Multi-tenant architecture with church isolation
- Role-based access control (RBAC)
- Activity logging for audit trails
- Secure API client with authentication
- Input validation and sanitization
- Password hashing (ready for backend implementation)

## 📱 Responsive Design

- Mobile-first approach
- Responsive sidebar navigation
- Adaptive modal layouts
- Touch-friendly interface elements
- Works seamlessly on all device sizes

## 🚦 Development Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript type checking
```

## 📝 Code Standards

- **Language**: TypeScript 5.6.3
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS with design tokens
- **Components**: Modular, reusable, well-documented
- **API**: RESTful patterns with typed responses

## 🤝 Contributing

When contributing to this project:
1. Follow the existing code structure
2. Use TypeScript for type safety
3. Create reusable, modular components
4. Follow the design system guidelines
5. Add proper error handling
6. Test responsive behavior

## 📄 License

This project is private and intended for church management purposes.

## 🎯 Roadmap

- Real-time data synchronization with WebSockets
- Advanced analytics and reporting
- Mobile app (React Native)
- Payment gateway integration for online giving
- SMS and email provider SDK integration
- Multi-language support
- Advanced member search and filtering

## 📞 Support

For issues, feature requests, or questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Built with**: Next.js 15, React 19, TypeScript 5, Tailwind CSS 3
