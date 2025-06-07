# Character Builder

A simple and clean character AI chat application that lets you create custom AI characters and have conversations with them.

## Features

- **Character Creator**: Design custom AI characters with personality traits, visual styles, and backgrounds
- **AI-Generated Images**: Automatically creates character portraits using DALL-E
- **Real-time Chat**: Have conversations with your created characters using OpenAI's GPT models
- **Responsive Design**: Clean, modern UI that works on desktop and mobile

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables:
   - `OPENAI_API_KEY` - Your OpenAI API key
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Create a Character**: Use the left panel to describe your character, select their personality tone, gender presentation, and visual style
2. **Generate**: Click "Generate Character" to create an enhanced description and AI-generated image
3. **Chat**: Start chatting with your character in the right panel - they'll respond based on their personality and background

## Technologies Used

- **Frontend**: React with Next.js 15 (App Router), TypeScript, TailwindCSS
- **AI Integration**: OpenAI GPT-4 for character generation and chat, DALL-E 3 for image generation
- **UI Components**: Lucide React icons, Framer Motion for animations
- **Streaming**: Vercel AI SDK for real-time chat responses
