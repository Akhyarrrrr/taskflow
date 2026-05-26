# TaskFlow

TaskFlow is a premium, dark-themed Kanban workspace designed for seamless project planning, work prioritization, and moving ideas to execution. Built with performance and aesthetics in mind, it provides a distraction-free environment for focused teams.

![TaskFlow Hero Preview](public/taskflow-logo.png)

## Features

- **Row-Level Security (RLS):** Every task and board is securely isolated. You only see what belongs to you, enforced at the database level.
- **Lightning Fast Interactions:** Built with `@dnd-kit`, the drag-and-drop experience is buttery smooth without dropping a single frame.
- **Premium UI/UX:** A bespoke design system utilizing dark modes, subtle glassmorphism (`backdrop-blur`), and carefully curated gradients (`Teal & Orange` palette).
- **Responsive Command Center:** Manage projects flawlessly from desktop or mobile.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend Library:** [React 19](https://react.dev/) & TypeScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine. You will also need a Supabase project for the database and authentication.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials. Use `.env.example` as a reference:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Visit `http://localhost:3000` in your browser.

## Database Setup

TaskFlow requires two main tables in your Supabase project: `boards` and `tasks`. Ensure you have Row-Level Security (RLS) enabled on both tables so users can only access their own data based on `auth.uid()`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
