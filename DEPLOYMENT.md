# Hosting on GitHub Pages

Follow these steps to deploy your application to GitHub Pages.

## 1. Preparation

### Install `gh-pages`
Run the following command in your terminal to install the deployment tool:
```bash
npm install gh-pages --save-dev
```

### Update `vite.config.js`
Open `vite.config.js` and update the `base` property with your repository name.
```javascript
export default defineConfig({
  base: '/YOUR_REPO_NAME/', // <--- Replace with your actual repo name (e.g., '/study-hub/')
  plugins: [react(), tailwindcss()],
  // ...
})
```

### Update Router (Important!)
GitHub Pages does not support standard routing (BrowserRouter) well. Switch to `HashRouter` in `src/App.jsx`:

**Change this:**
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
```

**To this:**
```jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
```

## 2. Deployment

### Push to GitHub
Make sure your project is pushed to a GitHub repository.
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Deploy
Run the deploy script:
```bash
npm run deploy
```

This will create a `gh-pages` branch and publish your app.

## 3. Access
Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
