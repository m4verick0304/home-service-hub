

# 🏠 Instant Home Services Booking App

A modern, mobile-first web app for booking home services (cleaning, plumbing, electrician, cooking) — inspired by Uber/Swiggy but for household needs. Blue & white color scheme with a clean, trustworthy feel.

---

## 🎨 Design & Theme
- **Primary color**: Blue (#2563EB) with white backgrounds
- **Style**: Clean, modern, large touch-friendly buttons, card-based layouts
- **Typography**: Clear hierarchy with bold headings, readable body text
- **Mobile-first** responsive design that works great on desktop too

---

## 📱 Pages & Features

### 1. Login / Register Page
- Minimal form with email + password
- Toggle between Sign In and Sign Up
- App logo and tagline at the top
- Powered by Supabase Auth

### 2. Dashboard / Home Page
- Header with app name, user location (editable), and profile avatar
- Service categories displayed as icon cards (Cleaning, Plumber, Electrician, Cook, Painter, Carpenter)
- Prominent "Instant Book" CTA
- Quick access to booking history

### 3. Service Booking Page
- Selected service details with description and pricing info
- Date/time picker (or "Book Now" for instant)
- Address confirmation
- Large "Book Now" button
- Animated "Searching for provider..." loading state

### 4. Booking Confirmation Page
- Unique Booking ID
- Assigned provider name and contact
- Estimated Arrival Time (ETA)
- Booking status badge (Confirmed)
- "Go to Booking History" button

### 5. Booking History Page
- Card-based list of past and current bookings
- Each card shows: service type, date/time, provider, status (Completed / Ongoing / Cancelled)
- Tap to view booking details

### 6. Profile Page
- User name, email, phone
- Saved addresses
- Logout button

---

## 🗄️ Backend (Supabase)
- **Authentication**: Email/password signup & login
- **User profiles**: Name, phone, default address
- **Services table**: Service categories with icons and descriptions
- **Bookings table**: Links user to service, tracks status, provider assignment, timestamps
- **Row-Level Security**: Users can only see their own bookings and profile

