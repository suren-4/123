# Kalanjiyam

A modern web application for exploring, documenting, and sharing archaeological artifacts and historical heritage.

---

## 📌 Project Overview
Kalanjiyam is a platform that connects archaeologists, historians, and enthusiasts to explore and document archaeological artifacts. The application provides a user-friendly interface for browsing artifacts, viewing detailed information, and contributing to the archaeological knowledge base.

---

## ✨ Features
✅ **Artifact Exploration** – Browse through a collection of archaeological artifacts with pagination and search functionality.  
✅ **Detailed Artifact Views** – View comprehensive information about each artifact, including period, location, material, and cultural significance.  
✅ **User Authentication** – Secure login and registration system.  
✅ **Search Functionality** – Find artifacts by title, description, period, location, or culture.  
✅ **Feature Image Upscaling** – Enhance image resolution using AI-powered upscaling with Real-ESRGAN.  

---

## 🛠️ Technology Stack

### **Frontend**
- ⚛️ React.js
- 🚀 React Router for navigation
- 🌟 CSS for styling

### **Backend**
- 🔥 Supabase for database and authentication
- ☁️ Cloudinary for image storage and management
- 🔍 Real-ESRGAN for image upscaling
- Cloud-based image hosting
- Image optimization and transformation


---

## 📂 Code Structure & Dependencies

The project follows a structured directory layout:

```plaintext
Kalanjiyam/
|— .vscode/          # VS Code settings
|— backend/          # Backend services and APIs
|— public/           # Static assets
|— src/
|   ├─ components/   # Reusable components (Navbar, Footer, etc.)
|   ├─ pages/        # Page components (Home, Artifact Details, Login, etc.)
|   ├─ services/     # API and database interaction logic
|   ├─ assets/       # Images and static resources
|   ├─ styles/       # Global and component-specific styles
|   ├─ App.js        # Main application entry point
|   └─ index.js      # ReactDOM entry point
|— .env              # Environment variables
|— .gitattributes    # Git configuration
|— .gitignore        # Ignored files
|— .npmrc            # npm configuration
|— package.json      # Dependencies and scripts
|— package-lock.json # Dependency lock file
|— yarn.lock         # Yarn lock file
|— README.md         # Documentation
```

---

## 🛆 Dependencies
Below is the complete list of dependencies from `package.json`:

```json
{
  "dependencies": {
    "@cloudinary/react": "^1.14.1",
    "@cloudinary/url-gen": "^1.21.0",
    "@supabase/supabase-js": "^2.x.x",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.8.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.1",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4",
    "real-esrgan": "^1.x.x"
  },
  "devDependencies": {
    "eslint": "^8.x.x",
    "eslint-plugin-react": "^7.x.x"
  }
}
```

---

## 🚀 Setup & Execution Steps

### 🔹 Prerequisites
- Node.js installed
- Supabase account set up
- Cloudinary account for image storage

### 🔹 Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/Kalanjiyam.git
    cd Kalanjiyam
    ```

2. Install dependencies using Yarn:
    ```sh
    yarn install
    ```

3. Set up environment variables:  
   Create a `.env` file in the root directory and add the following:
    ```sh
    REACT_APP_SUPABASE_URL=your_supabase_url
    REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
    REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    ```

### 🔹 Running the Application
#### **Frontend**
To start the development server:
```sh
yarn start
```
This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### **Backend (Supabase Configuration)**
Since Supabase is a backend-as-a-service platform, ensure your Supabase project is correctly configured with:
- Database schema for artifacts (tables: `artifacts`, `users`)
- Authentication settings enabled

### 🔹 Building for Production
To create an optimized production build:
```sh
yarn build
```
The build files will be available in the `build/` directory, ready for deployment.

---

## 🎯 Expected Output and Technical Details
- Users can browse, search, and explore artifacts with detailed views.
- Secure authentication ensures only registered users can contribute.
- Artifacts are displayed with optimized images using Cloudinary.
- AI-powered image upscaling enhances artifact visuals.
- The application adapts to different screen sizes.

---

## 📌 Additional Requirements & Considerations
✅ Ensure Supabase API keys are stored securely.  
✅ Optimize Cloudinary usage to reduce bandwidth costs.  
✅ Implement proper error handling for API requests.  
✅ Consider adding role-based access control for contributors and administrators.  

---
