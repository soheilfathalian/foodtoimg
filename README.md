# Food to IMG - AI Food Image Generator

A modern web application that generates stunning food photos from text descriptions using AI technology. Perfect for restaurants, food bloggers, and culinary professionals who need high-quality food imagery for menus and marketing materials.

## 🚀 Features

- **AI-Powered Image Generation**: Transform food descriptions into professional food photography
- **Real-time Processing**: Instant image generation with loading states and progress feedback
- **Smart Validation**: Automatically detects and guides users to enter only food-related items
- **One-Click Download**: Save generated images directly to your device
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with modern design principles

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for responsive design
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks (useState, useEffect)
- **Notifications**: Sonner for user feedback
- **HTTP Client**: Native Fetch API

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- A modern web browser

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/soheilfathalian/foodtoimg.git
cd foodtoimg
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using bun
bun install
```

### 3. Start Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev

# Or using bun
bun run dev
```

### 4. Open in Browser

Visit `http://localhost:5173` to see your application running locally.

## 📁 Project Structure

```
foodtoimg/
├── src/
│   ├── components/ui/     # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Application pages
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and design system
├── public/               # Static assets
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Design System

The application uses a cohesive design system with:

- **Primary Color**: Warm coral (#FF6F61) - perfect for food applications
- **Typography**: Inter font family for clean, modern text
- **Dark/Light Mode**: Comprehensive theme support
- **Custom Animations**: 3D loading spinners and smooth transitions
- **Responsive Breakpoints**: Mobile-first design approach

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will automatically deploy on every push to main branch

### Option 2: Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to [Netlify](https://netlify.com)
3. Configure redirects for SPA routing

### Option 3: GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json: `"deploy": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy`

## 🔌 API Integration

The application integrates with an intelligent AI image generation service via webhook that uses a multi-step validation and generation process:

### Backend Architecture

The backend consists of an **LLM Agent Pipeline** that ensures quality and prevents misuse:

1. **Input Validation Phase**
   - An LLM agent first analyzes the user input to verify it's a legitimate food name
   - This prevents the system from being used to generate non-food images
   - Invalid inputs are rejected with `[{"output": false}]` response

2. **AI Image Generation Phase**
   - Validated food names are passed to professional image generation AI models
   - **Supported AI Models**: Imagen 3/4, Flux, or GPT-Image (configurable)
   - Custom prompts are applied to ensure restaurant-quality food photography
   - Prompts include professional lighting, presentation, and food styling elements

3. **Optimization Phase**
   - Generated images are automatically resized and optimized for web use
   - File sizes are reduced while maintaining visual quality
   - Images are converted to web-friendly formats (PNG/JPEG)


```

### Security & Quality Features

- **Content Filtering**: LLM agent prevents generation of inappropriate content
- **Food-Only Policy**: Strict validation ensures only food-related images are generated
- **Professional Quality**: Custom prompts ensure restaurant-grade food photography
- **Web Optimization**: Automatic image compression and formatting for fast loading


## 🐛 Troubleshooting

### Common Issues

**Issue**: Images not displaying
- **Solution**: Check browser console for network errors and verify webhook response format

**Issue**: "Please only type food names" message appears for food items
- **Solution**: Check backend validation logic and webhook response format

**Issue**: Slow image generation
- **Solution**: This depends on the AI service performance - typical generation takes 5-30 seconds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Soheil Fathalian**
- GitHub: [@soheilfathalian](https://github.com/soheilfathalian)
- Repository: [foodtoimg](https://github.com/soheilfathalian/foodtoimg)

## 🙏 Acknowledgments

- Built with modern React and TypeScript
- UI components from shadcn/ui
- Styling with Tailwind CSS
- Icons from Lucide React

---

⭐ **Star this repository if you found it helpful!**
