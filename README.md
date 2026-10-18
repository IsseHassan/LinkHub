# 🔗 LinkHub

> A full-stack **link-in-bio** platform that lets users manage, share, and track all their important links from a single, personalised public profile.

**Live demo:** [new-linkhub.vercel.app]() · **API:** [link-hub-api.vercel.app](https://link-hub-api.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure JWT-based sign-up & login with bcrypt password hashing |
| 🌐 **Public Profile Page** | Shareable `/:displayName` page showing bio, avatar, links, and a photo gallery |
| 🔗 **Link Management** | Add, reorder, and delete links; each link gets a unique 8-char short URL |
| 📊 **Analytics Dashboard** | Total clicks, unique visitors, daily trends, top countries, device breakdown, and per-link stats |
| 🖼️ **Image Uploads** | Avatar & memory photos optimised with Sharp, then stored on Cloudinary |
| 🎨 **Theming** | Multiple profile themes selectable from the dashboard |
| ⚙️ **Settings** | Change email, password, notification preferences, and public/private profile toggle |
| 📱 **Responsive UI** | Mobile-first design built with React, Tailwind CSS, and Radix UI primitives |

---

## 🏗️ Project Structure

```
LinkHub/
├── Backend/          # Node.js / Express REST API
└── Frontend/         # React + TypeScript SPA (Vite)
```

---

## 🖥️ Backend

**Stack:** Node.js · Express · MongoDB (Mongoose) · JWT · Cloudinary · Multer · Sharp

### Directory layout

```
Backend/
├── server.js          # Entry point – configures Express, CORS, middleware, routes
├── config/
│   └── cloudinary.js  # Cloudinary SDK initialisation
├── models/
│   └── User.js        # Mongoose schema (user, links, memories, clickData)
└── routes/
    ├── auth.js        # POST /signup, POST /login
    ├── profile.js     # Profile CRUD, image upload, short-URL redirect, analytics
    └── settings.js    # GET/PUT account settings
```

### API Reference

#### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | ❌ | Create a new account |
| `POST` | `/login` | ❌ | Authenticate and receive a JWT |

#### Profile — `/api/profile`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get the authenticated user's profile |
| `PUT` | `/` | ✅ | Update display name, bio, avatar, links, memories, theme |
| `POST` | `/links` | ✅ | Add a new link (auto-generates a short URL) |
| `POST` | `/upload` | ✅ | Upload and optimise an image to Cloudinary |
| `GET` | `/:displayName` | ❌ | Fetch a public profile by display name |
| `GET` | `/click/:shortUrl` | ❌ | Track a click and redirect to the original URL |
| `GET` | `/user/analytics` | ✅ | Retrieve analytics (`?range=7` / `30` / `90`) |

#### Settings — `/api/settings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get account settings (email, notifications, publicProfile) |
| `PUT` | `/` | ✅ | Update email, password, and/or settings flags |

### Data Model (User)

```js
{
  email, password,        // Auth credentials (password hashed with bcrypt)
  displayName, bio,       // Public profile info
  avatar,                 // Cloudinary image URL
  links: [{               // User's links
    id, title, url,
    shortUrl,             // 8-char nanoid
    clicks
  }],
  memories: [{ title, imageUrl }],  // Photo gallery
  theme,                  // Active profile theme
  totalClicks,            // Aggregate click counter
  clickData: [{           // Per-click analytics events
    date, country, device, linkId, visitorId
  }],
  uniqueVisitors,
  settings: { notifications, publicProfile }
}
```

### Environment Variables

Create a `.env` file in `Backend/`:

```env
PORT=5000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

### Running the Backend

```bash
cd Backend
npm install

# Development (with hot-reload via nodemon)
npm run dev

# Production
npm start
```

---

## 🎨 Frontend

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Radix UI · Framer Motion · Recharts · React Router v7

### Directory layout

```
Frontend/src/
├── main.tsx             # App entry point (wraps app in AuthProvider)
├── App.tsx              # Root component – delegates to AppRoutes
├── routes/
│   ├── index.tsx        # Top-level route declarations
│   └── Dashboard/       # Nested dashboard routes
├── pages/
│   ├── landing/         # Public landing / home page
│   ├── login/           # Login page
│   ├── signup/          # Sign-up page
│   ├── user/            # Public profile view (/:displayName)
│   └── dashboard/
│       ├── index.tsx    # Dashboard overview
│       ├── Layout.tsx   # Sidebar / shell layout
│       ├── profile/     # Profile editor
│       ├── analytics/   # Analytics charts and tables
│       └── settings/    # Account settings
├── contexts/
│   └── auth-context.tsx # Auth state, login/signup/logout actions, token expiry
├── hooks/
│   ├── use-require-auth.ts  # Redirect-to-login guard hook
│   └── use-toast.ts         # Toast notification hook
├── components/
│   ├── protected-route.tsx  # Wrapper that enforces authentication
│   └── ui/                  # Radix-based reusable UI components
└── lib/                     # Shared utilities
```

### Pages & Routes

| Route | Page | Protected |
|---|---|---|
| `/` | Landing page | ❌ |
| `/login` | Login | ❌ |
| `/signup` | Sign-up | ❌ |
| `/profile` | Current user's public profile preview | ❌ |
| `/dashboard` | Dashboard overview | ✅ |
| `/dashboard/profile` | Profile editor | ✅ |
| `/dashboard/analytics` | Analytics charts | ✅ |
| `/dashboard/settings` | Account settings | ✅ |

### Authentication Flow

- JWT tokens are stored in `localStorage` alongside an expiry timestamp.
- `AuthContext` validates and refreshes the token on every app load, and automatically logs out when the token expires.
- Protected routes use `ProtectedRoute` which redirects unauthenticated users to `/login`.

### Running the Frontend

```bash
cd Frontend
npm install

# Development server (http://localhost:5173)
npm run dev

# Type-check + production build
npm run build

# Preview the production build
npm run preview
```

---

## 🚀 Deployment

Both services are deployed on **Vercel**:

- **Frontend** – standard Vite static build (`vercel.json` rewrites all paths to `index.html`).
- **Backend** – serverless Node.js function via `@vercel/node`; all requests are routed to `server.js`.

To deploy your own instance:

1. Push the repo to GitHub.
2. Import the `Backend/` and `Frontend/` directories as **separate Vercel projects**.
3. Set the Backend environment variables in the Vercel dashboard.
4. Update the API base URL in `Frontend/src/contexts/auth-context.tsx` (and any other fetch calls) to point to your Backend deployment URL.

---

## 🛠️ Tech Stack Summary

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Framer Motion, Recharts, React Router v7 |
| **Backend** | Node.js, Express, Mongoose, JWT, bcryptjs, Multer, Sharp, Cloudinary, geoip-lite, nanoid |
| **Database** | MongoDB Atlas |
| **Storage** | Cloudinary (images) |
| **Deployment** | Vercel (frontend & backend) |

---

## 📄 License

This project is open source. Feel free to fork and adapt it for your own link-in-bio needs.
