# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/af7256c1-d06b-447d-845b-5b3d49335e06

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/af7256c1-d06b-447d-845b-5b3d49335e06) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mrcherrywood/csv-uploader.git
   cd csv-uploader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase credentials and desired configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   NODE_ENV=production
   ```

### Production Deployment

1. Build the application:
   ```bash
   npm run build:prod
   ```

2. Start the server:
   ```bash
   npm run start:prod
   ```

Or use the combined deploy command:
```bash
npm run deploy
```

The application will be available at `http://your-server:3000`

### Railway Deployment

1. Install Railway CLI (optional):
   ```bash
   npm i -g @railway/cli
   ```

2. Deploy to Railway:
   - Option 1: Direct from GitHub
     1. Go to [Railway](https://railway.app/)
     2. Click "Start a New Project"
     3. Choose "Deploy from GitHub repo"
     4. Select your repository
     5. Add environment variables:
        - `VITE_SUPABASE_URL`
        - `VITE_SUPABASE_ANON_KEY`
        - `NODE_ENV=production`

   - Option 2: Using Railway CLI
     ```bash
     # Login to Railway
     railway login

     # Link to your project
     railway link

     # Deploy
     railway up
     ```

3. Configure Memory (Important for Large Files):
   - Go to your project settings in Railway
   - Under "Settings" → "Memory"
   - Set to at least 1GB (recommended 2GB for large files)

4. Environment Variables:
   - In Railway dashboard, go to "Variables"
   - Add all variables from `.env.example`
   - Make sure to set `NODE_ENV=production`

5. Monitoring:
   - Railway provides built-in logging
   - Monitor memory usage in the Railway dashboard
   - Check deployment status and logs in real-time

### Performance Tuning

For large datasets, you can adjust these environment variables:
- `MAX_BATCH_SIZE`: Number of rows per database batch (default: 50000)
- `PREVIEW_CHUNK_SIZE`: Number of rows per preview chunk (default: 100000)

### Memory Management

The server version is optimized for large datasets by:
- Processing data in chunks
- Efficient memory cleanup
- Server-side batch processing
- Progress tracking

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
