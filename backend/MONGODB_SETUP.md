# MongoDB Setup Guide

## Database Implementation

This backend now uses MongoDB for persistent data storage with the native MongoDB client (no ORMs).

## Collections

### 1. **users**
Stores user authentication and profile data.

**Fields:**
- `_id`: ObjectId (auto-generated)
- `email`: String (unique, indexed)
- `password`: String (hashed, null for OAuth users)
- `googleId`: String (for Google OAuth users, indexed)
- `name`: String
- `phone`: String
- `bio`: String
- `location`: String
- `profileImage`: String (base64 or URL)
- `createdAt`: Date
- `updatedAt`: Date

### 2. **favorites**
Stores user's favorite videos.

**Fields:**
- `_id`: ObjectId (auto-generated)
- `userId`: String (user's _id as string, indexed)
- `videoId`: String (YouTube video ID, compound indexed with userId)
- `title`: String
- `thumbnail`: String (URL)
- `channel`: String
- `channelThumbnail`: String (URL)
- `duration`: String
- `views`: String
- `publishedTime`: String
- `description`: String
- `dateAdded`: Date (indexed)

### 3. **history**
Stores user's watch history.

**Fields:**
- `_id`: ObjectId (auto-generated)
- `userId`: String (user's _id as string, indexed)
- `videoId`: String (YouTube video ID, indexed with userId)
- `title`: String
- `thumbnail`: String (URL)
- `channel`: String
- `channelThumbnail`: String (URL)
- `duration`: String
- `views`: String
- `publishedTime`: String
- `description`: String
- `watchProgress`: Number (0-100)
- `watchedAt`: Date (indexed with userId)

## Installation

### 1. Install MongoDB

**Option A: Local Installation**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 2. Configure Environment

Update `.env` file with your MongoDB connection string:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/yt-geo-project

# MongoDB Atlas example
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yt-geo-project
```

### 3. Start Backend

```bash
cd backend
npm install
node index.js
```

The database will automatically connect and create indexes on startup.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Profile
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)
- `PUT /api/profile/password` - Update password (requires auth)

### Favorites
- `GET /api/favorites` - Get all favorites (requires auth)
- `POST /api/favorites` - Add video to favorites (requires auth)
- `DELETE /api/favorites/:favoriteId` - Remove favorite (requires auth)
- `GET /api/favorites/check/:videoId` - Check if video is favorited (requires auth)
- `POST /api/favorites/toggle` - Toggle favorite status (requires auth)

### History
- `GET /api/history` - Get watch history (requires auth)
- `POST /api/history` - Add video to history (requires auth)
- `DELETE /api/history/:historyId` - Remove history item (requires auth)
- `DELETE /api/history` - Clear all history (requires auth)
- `PUT /api/history/progress` - Update watch progress (requires auth)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema Notes

- **Indexes**: Automatically created on startup for optimal query performance
- **Unique Constraints**:
  - `users.email` - prevents duplicate email addresses
  - `favorites(userId, videoId)` - prevents duplicate favorites
- **No ORM**: Uses native MongoDB client for simplicity and performance
- **CommonJS**: All code uses `require/module.exports` for consistency

## Troubleshooting

### Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongodb  # Linux
brew services list  # macOS

# Check connection string
echo $MONGODB_URI
```

### Index Creation Errors
If indexes fail to create, drop the database and restart:
```javascript
// In MongoDB shell
use yt-geo-project
db.dropDatabase()
```

### Port Conflicts
If port 27017 is in use, change the MongoDB port or update `MONGODB_URI`.

## Migration from LocalStorage

Frontend favorites/history will continue to work with localStorage until users authenticate and use the API endpoints. The frontend code already has the API structure ready - just update `USE_LOCAL_STORAGE` flag in frontend utils when ready to switch.
