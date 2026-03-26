# 🚀 NeuroPath AI

An AI-based learning platform that helps students learn better by understanding their strengths and weaknesses.

🌐 Live Demo: https://v0-sb-neuropath-vit.vercel.app/
📊 PPT: https://v0-neuro-path-ai-design.vercel.app/

## 📌 What is this project?
NeuroPath AI is a learning platform for Computer Science students.
Instead of giving the same content to everyone, it adapts to each student.
It tracks:
What you understand
Where you struggle
How you learn
And then it suggests what you should do next.

## 🧠 How does it work?

The system creates something like a “student profile” (we call it a digital twin).
Based on your activity:
If you do well → it gives harder problems
If you struggle → it helps you revise basics
If you make mistakes → it explains them
So learning becomes more personal and effective.

## ✨ Features
📚 Personalized learning path
🧠 Tracks your understanding of each topic
🎯 Suggests what to learn next
💻 Checks your code and gives feedback
📊 Shows your progress
🏗️ Project Structure

neuro-path-ai/

backend/        → API and server logic  
ai-engine/      → AI logic (tracking + recommendation)  
frontend/       → User interface (React)  
⚙️ How to run

### Clone the repo
git clone https://github.com/your-username/neuro-path-ai.git

### Go inside folder
cd neuro-path-ai

### Install frontend
npm install

### Run frontend
npm run dev

### Run backend
uvicorn backend.main:app --reload
🧩 Main Idea

The goal is simple:

👉 Every student learns differently
👉 This app tries to adjust to each student

### 🎯 Who is this for?
Computer Science students
People preparing for coding interviews
Anyone who wants structured learning

### 🚀 Future Improvements
Better AI recommendations
More subjects/topics
Real-time analytics
Full deployment with real users

### 🤝 Contributions

If you’re interested, feel free to contribute!
You can:
Improve UI
Improve AI logic
Add new features
💡 Inspiration

We wanted to build something that feels like:
A personal tutor
But powered by AI


### sb-neuropath-vit
This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/gitswagata1/sb-neuropath-vit-8g" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
