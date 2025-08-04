# Drug Information Database

A modern, responsive web application for managing and viewing drug information with advanced filtering capabilities using MongoDB Atlas.

## 🏗️ Project Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: Material-UI (MUI) v5
- **Language**: TypeScript
- **Styling**: Material-UI theme system with responsive design

### Backend
- **API**: Next.js API Routes (RESTful endpoints)
- **Database**: MongoDB Atlas (cloud-hosted)
- **Connection**: MongoDB native driver with connection pooling

### Testing
- **Framework**: Jest with React Testing Library
- **Coverage**: Components, API routes, and utility functions
- **Mocking**: API calls and database connections

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd drug-info-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up MongoDB Atlas**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create free account and cluster
   - Create database user
   - Whitelist your IP address
   - Get connection string

4. **Environment Setup**
   Create a `.env.local` file:
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/druginfo?retryWrites=true&w=majority
   NODE_ENV=development
   \`\`\`

5. **Seed Database**
   \`\`\`bash
   npm run seed:mongodb
   \`\`\`

6. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   Visit [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
\`\`\`

## 📊 Features

- **Responsive Drug Table**: Material-UI table with sticky headers
- **Company Filtering**: Real-time dropdown filtering
- **MongoDB Atlas Integration**: Cloud-hosted database
- **Performance Optimized**: Indexed queries and connection pooling
- **Error Handling**: Graceful error states and loading indicators

## 🌐 API Endpoints

### GET /api/drugs
Returns drug information with optional company filtering.

### GET /api/companies
Returns list of all unique company names.

### POST /api/seed
Seeds the database with initial data (development only).

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Add Environment Variables**
   - In Vercel dashboard, add `MONGODB_URI`
   - Use the same Atlas connection string

3. **Deploy**
   - Automatic deployment on git push
   - Serverless functions work perfectly with Atlas

## 🗄️ MongoDB Atlas Benefits

- **Free Tier**: 512MB storage included
- **Global Deployment**: Fast access worldwide
- **Automatic Backups**: Built-in data protection
- **Easy Scaling**: Upgrade as needed
- **No Maintenance**: Fully managed service

## 📈 Next Steps

1. **Set up MongoDB Atlas** following the connection string format
2. **Run the seed script** to populate your database
3. **Deploy to Vercel** for production use
4. **Monitor usage** in Atlas dashboard

Your MongoDB Atlas-powered drug information database is ready! 🚀
