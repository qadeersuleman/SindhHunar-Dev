# 📘 Lesson 2: Containerization with Docker (Next.js Production Setup)

## 1. Docker Kya Hai aur Kyun Zaroori Hai?
* **"Works on my machine" Problem:** Aksar code developer ke laptop par chalta hai lekin doosre bande ke computer ya cloud server par dependencies / OS mismatch ki wajah se fail ho jata hai.
* **Docker Solution:** Docker code, runtime (Node.js), aur OS libraries ko ek sealed, lightweight **Container** mein pack kar deta hai jo har operating system (Linux, Mac, Windows, Cloud) par 100% ek jesa chalta hai.

---

## 2. Docker ke 3 Core Pillars
1. **Dockerfile (Recipe):** Instructions ki text file jismein likha hota hai ke container kaise banega.
2. **Docker Image (Blueprint / Frozen Snapshot):** Dockerfile ko build karne se banne wali read-only image (jaise `sindhhunar-web`).
3. **Docker Container (Living Application):** Image ko run karne se banne wala active process (jaise `sindhhunar-app`).

---

## 3. Multi-Stage Dockerfile (DevOps Best Practice)
Aam Dockerfile mein images ka size **1.2 GB+** ho jata hai. Humne **Multi-Stage Build** use ki jisse image size sirf **219 MB** reh gaya:

| Stage | Name | Kaam (Purpose) |
|---|---|---|
| **Stage 1** | `base` | `node:22-alpine` lightweight base image define ki |
| **Stage 2** | `deps` | `package.json` copy karke `npm ci` se clean packages install kiye |
| **Stage 3** | `builder` | Next.js code compile kiya aur production build create ki |
| **Stage 4** | `runner` | Sirf final standalone build copy ki, dev tools aur heavy node_modules piche chhor diye |

### Next.js Standalone Mode:
`next.config.ts` mein `output: 'standalone'` add kiya. Iska faida yeh hai ke Next.js sirf zaroori files aur ek minimal `server.js` banata hai, production mein full `node_modules` ki zaroorat nahi rehti.

### Security Best Practice:
Production container ko kabhi `root` user se nahi chalana chahiye. Humne non-root user `nextjs` (UID 1001) banaya aur permissions assign kiye.

---

## 4. Most Common Docker Commands (Cheat Sheet)

### Image Commands:
```bash
# Docker image build karna (aakhri dot . ka matlab current folder)
docker build -t sindhhunar-web .

# Tamam images ki list aur size dekhna
docker images

# Kisi image ko delete karna
docker rmi sindhhunar-web
```

### Container Commands:
```bash
# Container background mein run karna (-d) aur port bind karna (-p)
docker run -d -p 3000:3000 --name sindhhunar-app sindhhunar-web

# Running containers dekhna
docker ps

# All containers dekhna (stopped containers samet)
docker ps -a

# Container ke live logs dekhna
docker logs -f sindhhunar-app

# Container ke andar terminal kholna (debugging)
docker exec -it sindhhunar-app sh

# Container ko stop / start / delete karna
docker stop sindhhunar-app
docker start sindhhunar-app
docker rm -f sindhhunar-app
```

---

## 5. Troubleshooting & Beginner Gotchas
1. **Permission Denied (`/var/run/docker.sock`):**
   * *Wajah:* Linux user `docker` group ka hissa nahi hota.
   * *Fix:* `sudo usermod -aG docker $USER` aur `newgrp docker`.
2. **`open Dockerfile: no such file or directory`:**
   * *Wajah:* Terminal kisi aur folder mein hota hai jahan Dockerfile mojood nahi hoti.
   * *Fix:* Sahi folder mein `cd` karein ya `-f` flag se path dein (`docker build -f web/Dockerfile web`).
3. **`docker buildx requires 1 argument`:**
   * *Wajah:* Aakhri mein build context ka dot (`.`) lagana bhool jana.
