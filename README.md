# AI Experiment Frontend

A React frontend for exploring and querying an experimental dataset. Built with Create React App and Tailwind CSS. The UI connects to a backend service to run advanced dataset filters and get AI-suggested hypotheses.

Highlights
- React (Create React App) application
- Tailwind CSS for styling
- Uses axios to call the backend API
- Build output is placed in the `build/` directory

Getting started

1. Install dependencies

   npm install

2. Set the backend API URL (optional)

   - By default the app expects the backend at `http://localhost:10000`.
   - To override, set the environment variable used by the app (example):

     export REACT_APP_API_URL="http://localhost:10000"

3. Run in development

   npm start

4. Build for production

   npm run build

Project structure
- src/ — React source code
- public/ — static files
- build/ — production build output (generated)
- package.json — scripts and dependencies
- tailwind.config.js, postcss.config.js — Tailwind setup

API integration
- POST /filter — Accepts JSON { "query": "..." } and returns matched experiments
- GET /suggest — Returns AI-generated hypothesis suggestions

Notes
- This repository includes a `package-lock.json` and `node_modules` which may increase clone size. Consider removing `node_modules` from the repo and adding/updating .gitignore if needed.

License
- Add your preferred license here.
