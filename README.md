# Remix Tutorial Project

A comprehensive React application built with Remix v19 and TypeScript, demonstrating modern web development practices.

## 🚀 Tech Stack

- React v19
- Remix
- TypeScript
- Vercel (Deployment)
- pnpm (Package Manager)

## 📦 Initial Setup

### 1. Install pnpm

```bash
# Using npm
npm install -g pnpm

# Using curl for Unix systems
curl -fsSL https://get.pnpm.io/install.sh | sh -

# On Windows (PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 2. Create Remix Project

```bash
pnpm create remix@latest
```

Follow the prompts:

- Name your app (e.g., `remix-tutorial`)
- Choose "Just the basics"
- Select "Remix App Server"
- Choose TypeScript

### 3. Switch to pnpm (if you used npm initially)

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Create pnpm-lock.yaml
pnpm install
```

### 4. Git Setup

Initialize Git repository:

```bash
git init
```

Create `.gitignore` file with:

```plaintext
node_modules
/.cache
/build
/public/build
.env
.DS_Store
pnpm-debug.log
```

Initial commit:

```bash
git add .
git commit -m "Initial commit: Basic Remix setup with TypeScript using pnpm"
```

### 5. GitHub Repository Setup

1. Create new repository on GitHub:

   - Go to GitHub.com
   - Click "New repository"
   - Name your repository
   - Don't initialize with README
   - Click "Create repository"

2. Connect local to remote:

```bash
git remote add origin [your-github-repo-url]
git branch -M main
git push -u origin main
```

3. Create development branch:

```bash
git checkout -b dev
git push -u origin dev
```

### 6. Vercel Deployment

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Select "Remix"
   - Build and Output Settings:
     ```
     Build Command: pnpm build
     Install Command: pnpm install
     ```
   - Environment Variables: Add if needed
6. Add `vercel.json` to project root:

```json
{
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build"
}
```

7. Click "Deploy"

## 💻 Local Development

1. Clone the repository:

```bash
git clone [your-repository-url]
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🌐 Deployment

This project uses Vercel for deployment:

- Main branch deployments are automatic
- Preview deployments are created for pull requests
- Production URL: [your-app-url]
- Preview URLs: Generated per PR

## 🗂 Project Structure

```
remix-tutorial/
├── app/
│   ├── entry.client.tsx   # Client entry point
│   ├── entry.server.tsx   # Server entry point
│   ├── root.tsx          # Root component
│   └── routes/           # Application routes
├── public/               # Static assets
├── .gitignore           # Git ignore rules
├── vercel.json          # Vercel configuration
└── README.md            # Project documentation
```

## 🔄 Git Workflow

1. Feature Development:

```bash
git checkout dev
git checkout -b feature/your-feature-name
# Make changes
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

2. Create Pull Request:

   - Create PR from feature branch to dev
   - Wait for review and Vercel preview deployment
   - Merge after approval

3. Production Deployment:
   - Create PR from dev to main
   - Review and merge for production deployment

## 🛠 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm typecheck` - Check TypeScript types

## 📝 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
