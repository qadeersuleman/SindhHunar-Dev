# 📘 Lesson 5: Automated CI/CD Pipelines with GitHub Actions

## 1. CI/CD Kya Hai aur Kyun Zaroori Hai?
* **Manual Problem:** Har developer laptop par test run kare ya na kare, direct push karne se bugs production server par chale jate hain.
* **Automated Solution:** GitHub Actions cloud par virtual machines (runners) chala kar code ko automatically verify karta hai:
  * **CI (Continuous Integration):** Har push/PR par automated testing, linting, aur Docker image build verify karna.
  * **CD (Continuous Deployment):** Verified Docker image ko registry (Docker Hub/GHCR) par upload karke live server par deploy karna.

---

## 2. Anatomy of a GitHub Actions Workflow (`.github/workflows/`)

### A. Triggers (`on`):
* `push` aur `pull_request` to `main` branch.
* **Monorepo Path Filtering:** `paths: ['web/**', 'infra/**']` lagane se sirf tab pipeline chalegi jab Web se related code change hoga. Mobile ke push par faltu pipeline nahi chalegi (Cloud minutes bachte hain!).

### B. Runners (`runs-on`):
* `ubuntu-latest`: GitHub ki free virtual cloud machine jo pipeline execute karti hai.

### C. Jobs & Dependencies (`needs`):
* `quality`: Pehle code linting aur TypeScript errors check karta hai.
* `docker-build`: Yeh job `needs: quality` par depend karti hai—yani agar code quality fail hui to Docker build start hi nahi hoga!

---

## 3. GitHub Actions Docker Layer Caching (Performance Trick)
```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```
* **Kyun Zaroori Hai?** Aam tor par Docker build cloud par 3 se 5 minute leti hai kyunki har bar zero se layers download hoti hain.
* **GHA Cache:** GitHub Actions cache unchanged layers ko cloud par save kar leta hai, agle push par build sirf **20-30 seconds** mein complete ho jati hai!

---

## 4. How to Inspect Live Pipelines on GitHub
1. GitHub repository kholein.
2. Top menu mein **"Actions"** tab par click karein.
3. Apni latest commit ("feat(ci): ...") par click karein.
4. Real-time mein dono jobs (`Code Quality` aur `Docker Build`) ko Green tick (✔) hote hue dekhein!
