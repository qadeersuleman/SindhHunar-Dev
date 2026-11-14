# 📘 Lesson 6: Mobile DevOps & Automated Android CI Pipelines

## 1. Web DevOps vs Mobile DevOps (The Core Differences)

| Feature | Web DevOps | Mobile DevOps (React Native) |
|---|---|---|
| **Target Output** | Docker Image (`sindhhunar-web`) | Binary File (`.apk` / `.aab`) |
| **Runtime** | Node.js / Linux Server | Android OS (Dalvik / ART) / iOS |
| **Delivery** | Server par live deploy hota hai | User phone par download / install karta hai |
| **Build Tools** | Docker, Nginx, npm | Java (JDK 17), Gradle, Android SDK |

---

## 2. Manual Mobile Build ki Mushkilat
* **Laptop Freezing:** Android APK local machine par compile karne se 10-15 GB RAM consume hoti hai aur laptop garam/hang ho jata hai.
* **Dependencies Mess:** Har developer ke computer par Android SDK, NDK, aur Java versions alag hote hain jis se "build failed" ke errors aate hain.
* **APK Sharing Chaos:** QA testers ya clients ko test APK bhejne ke liye bar bar laptop par build bana kar WhatsApp/Drive par upload karna parta hai.

---

## 3. The Mobile DevOps Solution (Automated Cloud Builds)
Humne `.github/workflows/mobile-ci.yml` pipeline banayi hai:
1. **GitHub Ubuntu Cloud Runner:** GitHub ki machine par background mein build hoti hai (aapka laptop bilkul free rehta hai!).
2. **JDK 17 & Gradle Caching:** Gradle dependencies ko cloud par cache karta hai taake bar bar heavy libraries download na karni parein.
3. **`./gradlew assembleDebug`:** Clean APK compile karta hai.
4. **Artifact Uploading:** Ready `.apk` file ko GitHub par **Downloadable Artifact** ke tor par upload kar deta hai jahan se koi bhi tester ya client direct phone mein download kar sakta hai!

---

## 4. Path Filtering in Monorepos
* **Web Pipeline:** Sirf `web/**` changes par chalti hai.
* **Mobile Pipeline:** Sirf `mobile/**` changes par chalti hai.
* **Faida:** Agar sirf website ka code change ho to mobile pipeline trigger nahi hogi aur free GitHub cloud minutes bachenge.
