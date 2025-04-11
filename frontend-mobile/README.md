Syncra
Syncra is an independent, self-contained mobile application designed to serve as an online portfolio and professional networking platform—similar to LinkedIn and JobStreet. It enables users to showcase their skills and experiences, interact via a news feed, and connect with others professionally. The app integrates with third-party tools (like Imgur for image uploads) while functioning independently.

✨ Features
📱 Kotlin Android App with Fragment-based architecture

🔐 User Registration and Login

👤 View and Edit Profiles

📝 Post to News Feed (Text + Image via Imgur)

🔍 Reusable Search Bar (Facebook-style)

🔎 Search and View Other Users

📦 RESTful API integration with Spring Boot backend

🚫 Admin Controls (Ban/Delete Users)

💬 (Planned) Messaging via WebSocket

🏢 Company Account Support (Job Posting - Coming Soon)

🛠️ Tech Stack
Android (Frontend)
Kotlin + XML

Jetpack Components (Fragments, ViewModel, LiveData)

Retrofit2 (API calls)

Coil (Image loading)

Imgur API (Image uploads)

Dhaval2404 ImagePicker

SharedPreferences (Session management)

Backend (Spring Boot)
Java 17+

Spring Boot

Spring Web / Data JPA / Security

H2 (In-Memory DB for Dev)

Lombok

Jackson

🚀 Installation
Android App
bash
Copy
Edit
git clone https://github.com/Mayuushi/IT342-Syncra.git
Open the project in Android Studio. Make sure you have:

Kotlin SDK configured

Android SDK 33+

Internet permission in AndroidManifest.xml

Then build and run the app on your emulator or physical device.

Backend (Spring Boot)
Open syncra-backend in IntelliJ IDEA or any Java IDE.

Make sure JDK 17+ is installed.

Run the SyncraApplication.java class.

Backend will be available at:


Copy
Edit
http://localhost:8080/api/
