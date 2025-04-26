✨ Features
Upload a video

Trim a video between start and end times

Add subtitles to the video

Render and save the final edited video

Download the rendered video

Safe handling of original and processed files

🛠 Tech Stack
Node.js

Express.js

Sequelize ORM (with PostgreSQL/MySQL)

FFmpeg (video processing)

Multer (file uploads)

Cloudflare / Hosting platform for deployment


🚀 API Endpoints
1. Upload Video
POST /api/videos/upload

Uploads a video file.

Saves file to /uploads/.

Stores video metadata in the database.

2. Trim Video
POST /api/videos/:id/trim

Trims the video between specified start and end times.

3. Add Subtitles
POST /api/videos/:id/subtitle

Adds a subtitle text between specified time range.

4. Render Final Video
POST /api/videos/:id/render

Copies the latest processed video to the /rendered/ folder.

Marks the video as rendered in the database.

5. Download Final Video
GET /api/videos/:id/download

Sends the final rendered video file for user download.


🧩 Challenges and Creative Decisions
Managing multiple versions of video files without overwriting was crucial. To solve this, I separated files into /uploads, /processed, and /rendered folders.

Heavy video processing operations like trimming and adding subtitles are handled efficiently using FFmpeg.

To maintain robustness, proper error handling and input validations are implemented at every stage.

All operations are asynchronous to ensure non-blocking behavior of the Node.js server.

✨ Future Improvements
Add support for multiple subtitles at once.

Allow exporting videos in different formats (e.g., .avi, .mov).

Integrate cloud storage (AWS S3, Google Cloud Storage) for uploaded and processed files.

Add basic authentication for API endpoints.

