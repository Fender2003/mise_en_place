# mise *en place* 🍳

> Your personal AI kitchen assistant — generate recipes from what's already in your fridge.

Built with React + Vite, powered by Groq (LLaMA 3.3), backed by Supabase.

---

## What it does

- **Pantry** — add ingredients manually or drop a grocery photo and let AI scan them automatically
- **Recipes** — generate 3 detailed recipes from your pantry, filtered by cook time, dietary preference, meal type, and serving size
- **Skip for now** — temporarily exclude ingredients from recipe generation without deleting them
- **Cookbook** — save recipes you've cooked, with star ratings and personal notes
- **Auth** — full sign-up / sign-in via Supabase, data persisted per user

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite |
| Styling | Plain CSS-in-JS (no framework) |
| AI / LLM | [Groq API](https://console.groq.com) — `llama-3.3-70b-versatile` |
| Database + Auth | [Supabase](https://supabase.com) |
| Deployment | Vercel (recommended) |

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/mise-en-place.git
cd mise-en-place
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GROQ_API_KEY=your-groq-key-here
```

**Where to find these:**

- **Supabase** → [supabase.com](https://supabase.com) → your project → Settings → API → copy *Project URL* and *anon public* key
- **Groq** → [console.groq.com](https://console.groq.com) → API Keys → create a new key (free tier available)

### 3. Set up Supabase tables

Run these in your Supabase project's SQL editor (Dashboard → SQL Editor):

```sql
-- Pantry items
create table pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  cat text,
  created_at timestamptz default now()
);

-- Cookbook entries
create table cookbook (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  emoji text,
  description text,
  stars int default 0,
  notes text,
  people int default 2,
  created_at timestamptz default now()
);

-- Row-level security: users can only see their own data
alter table pantry_items enable row level security;
alter table cookbook enable row level security;

create policy "Users manage own pantry"
  on pantry_items for all
  using (auth.uid() = user_id);

create policy "Users manage own cookbook"
  on cookbook for all
  using (auth.uid() = user_id);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project structure

```
mise-en-place/
├── src/
│   ├── App.jsx          # Main app — all UI and logic
│   ├── supabase.js      # Supabase client init
│   └── main.jsx         # React entry point
├── index.html
├── .env.local           # Your secrets (never committed)
├── .gitignore
└── vite.config.js
```

---

## Deployment (Vercel)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Vercel auto-detects Vite — no build config needed
4. Add your environment variables under **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GROQ_API_KEY`
5. Click **Deploy**

> ⚠️ Never commit `.env.local` — it's in `.gitignore` for a reason.

---

## Environment variables reference

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (safe to expose in frontend) |
| `VITE_GROQ_API_KEY` | Groq API key for LLM calls |

---

## Features in depth

### Pantry
- Add ingredients by typing or pressing Enter
- Drop/upload a photo — AI extracts every visible ingredient and adds them automatically
- Items are categorised automatically (Meat, Veg, Dairy, Grains, etc.)
- Filter by category
- **Skip for now** — tap ⊘ on any item to exclude it from the current recipe session without deleting it. Skips are session-only and reset on page refresh.

### Recipes
- Preferences: number of people (1–20), cook time (15 min → 1 hour+), dietary restriction, meal type
- AI generates 3 fully detailed recipes: vivid descriptions, exact ingredient quantities, 6–8 step method, separate prep/cook times, flavour profile tags, nutritional info, 3 chef's tips, and a serving suggestion
- Regenerate anytime with different results
- **Made it!** saves the recipe to your Cookbook with an optional rating and notes

### Cookbook
- Personal history of every dish you've cooked
- Star ratings (1–5) and freeform notes
- Delete entries you no longer want

---

## Local development tips

- Groq's free tier is generous — no credit card needed to get started
- Supabase free tier supports up to 500MB storage and 50,000 monthly active users
- If you change the Supabase schema, update the RLS policies too or queries will silently return empty arrays

---

## License

MIT