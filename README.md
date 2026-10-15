# NIVORA

**An Intelligent Platform for Accommodation Discovery and Shared Living**

A complete full-stack web application for discovering rooms, PGs, and shared living spaces with transparent expense calculation and smart property matching.

## Features

- 🏠 **Property Listings** - Single rooms, shared accommodations, PGs, hostels, flats
- 💰 **Smart Expense Calculator** - Transparent breakdown of all monthly costs
- 🔍 **Advanced Search** - Filter by location, budget, amenities, and more
- 🎯 **Property Matching** - Submit requirements and get matched properties
- ❤️ **Wishlist** - Save and compare favorite properties
- 💬 **Inquiry System** - Direct communication with property owners
- 👥 **Role-Based Access** - Separate dashboards for students, owners, and admins
- 📸 **Image Upload** - Multiple property photos via Cloudinary
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Express Validator

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Bootstrap 5
- Font Awesome icons

## Prerequisites

Before running NIVORA, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Cloudinary Account** (free tier works) - [Sign up](https://cloudinary.com/users/register/free)

## Installation

### 1. Clone or Extract the Project

```bash
cd Nivora
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**
- Start MongoDB service on your machine
- MongoDB will run on `mongodb://localhost:27017` by default

**Option B: MongoDB Atlas (Cloud)**
- Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in `.env`

### 4. Configure Cloudinary

1. Sign up for a free Cloudinary account at [cloudinary.com](https://cloudinary.com/users/register/free)
2. Go to your Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret
4. Update these values in `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Environment Configuration

The `.env` file is already created. Update these values if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nivora
JWT_SECRET=change_this_to_a_long_random_string_in_production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Application

### 1. Start MongoDB

If using local MongoDB:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### 2. Seed the Database (Optional)

This creates sample data including test users and properties:

```bash
npm run seed
```

**Test Accounts Created:**
- **Admin**: admin@nivora.com / admin123
- **Owner**: owner@nivora.com / owner123
- **Student**: student@nivora.com / student123

### 3. Start the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

### 4. Open the Application

Visit **http://localhost:5000** in your web browser.

## Project Structure

```
NIVORA/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Property.js        # Property schema
│   │   ├── Wishlist.js        # Wishlist schema
│   │   ├── Inquiry.js         # Inquiry schema
│   │   └── RoomRequirement.js # Room requirement schema
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   └── propertyController.js   # Property CRUD operations
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── properties.js      # Property routes
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   └── errorHandler.js    # Error handling
│   └── server.js              # Express server
│
├── frontend/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   ├── api.js             # API utilities
│   │   └── auth.js            # Auth helpers
│   ├── index.html             # Homepage
│   └── [other pages]          # Additional pages
│
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
└── README.md                  # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (owner only)
- `PUT /api/properties/:id` - Update property (owner only)
- `DELETE /api/properties/:id` - Delete property (owner/admin)
- `GET /api/properties/owner/my` - Get owner's properties

## User Roles

### Student
- Browse and search properties
- View detailed property information
- Calculate total expenses
- Save properties to wishlist
- Submit inquiries to owners
- Submit room requirements
- Get property recommendations

### Owner
- List properties with photos
- Manage property details and availability
- View and respond to inquiries
- Update expense information
- View property statistics

### Administrator
- View all users and properties
- Suspend/activate user accounts
- Remove inappropriate listings
- View platform statistics

## Features in Detail

### Smart Expense Calculator
The platform calculates:
- **Monthly Rent** - Base accommodation cost
- **Monthly Expenses** - Electricity, water, Wi-Fi, maintenance, etc.
- **One-Time Costs** - Security deposit, brokerage, move-in charges
- **Estimated Total** - Complete monthly living cost
- **Per-Person Costs** - For shared accommodations

### Property Matching Algorithm
The system matches properties based on:
- Location (city, locality)
- Budget (monthly rent and total cost)
- Property and room type
- Required amenities
- Furnishing preference
- Move-in date compatibility

Match scores show how well each property fits the requirements.

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solution**: Ensure MongoDB is running. Check the `MONGODB_URI` in `.env`.

### Cloudinary Upload Error
```
Error: Only JPEG, PNG, and WebP images are allowed
```
**Solution**: Verify Cloudinary credentials in `.env` and upload supported image formats.

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Change `PORT` in `.env` or stop the process using port 5000.

### Missing Dependencies
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` to install all dependencies.

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

### Environment Variables

Never commit `.env` to version control. Use `.env.example` as a template.

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Input validation with express-validator
- Rate limiting on API endpoints
- Helmet for HTTP headers
- MongoDB injection prevention
- CORS configuration
- Secure cookie handling

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

ISC

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Ensure environment variables are set correctly

---

Built with ❤️ for students and professionals seeking accommodation.
