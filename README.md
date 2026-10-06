# Beast Universe — Phase 1 (fan-made concept)
Django + DRF backend, React (Vite) + React Three Fiber frontend.
Phase 1: design system, hero, Feastables 3D, product-based cursor, dynamic Shorts reels.

## Backend
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # add YOUTUBE_API_KEY (YouTube Data API v3)
python manage.py runserver     # http://localhost:8000/api/reels/

## Frontend
cd frontend
npm install
npm run dev     # http://localhost:5173  (proxies /api to :8000)

Without YOUTUBE_API_KEY the reels section shows placeholder cards.
Shorts come from the channel's Shorts-only playlist (UUSH + channel id minus "UC"); this is an
unofficial YouTube convention, so verify it still works. Videos play via official embeds only.
Disclaimer: unofficial fan project. Do not use official logos/assets as if affiliated.
