# 📘 Lesson 1: Monorepo Setup & Git Hygiene

## 1. Monorepo vs Nested Repositories
* **Masla:** Jab hum kisi repo ke andar doosri repositories clone karte hain, to unke andar purane `.git` folders mojood hote hain.
* **Nuqsan:** Root Git repo inhein "embedded submodules" samajhti hai aur GitHub par yeh folders empty ya un-clickable (grey arrow) ban jate hain.
* **Fix:** Subfolders ke andar se `.git` ko remove karna:
  ```bash
  rm -rf web/.git mobile/.git
  ```

---

## 2. Production .gitignore Setup
DevOps mein pehla rule hai ke unnecessary files aur secrets kabhi Git par commit na hon:
* **Dependencies:** `node_modules/`, `.pnp`
* **Secrets:** `.env`, `.env.local`, `*.pem`, `*.key`
* **Build Files:** `.next/`, `out/`, `dist/`
* **Mobile Artifacts:** `android/build/`, `.gradle/`, `ios/Pods/`, `*.apk`, `*.keystore`
* **Infra:** `*.tfstate`

---

## 3. 12-Factor App & Secrets Management
* Production ya local database passwords, API keys kabhi hardcode nahi hote.
* `.env.example` file commit ki jati hai jismein sirf variable names hote hain (dummy values ke sath), taake team members aur CI/CD pipelines ko required configuration ka pata chal sake.
