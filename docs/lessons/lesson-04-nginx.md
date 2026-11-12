# 📘 Lesson 4: Reverse Proxy & Web Server (Nginx)

## 1. Nginx Kya Hai aur Kyun Chahiye?
* **Problem:** Direct Node.js/Next.js ko port 80/443 par internet ke samne kholna dangerous hai. Node.js single-threaded hai aur DDoS, SSL handshake, aur static files caching ke liye optimize nahi hai.
* **Solution (Reverse Proxy):** Nginx internet aur backend servers ke darmiyan baithta hai:
  * Public requests (Port 80/443) ko receive karta hai.
  * SSL termination karta hai.
  * Static assets ko gzip compress aur cache karta hai.
  * Internal network mein request ko `web:3000` par forward (proxy pass) karta hai.

---

## 2. Forward Proxy vs Reverse Proxy
* **Forward Proxy (e.g. VPN):** Client ke aagay lagta hai taake internet se *Client* ki IP/Identity chhupayi ja sake.
* **Reverse Proxy (Nginx):** Servers ke aagay lagta hai taake internet se *Backend Servers* ki IP/Identity chhupayi ja sake.

---

## 3. DevOps Security: `ports` vs `expose`
* **`ports: ["3000:3000"]`:** Port ko aapke computer aur public internet par khol deta hai.
* **`expose: ["3000"]`:** Port ko bahir ki dunya se **chupa** deta hai aur sirf Docker ke internal network (`sindhhunar-network`) ke andar Nginx ke liye open rakhta hai.
* **Result:** Koi bhi user ya attacker direct Node.js par nahi aa sakta, har request ko Nginx ke security layers se guzar kar aana hoga.

---

## 4. Key Nginx Directives Explained
```nginx
# 1. Traffic ko Next.js container par forward karna
proxy_pass http://web:3000;

# 2. Asil user ki IP Next.js ko bhejna (taake logs aur tracking sahi hon)
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

# 3. Gzip Compression (Page load speed 70% barhane ke liye)
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;

# 4. Next.js Static Cache (Browser 1 saal tak repeat download na kare)
location /_next/static {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

---

## 5. Testing & Verification Commands
```bash
# Nginx ke sath containers ko update & restart karna
docker compose up -d

# Verify karna ke Nginx port 80 par live hai
docker compose ps

# Nginx ke access aur error logs check karna
docker compose logs -f nginx
```
