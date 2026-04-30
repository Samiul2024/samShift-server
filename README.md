# 🚀 SamShift Backend API Server

A scalable backend server for the **SamShift Parcel Delivery & Logistics System** built with:

- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK
- Stripe Payment Gateway

This backend powers:
- Parcel management
- Rider workflow
- Admin analytics
- Secure authentication
- Withdrawal system
- Payment processing

---

# 🌐 Live Server

- 🔗 Backend URL: https://backend-url.vercel.app

---

# 🧠 Backend Features

## 🔐 Authentication & Authorization

### Firebase Admin Authentication
- Firebase ID Token verification
- Secure protected routes
- Middleware-based access control

### Role-Based Access
- User
- Rider
- Admin

### Custom Middleware
- `verifyFBToken`
- `verifyAdmin`
- `verifyRider`

---

# 👤 User Management APIs

## Features
- Register new users
- Role management
- Admin promotion/removal
- User search system

## APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Create user |
| GET | `/users/search` | Search users |
| GET | `/users/role/:email` | Get user role |
| PATCH | `/users/admin/:id` | Make admin |
| PATCH | `/users/remove-admin/:id` | Remove admin |

---

# 📦 Parcel Management System

## Features
- Create parcels
- Delete parcels
- Fetch user parcels
- Parcel assignment
- Rider delivery workflow
- Delivery status updates

## Parcel Workflow

```text
created
↓
paid
↓
rider-assigned
↓
accepted-by-rider
↓
picked-up
↓
in-transit
↓
delivered
```

## APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/parcels` | Get parcels |
| POST | `/parcels` | Create parcel |
| DELETE | `/parcels/:id` | Delete parcel |
| GET | `/parcels/:id` | Get single parcel |
| GET | `/parcels/assignable` | Get assignable parcels |
| GET | `/parcels/assigned` | Get assigned parcels |
| GET | `/parcels/assigned/rider` | Get rider assigned parcels |
| PATCH | `/parcels/assign-rider/:id` | Assign rider |
| PATCH | `/parcels/rider-accept/:id` | Rider accepts delivery |
| PATCH | `/parcels/update-status/:id` | Update delivery status |

---

# 🚚 Rider Management System

## Features
- Rider application
- Rider approval system
- Rider activation/deactivation
- District-based rider filtering
- Rider role auto-upgrade

## APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/riders` | Apply as rider |
| GET | `/riders/pending` | Pending riders |
| GET | `/riders/active` | Active riders |
| GET | `/riders/by-district` | Riders by district |
| PATCH | `/riders/:id` | Update rider status |

---

# 📡 Real-Time Parcel Tracking System

## Features
- Tracking history
- Tracking timeline
- Automatic tracking insertion
- Delivery lifecycle tracking

## APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tracking` | Add tracking update |
| GET | `/tracking/:tracking_id` | Get tracking history |

---

# 💳 Stripe Payment System

## Features
- Stripe payment intent
- Secure payment processing
- Payment history
- Automatic parcel payment update
- Automatic tracking generation

## APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-payment-intent` | Create Stripe payment intent |
| POST | `/payments` | Save payment & update parcel |
| GET | `/payments` | Get payment history |

---

# 💰 Rider Earnings System

## Features
- Automatic earning creation
- Earnings history
- Pending/paid earning states
- Delivery-based income

## APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/earnings` | Rider earnings |

---

# 🏦 Rider Withdrawal System

## Features
- Rider withdrawal request
- Balance validation
- Pending request prevention
- Admin withdrawal approval
- Auto earnings settlement

## APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/withdraw-request` | Create withdraw request |
| GET | `/withdraw-requests/my` | Rider requests |
| GET | `/admin/withdraw-requests` | Admin all requests |
| PATCH | `/admin/withdraw-approve/:id` | Approve withdrawal |

---

# 📊 Advanced Admin Analytics Dashboard

## Features

### Revenue Analytics
- Total revenue
- Daily revenue
- Weekly revenue
- Monthly revenue

### Delivery Analytics
- Total parcels
- Delivered parcels
- Success rate

### Top Rider Leaderboard
- Top earners
- Delivery counts
- Earnings ranking

### Date Range Filter
- Last 7 days
- Last 30 days

## APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/analytics` | Advanced analytics |

### Query Parameters

```bash
/admin/analytics?range=7d
/admin/analytics?range=30d
```

---

# 🧱 Database Collections

```text
users
parcels
payments
tracking
riders
earnings
withdrawRequests
```

---

# ⚙️ Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas

## Authentication
- Firebase Admin SDK

## Payments
- Stripe

## Hosting
- Vercel 

---

# 🔐 Security Features

- Firebase JWT verification
- Protected routes
- Role validation
- Secure payment flow
- Admin-only APIs
- Rider-only APIs

---

# 📂 Project Structure

```text
server/
│
├── firebase-admin-key.json
├── .env
├── index.js
├── package.json
└── README.md
```

---

# 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000

DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password

PAYMENT_GATEWAY_KEY=your_stripe_secret_key
```

---

# 🔥 Installation & Setup

# 1️⃣ Clone Repository

```bash
git clone https://github.com/Samiul2024/samShift-server.git 
```

---

# 2️⃣ Move Into Project

```bash
cd samshift-server
```

---

# 3️⃣ Install Dependencies

```bash
npm install
```

---

# 4️⃣ Setup Firebase Admin Key

Place:

```text
firebase-admin-key.json
```

inside the root directory.

---

# 5️⃣ Run Development Server

```bash
npm run dev
```

---

# 🚀 Production Deployment

## Recommended Platforms
- Vercel
- Render
- Railway

---

# 📈 System Highlights

## Smart Parcel Flow
- Secure payment confirmation
- Auto tracking generation
- Rider assignment workflow
- Real-time status updates

## Smart Rider System
- District-based assignment
- Earnings automation
- Withdrawal management

## Advanced Admin System
- Analytics dashboard
- Revenue tracking
- Success rate monitoring
- Top riders leaderboard

---

# 🔥 Future Improvements

- Live Google Maps tracking
- Push notifications
- SMS integration
- AI delivery optimization
- Rider mobile app
- Auto route optimization
- Real-time websocket updates
- OTP delivery verification
- Multi-warehouse support

---

# 👨‍💻 Author

## Md. Samiulla Hossen

### MERN Stack Developer

Skills:
- React
- Node.js
- Express.js
- MongoDB
- Firebase
- Stripe
- Tailwind CSS

---

# ⭐ Support

If this project helps you, consider giving the repository a ⭐ on GitHub.

---

# 📜 License

This project is developed for educational and portfolio purposes.

---

> Built with scalability, performance, and real-world logistics workflow architecture 🚚