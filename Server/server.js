// // server.js
// // require('dotenv').config(); // Uncomment if you have a .env file
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const helmet = require('helmet'); // 1. Import helmet

// const app = express();
// const PORT = process.env.PORT || 3000;
// const PIPEDREAM_URL = process.env.PIPEDREAM_URL || "https://eodglzrh758vzyc.m.pipedream.net";

// // --- Middleware ---
// app.use(cors());
// app.set('trust proxy', true);

// // 2. Use helmet to set security headers
// // We configure a custom Content Security Policy here
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:"],
//       // Add other directives here if needed
//     },
//   })
// );


// // --- Routes ---
// app.get('/view-image/:filename', async (req, res) => {
//   const { filename } = req.params;
//   const ip = req.ip;
//   const headers = req.headers;

//   console.log(`Image requested: ${filename} from IP: ${ip}`);

//   axios.post(PIPEDREAM_URL, {
//     type: 'Image Access',
//     filename,
//     ip,
//     userAgent: headers['user-agent'],
//     timestamp: new Date().toISOString(),
//   }).catch(error => {
//     console.error('Failed to send data to Pipedream:', error.message);
//   });

//   const imagePath = path.join(__dirname, 'public', 'images', filename);
//   if (fs.existsSync(imagePath)) {
//     res.sendFile(imagePath);
//   } else {
//     res.status(404).send('Image not found.');
//   }
// });

// // --- Server Start ---
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });






// server.js
// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const fs = require('fs');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const PIPEDREAM_URL = "https://eodglzrh758vzyc.m.pipedream.net" ;

// // --- Middleware ---
// app.use(express.json());
// app.use(helmet());
// app.set('trust proxy', true); // For accurate IP behind proxies

// // Rate limiting (100 requests per 15 minutes per IP)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   handler: (req, res) => res.status(429).json({ error: "Too many requests." }),
// });
// app.use('/track-click', limiter);

// // --- Routes ---

// // Silent click tracking endpoint
// app.get('/track-click', async (req, res) => {
//   const { filename } = req.query;
//   const ip = req.ip;
//   const userAgent = req.headers['user-agent'];
//   const referrer = req.headers['referer'] || 'direct';

//   // Validate filename (prevent path traversal)
//   // if (!filename || !/^[a-zA-Z0-9_\-\.]+\.(png|jpg|jpeg|gif)$/.test(filename)) {
//   //   return res.status(400).json({ error: "Invalid filename format." });
//   // }

//   // Data payload for Pipedream
//   const payload = {
//     type: 'Image Click',
//     filename,
//     ip,
//     userAgent,
//     referrer,
//     timestamp: new Date().toISOString(),
//     metadata: {
//       protocol: req.protocol,
//       host: req.headers.host,
//     },
//   };

//   // Send to Pipedream with error handling
//   try {
//     await axios.post(PIPEDREAM_URL, payload, {
//       headers: { 'Content-Type': 'application/json' },
//       timeout: 5000, // 5-second timeout
//     });
//     console.log(`Logged click: ${filename} from ${ip}`);
//   } catch (error) {
//     console.error('Pipedream error:', error.message);
//     // Fallback: Log to local file if Pipedream fails
//     fs.appendFileSync('click_fallback.log', JSON.stringify(payload) + '\n');
//   }

//   // Respond with 204 No Content to prevent browser interaction
//   res.status(204).end();
// });

// // Serve images (frontend calls this)
// app.get('/view-image/:filename', (req, res) => {
//   const { filename } = req.params;
//   const imagePath = path.join(__dirname, 'public', 'images', filename);

//   if (fs.existsSync(imagePath)) {
//     res.sendFile(imagePath);
//   } else {
//     res.status(404).json({ error: "Image not found." });
//   }
// });

// // --- Start Server ---
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });







// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const fs = require('fs');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const PIPEDREAM_URL = process.env.PIPEDREAM_URL || "https://eodglzrh758vzyc.m.pipedream.net";

// // --- Middleware ---
// app.use(express.json());
// app.use(helmet());

// // Disable 'trust proxy' if not behind a reverse proxy (e.g., Nginx, Cloudflare)
// // If behind a proxy, set it to the number of hops (e.g., `1` for a single proxy)
// app.set('trust proxy', false);

// // Rate limiting (100 requests per 15 minutes per IP)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   handler: (req, res) => res.status(429).json({ error: "Too many requests." }),
//   keyGenerator: (req) => req.ip, // Use the built-in IP key generator for IPv6 compatibility
// });
// app.use('/track-click', limiter);

// // --- Routes ---
// app.get('/track-click', async (req, res) => {
//   const { filename } = req.query;
//   const ip = req.ip;
//   const userAgent = req.headers['user-agent'];
//   const referrer = req.headers['referer'] || 'direct';

//   // Validate filename
//   // if (!filename || !/^[a-zA-Z0-9_\-\.]+\.(png|jpg|jpeg|gif)$/.test(filename)) {
//   //   return res.status(400).json({ error: "Invalid filename format." });
//   // }

//   // Data payload for Pipedream
//   const payload = {
//     type: 'Image Click',
//     filename,
//     ip,
//     userAgent,
//     referrer,
//     timestamp: new Date().toISOString(),
//   };

//   try {
//     await axios.post(PIPEDREAM_URL, payload, {
//       headers: { 'Content-Type': 'application/json' },
//       timeout: 5000,
//     });
//     console.log(`Logged click: ${filename} from ${ip}`);
//   } catch (error) {
//     console.error('Pipedream error:', error.message);
//     fs.appendFileSync('click_fallback.log', JSON.stringify(payload) + '\n');
//   }

//   res.status(204).end();
// });

// // Serve images
// app.get('/view-image/:filename', (req, res) => {
//   const { filename } = req.params;
//   const imagePath = path.join(__dirname, 'public', 'images', filename);

//   if (fs.existsSync(imagePath)) {
//     res.sendFile(imagePath);
//   } else {
//     res.status(404).json({ error: "Image not found." });
//   }
// });

// app.get('/download-image/:filename', (req, res) => {
//     const { filename } = req.params;
//     const imagePath = path.join(__dirname, 'public', 'images', filename);

//     if (fs.existsSync(imagePath)) {
//         // Set the Content-Disposition header to trigger a download
//         res.download(imagePath, filename, (err) => {
//             if (err) {
//                 console.error("Download error:", err);
//                 res.status(500).send("Could not download the file.");
//             }
//         });
//     } else {
//         res.status(404).json({ error: "Image not found." });
//     }
// });

// // --- Start Server ---
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });










// server.js
// require('dotenv').config(); // Uncomment if you have a .env file
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const helmet = require('helmet'); // 1. Import helmet

// const app = express();
// const PORT = process.env.PORT || 3000;
// const PIPEDREAM_URL = process.env.PIPEDREAM_URL || "https://eodglzrh758vzyc.m.pipedream.net";

// // --- Middleware ---
// app.use(cors({ origin: "*" }));
// app.set('trust proxy', true);

// // 2. Use helmet to set security headers
// // We configure a custom Content Security Policy here
// app.use(
//   helmet({
//     contentSecurityPolicy: false, // Disable CSP for testing
//   })
// );

// app.get("/dns-leak", (req, res) => {
//   const { data } = req.query; // Data leaked via subdomain
//   console.log("DNS Leak:", data);
//   res.status(200).send("OK");
// });

// // --- Routes ---
// app.get('/view-image/:filename', async (req, res) => {
//   const { filename } = req.params;
//   const ip = req.ip;
//   const headers = req.headers;

//   console.log(`Image requested: ${filename} from IP: ${ip}`);

//   axios.post(PIPEDREAM_URL, {
//     type: 'Image Access',
//     filename,
//     ip,
//     userAgent: headers['user-agent'],
//     timestamp: new Date().toISOString(),
//   }).catch(error => {
//     console.error('Failed to send data to Pipedream:', error.message);
//   });

//   const imagePath = path.join(__dirname, 'public', 'images', filename);
//   if (fs.existsSync(imagePath)) {
//     res.sendFile(imagePath);
//   } else {
//     res.status(404).send('Image not found.');
//   }
// });

// // --- Server Start ---
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });










// server.js
// require('dotenv').config(); // Uncomment if you have a .env file
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const PIPEDREAM_URL = process.env.PIPEDREAM_URL || "https://eodglzrh758vzyc.m.pipedream.net";

// --- Middleware ---
app.use(cors());
app.set('trust proxy', true);

// Use helmet to set security headers with a more secure CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000"], // Explicitly allow images from localhost
      // Add other directives here if needed
    },
  })
);


// --- Routes ---
app.get('/view-image/:filename', async (req, res) => {
    const { filename } = req.params;
    const ip = req.ip;
    const headers = req.headers;

    // --- CRITICAL FIX: Sanitize the filename to prevent path traversal ---
    const safeFilename = path.basename(filename);
    const imagePath = path.join(__dirname, 'public', 'images', safeFilename);

    // --- ADDED: Set headers to ensure 200 status code on every request ---
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    // --------------------------------------------------------------------

    console.log(`Image requested: ${safeFilename} from IP: ${ip}`);

    // Post data to Pipedream
    axios.post(PIPEDREAM_URL, {
        type: 'Image Access',
        filename: safeFilename,
        ip,
        userAgent: headers['user-agent'],
        timestamp: new Date().toISOString(),
    }).catch(error => {
        console.error('Failed to send data to Pipedream:', error.message);
    });

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found.');
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});