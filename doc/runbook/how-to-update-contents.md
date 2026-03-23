---

Deploy to Production

# 1. Set up environment cp .env.prod.example .env # Edit with real credentials # 2. Build & start containers cd sys docker compose -f docker-compose.prod.yml up --build -d

# 3. Run DB migrations & seed content

docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed

Production uses Traefik reverse proxy with HTTPS (Cloudflare + Let's Encrypt) on domain yy-pg.hannari.app.

---

Update / Add Content

1. Create content folder in doc/contents/

Naming convention: {categoryTag}-{order}-{slug} (e.g., gas-03-advanced)

2. Create the required files

┌───────────┬─────────────────────────────────────────┐
│ File │ Purpose │
├───────────┼─────────────────────────────────────────┤
│ README.md │ Front matter with title and description │
├───────────┼─────────────────────────────────────────┤
│ lesson.md │ Lesson body in Markdown │
├───────────┼─────────────────────────────────────────┤
│ quiz.json │ Quiz questions with choices │
├───────────┼─────────────────────────────────────────┤
│ assets/ │ Images/media for the lesson │
└───────────┴─────────────────────────────────────────┘

3. Re-seed the database

Local:
docker compose exec backend npx prisma db seed

Production:

# Rebuild backend (so new content files are copied into container)

cd sys
docker compose -f docker-compose.prod.yml up --build -d backend

# Then re-seed

docker compose -f docker-compose.prod.yml exec backend npx prisma db seed

▎ The backend container rebuild is needed in production because Dockerfile.prod copies doc/contents/ into the container image.  
 Without rebuilding, the new files won't exist inside the container.

---

Category Management

Categories are defined in doc/contents/categories.json. Currently: gas, web, line. To add a new category, edit that file and re-seed.

---

Full documentation is already in your repo at:

- doc/runbook/howtorun.md
- doc/runbook/how-to-update-contents.md
