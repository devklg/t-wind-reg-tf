# Enrollment System Routes Documentation

## API Routes

### Enrollment Management

| Route | Method | Purpose | Flow |
|-------|---------|---------|------|
| `/api/enrollments` | POST | Create new enrollment | 1. Receives enrollment data<br>2. Generates enrollment ID (PL-XXXX)<br>3. Links to enroller if found<br>4. Returns created enrollment |
| `/api/enrollments` | GET | Get all enrollments | 1. Fetches all enrollments<br>2. Used by admin dashboard<br>3. Returns array of enrollments |
| `/api/enrollments/:id` | GET | Get single enrollment | 1. Fetches specific enrollment<br>2. Used for profile/welcome pages<br>3. Returns enrollment details |
| `/api/enrollments/:id` | PUT | Update enrollment | 1. Updates enrollment details<br>2. Used for profile updates<br>3. Returns updated enrollment |
| `/api/enrollments/:id/status` | PATCH | Update enrollment status | 1. Updates enrollment status<br>2. Used by admin for status management<br>3. Returns updated status |
| `/api/enrollments/:id` | DELETE | Delete enrollment | 1. Removes enrollment from system<br>2. Used by admin for cleanup<br>3. Returns success message |

## Frontend Routes

### User Interface

| Route | Purpose | Flow | Components Used |
|-------|---------|------|-----------------|
| `/` | Home/Enrollment Form | 1. Shows enrollment form<br>2. Handles new enrollments<br>3. Redirects to profile after submission | `EnrollmentForm` |
| `/profile/:id` | Profile Page | 1. Shows enrollment details<br>2. Allows profile updates<br>3. Redirects to welcome after save | `ProfileForm` |
| `/welcome/:id` | Welcome Page | 1. Shows enrollment confirmation<br>2. Displays enroller information<br>3. Provides next steps | `Welcome` |
| `/admin` | Admin Dashboard | 1. Shows all enrollments<br>2. Allows CRUD operations<br>3. Provides print functionality | `AdminDashboard` |
| `/*` | Catch-all Route | 1. Handles undefined routes<br>2. Redirects to home page | `App` |

## Route Interactions

### User Flows

| User Action | Route Flow | Components Involved |
|-------------|------------|---------------------|
| New Enrollment | `/` → `POST /api/enrollments` → `/profile/:id` → `/welcome/:id` | `EnrollmentForm` → `ProfileForm` → `Welcome` |
| Profile Update | `/profile/:id` → `PUT /api/enrollments/:id` → `/welcome/:id` | `ProfileForm` → `Welcome` |
| Admin Create | `/admin` → `POST /api/enrollments` → Refresh List | `AdminDashboard` |
| Admin Edit | `/admin` → `PUT /api/enrollments/:id` → Refresh List | `AdminDashboard` |
| Admin Delete | `/admin` → `DELETE /api/enrollments/:id` → Refresh List | `AdminDashboard` |
| Admin Print | `/admin` → Print Preview → Print | `AdminDashboard` → `PrintEnrollment` |

## Authentication & Authorization

### Access Control

| Route | Auth Required | Access Level |
|-------|---------------|--------------|
| `/` | No | Public |
| `/profile/:id` | Yes | Enrollee |
| `/welcome/:id` | Yes | Enrollee |
| `/admin` | Yes | Admin |
| All API Routes | Yes | Admin/Enrollee |

## Data Flow

### State Management

| Route | Data Flow | State Management |
|-------|-----------|------------------|
| `/` | Form Data → API → Profile | Local State |
| `/profile/:id` | API → Form → API → Welcome | Local State |
| `/admin` | API → Table → CRUD → API | Local State |
| `/welcome/:id` | API → Display | Local State |

## Component Structure

### Frontend Components

- `EnrollmentForm`: Handles new enrollment creation
- `ProfileForm`: Manages profile updates
- `Welcome`: Displays enrollment confirmation
- `AdminDashboard`: Manages enrollment CRUD operations
- `PrintEnrollment`: Handles enrollment printing
- `Notification`: Displays system notifications

## Error Handling

### Common Scenarios

1. Invalid Routes
   - Redirects to home page
   - Shows 404 notification

2. API Failures
   - Displays error notification
   - Maintains form state
   - Allows retry

3. Authentication Failures
   - Redirects to login
   - Clears sensitive data

## Print Functionality

### Print Routes

1. List View
   - `/admin` → Print All
   - Shows all enrollments in table format

2. Individual View
   - `/admin` → Print Single
   - Shows detailed enrollment information

## Notes

- All API routes require authentication
- Frontend routes handle their own state management
- Print functionality uses CSS media queries
- Error handling is consistent across all routes
- Admin routes have additional security measures 