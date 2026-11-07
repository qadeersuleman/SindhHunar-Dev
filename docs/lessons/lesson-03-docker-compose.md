# 📘 Lesson 3: Multi-Container Orchestration with Docker Compose

## 1. Docker Compose Kya Hai aur Kyun Chahiye?
* **Akele Containers:** `docker run` se ek waqt mein sirf ek container chalta hai. Agar 3-4 services hon (Web, DB, Redis), to har baar lambi commands likhna aur unki networking sambhalna mushkil ho jata hai.
* **Docker Compose Solution:** Ek YAML file (`docker-compose.yml`) mein poori multi-tier application architecture define hoti hai, aur sirf ek command se poora ecosystem start ho jata hai:
  ```bash
  docker compose up -d
  ```

---

## 2. Core Components of `docker-compose.yml`

### A. Services:
* `web`: Next.js frontend (custom build).
* `postgres`: Central database container (port 5432).
* `redis`: In-memory cache & real-time broker (port 6379).

### B. Volumes (Data Persistence):
* Containers by default temporary (ephemeral) hote hain. Agar container stop ya delete ho jaye to database ka data ura jata hai.
* **Named Volumes** (`postgres_data`, `redis_data`) host machine par data ko hamesha ke liye safe rakhte hain.

### C. Internal Bridge Networks:
* Compose ek private bridge network banata hai (`sindhhunar-network`).
* Containers aapas mein IP address ke bajaye **Service Name** se connect hote hain (e.g. `http://postgres:5432`, `redis://redis:6379`).

### D. Healthchecks & Startup Order:
* `depends_on` ke sath `condition: service_healthy` lagane se Web container tab tak wait karta hai jab tak DB aur Redis 100% connect hone ke qabil na ho jayein.

---

## 3. Environment Variables & Security
* Production API keys aur secrets ko `docker-compose.yml` mein hardcode nahi kiya jata.
* Root `.env` file banayi jati hai jo `.gitignore` mein hoti hai.
* Docker Compose automatically `.env` se values utha kar `${VARIABLE_NAME}` ke zariye containers mein inject karta hai.

---

## 4. Top Docker Compose Commands
```bash
# Services ko background mein start karna
docker compose up -d

# Running services aur health status check karna
docker compose ps

# Kisi specific service ke logs dekhna
docker compose logs -f web

# Services ko stop aur remove karna
docker compose down

# Re-build karke start karna (agar code badla ho)
docker compose up -d --build
```
