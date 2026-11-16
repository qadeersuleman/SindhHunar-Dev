# 📘 Lesson 7: Cloud Server & Production Deployment (VPS & CD Automation)

## 1. Cloud VPS Kya Hai? (Where Production Lives)
* **Local Laptop vs Cloud VPS:** Laptop band hone par website band ho jati hai. Production ke liye hum cloud providers (DigitalOcean, AWS EC2, Hetzner) se ek Linux virtual server rent karte hain jo 24/7 internet par live rehta hai.
* **Public Static IP:** Server ko ek fixed IP address milta hai (e.g. `165.22.120.45`).

---

## 2. Server Security & Hardening (DevOps Golden Rules)
Khatarnaak hacker attacks se bachne ke liye naye server par pehle din yeh 3 kaam kiye jate hain:

### A. SSH Key Authentication (No Passwords!):
* Server par login karne ke liye password use karna dangerous hai (brute-force attacks).
* **SSH Key Pair** banta hai:
  ```bash
  # Laptop par key pair generate karna
  ssh-keygen -t ed25519 -C "admin@sindhhunar.com"
  
  # Public key ko cloud server par bhejna
  ssh-copy-id user@YOUR_SERVER_IP
  ```

### B. Linux Firewall (UFW):
* Sirf zaroori ports open rakhein:
  * Port 22: SSH (Admin remote login)
  * Port 80: HTTP (Web traffic via Nginx)
  * Port 443: HTTPS (SSL traffic via Nginx)
* Baaqi tamam ports (Port 3000, 5432, 6379) firewall par **BLOCK** rehte hain!

---

## 3. Deployment Scripts Blueprint
Humne do automated bash scripts banaye hain:

1. **`infra/scripts/setup-server.sh`:**
   * Naye server par ek click par Docker, Compose, aur UFW Firewall install & configure karta hai.
2. **`infra/scripts/deploy.sh` (Zero-Downtime Deploy):**
   * GitHub se latest code pull karta hai.
   * Background mein containers ko re-build karta hai.
   * Health check run karta hai (agar HTTP 200 na aye to alert deta hai).
   * Purani un-used Docker images ko prune karke disk space bachata hai.

---

## 4. Domain & SSL/HTTPS Setup (Let's Encrypt)
Jab aapke paas domain ho (e.g., `sindhhunar.com`):
1. **DNS Management:**
   * `A Record` $\rightarrow$ `@` points to `YOUR_SERVER_IP`
   * `A Record` $\rightarrow$ `www` points to `YOUR_SERVER_IP`
2. **Certbot (Free SSL Certificate):**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d sindhhunar.com -d www.sindhhunar.com
   ```
   Certbot khud Nginx config mein SSL certificates inject karta hai aur 90 days baad automatically renew karta hai!
