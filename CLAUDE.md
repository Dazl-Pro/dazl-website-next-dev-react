# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Vite and hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all JS/JSX files

### Prerequisites
- Node.js and npm installed
- No test framework currently configured

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 18 with Vite for build tooling
- **State Management**: Redux Toolkit with separate slices for auth and dashboard
- **Routing**: React Router DOM v6
- **UI Components**: Material-UI (MUI) v5 and React Bootstrap
- **Styling**: CSS with Bootstrap 5, plus custom CSS files
- **Form Handling**: React Hook Form with Yup validation, plus Formik
- **HTTP Client**: Axios
- **Audio Processing**: Picovoice Leopard for speech recognition

### Project Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── blog/           # Blog-related components
│   ├── contact/        # Contact form components
│   ├── dashboard/      # Main dashboard area
│   │   ├── agentDashboard/         # Agent-specific dashboard
│   │   ├── customerDashboard/      # Customer-specific dashboard
│   │   ├── professionalDashboard/  # Professional-specific dashboard
│   │   ├── cards/                  # Reusable card components
│   │   ├── commonForm/             # Shared form components
│   │   ├── commonProject/          # Shared project components
│   │   ├── commonSidebar/          # Shared sidebar components
│   │   └── sections/               # Dashboard sections
│   ├── footer/         # Footer components
│   ├── header/         # Header/navigation components
│   └── terms&conditions/ # Legal pages
├── services/
│   ├── confirmPopup/   # Confirmation dialog service
│   ├── http/           # HTTP/API service layer
│   ├── routeGuard/     # Route protection service
│   ├── scrollBar/      # Scroll utilities
│   ├── spinner/        # Loading spinner service
│   └── toastify/       # Toast notification service
└── store/
    ├── auth/           # Authentication Redux slice
    ├── dashboard/      # Dashboard Redux slice
    └── store.js        # Redux store configuration
```

## Business Context - DAZL Platform

**DAZL** is a comprehensive B2B2C real estate and home services marketplace platform that connects three distinct user types in the property improvement ecosystem. It's essentially "Thumbtack/Angie's List meets MLS" - a specialized platform for real estate professionals to identify and coordinate property improvements.

### Platform Overview
- **Primary Function**: Property diagnostic system with service marketplace
- **Core Workflow**: Realtors create Property Home Diagnostic (PHD) reports → System generates project opportunities → Service professionals bid → Homeowners select providers
- **Revenue Model**: Membership subscriptions, transaction fees, premium features

### User Types & Core User Stories

#### **REAL ESTATE AGENTS/REALTORS**
**Property Assessment & Documentation:**
- Create Property Home Diagnostic (PHD) reports during walkthroughs
- Capture room-by-room photos and voice notes of property issues
- Categorize issues by room type with cost estimates
- Generate professional PDF reports for homeowners
- Save draft reports for complex multi-session assessments

**Client Communication & Professional Network:**
- Email reports directly to homeowners with detailed assessments
- Connect homeowners with pre-vetted service professionals
- Track professional responsiveness and reliability
- View completed projects and professional ratings for better referrals

#### **SERVICE PROFESSIONALS**
**Business Profile & Credentials:**
- Create comprehensive company profiles with portfolio images
- Upload insurance documentation and certificates
- Specify geographic service radius and specialties
- Manage work samples and credentials verification

**Project Opportunity Management:**
- Receive notifications for relevant project opportunities
- View detailed diagnostic reports with photos and scope
- Submit competitive bids with pricing and timelines
- Accept/decline opportunities based on workload
- Track bid success rates and project history

#### **HOMEOWNERS/CUSTOMERS**
**Property Assessment & Understanding:**
- Receive detailed diagnostic reports about property issues
- View photos and descriptions of identified problems
- Understand estimated costs and repair timelines
- Access property report history for maintenance tracking

**Service Provider Selection:**
- Review bids from multiple service professionals
- Compare professional profiles, insurance, and past work
- Communicate directly with professionals about requirements
- Track project progress and status updates

### Key Application Features
- Multi-role dashboard system (agents, customers, professionals)
- Property Home Diagnostic (PHD) report creation system
- Room-by-room assessment with photo documentation
- Voice recording integration with Picovoice Leopard
- PDF generation and export capabilities (jsPDF, html2canvas, html2pdf.js)
- Project opportunity matching and bidding system
- Professional portfolio and credential management
- Google Maps integration for location-based service matching
- Email integration for report distribution
- File upload and image handling
- Toast notifications and confirmation dialogs
- Responsive design with Bootstrap and Material-UI

### State Management
- Uses Redux Toolkit with two main slices:
  - `authSlice` - Handles authentication state and loading
  - `dashboardSlice` - Manages dashboard data, popups, and UI state
- Loading states are managed separately for authenticated vs non-authenticated users
- Token persistence via localStorage

### Component Patterns
- Extensive use of React lazy loading with Suspense for code splitting
- Conditional rendering based on Redux state (show/showAlt patterns)
- Service-based architecture with dedicated services for common functionality
- Material-UI CircularProgress for fallback loading states

### Development Notes
- Uses ES modules (type: "module" in package.json)
- Vite configuration is minimal with React plugin
- Project uses mixed UI libraries (MUI + Bootstrap) - be consistent with existing patterns
- No testing framework currently configured
- ESLint configured for React development with standard rules