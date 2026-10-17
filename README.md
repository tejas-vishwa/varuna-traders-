# Varuna Traders - Smart Review & Google Maps Rating Website

A high-converting, mobile-friendly review portal designed specifically for **Varuna Traders** (Household & Kitchenware Store). It empowers the shop owner to collect 5-star Google reviews while catching negative feedback privately.

---

## 🌟 Key Features

1. **Smart Review Routing (Review Gating)**:
   - ⭐⭐⭐⭐⭐ **5-Star Rating**: Triggers the **Built-in AI Review Generator**, auto-copies an SEO-rich review to the customer's clipboard, and launches your **Google Maps Review Page**.
   - ⭐–⭐⭐⭐⭐ **1 to 4 Stars**: Intercepts negative feedback before it hits Google. Politely routes the complaint straight to the **Owner's Personal WhatsApp** so you can resolve the issue directly.

2. **Built-in AI SEO Review Assistant**:
   - Generates authentic, natural-sounding, organic reviews packed with local SEO keywords (e.g., *"Varuna Traders"*, *"owner personally helped"*, *"quality kitchenware"*, *"wholesale price"*, *"durable utensils"*).
   - Generates unique variations each time to prevent duplicate review penalties on Google.
   - Allows customers to tap aspect pills (e.g. *Owner Guided Me*, *Fair Price*, *Kitchenware Quality*) or type an item they bought.
   - Works **100% offline with zero dependencies**, or optionally with a free Google Gemini API key if desired.

3. **Auto-Copy & Direct Google Launch**:
   - With a single click, copies the AI review text directly to the customer's phone clipboard and opens your Google Maps review dialog.
   - All the customer does is **Paste** and tap **Post**!

4. **Shop Counter Standee & QR Code**:
   - Includes a built-in **Counter QR Standee Modal**.
   - Click the QR icon in the header to display the QR code on a counter tablet or click **Print** to create a physical QR standee for your billing counter.

5. **In-App Owner Settings Panel (No Coding Required)**:
   - Click the ⚙️ gear icon in the top right to customize:
     - **Store Name** (default: *Varuna Traders*)
     - **Owner WhatsApp Number** (with country code, e.g., `919876543210`)
     - **Google Maps Review Link**
     - **Store Phone & Address**
     - Changes are saved immediately in your browser's local storage.

---

## 🚀 How to Run & Deploy

### Quick Start (Local)
1. Double-click `index.html` in your file explorer to open it directly in any web browser (Chrome, Edge, Safari, Firefox).
2. Everything is self-contained with zero server or build step required.

### Free Hosting Options (for Customer Phones)
To let customers scan the QR code from their own mobile phones:
- **Option 1: GitHub Pages (Free)**
  1. Create a repository on GitHub (e.g., `varuna-traders-reviews`).
  2. Upload `index.html`, `styles.css`, `app.js`, `reviews-engine.js`, and `qr-code-styling.js`.
  3. Go to **Settings > Pages** and select **Deploy from branch: main**.
  4. Your site will be live at `https://<your-username>.github.io/varuna-traders-reviews/`.

- **Option 2: Netlify or Vercel (Free)**
  - Simply drag and drop the `varuna traders` folder into [Netlify Drop](https://app.netlify.com/drop).

---

## 📍 How to Get Your Exact Google Maps Review Link

1. Go to [Google Business Profile](https://business.google.com/).
2. Select your store (**Varuna Traders**).
3. Click **"Ask for reviews"** or **"Get more reviews"**.
4. Copy the short link (e.g., `https://g.page/r/.../review`).
5. Open this website, tap the ⚙️ **Settings** gear icon in the top right, and paste your link into the **Google Maps Review Link** field.
6. Click **Save Settings**. Done!

---

## 📱 File Structure

```
d:/varuna traders/
├── index.html            # Main customer review webpage & modals
├── styles.css            # Responsive, modern styling (emerald & gold)
├── app.js                # Core controller, star routing, clipboard & WhatsApp
├── reviews-engine.js     # AI SEO review generator and natural phrasing engine
├── qr-code-styling.js    # Standalone zero-dependency QR code generator
└── README.md             # Documentation and usage guide
```
