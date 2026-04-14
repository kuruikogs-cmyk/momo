# 🚀 Quick Start Guide - Momo Loans

Get your Momo Loans website running in **less than 2 minutes**!

## Step 1: Start Your Website (30 seconds)

### Option A: Using Python (Easiest)
```bash
cd /home/kurui/Desktop/momo
python3 server.py
```

### Option B: Using Node.js
```bash
cd /home/kurui/Desktop/momo
npm install -g http-server
http-server
```

### Option C: Direct Browser Open
Simply double-click `index.html` in your file explorer

---

## Step 2: Open in Browser (30 seconds)

If you used Python/Node option:
- Open your browser
- Go to: **http://localhost:8000**

---

## Step 3: Test the Website (30 seconds)

1. **Scroll through the page** to see:
   - Hero section with call-to-action
   - Three loan products (Personal, Business, Emergency)
   - How the process works
   - Full application form

2. **Test the Loan Calculator**:
   - Select "Personal Loan"
   - Enter: 100,000 USH
   - Enter repayment: 3 months
   - Watch the summary update automatically!

3. **Try the Form Validation**:
   - Leave a field empty and try submitting
   - Enter an invalid phone number
   - See helpful error messages

---

## Step 4: Connect to Telegram Bot (Optional - 5 minutes)

### 4a: Create Your Bot
1. Open Telegram and message **@BotFather**
2. Send: `/newbot`
3. Follow the prompts to create your bot
4. **Save your bot token** (looks like: `123456789:ABCdefGHI...`)

### 4b: Get Your Chat ID
1. Message your new bot on Telegram
2. Go to: `https://api.telegram.org/bot{YOUR_TOKEN}/getUpdates`
   - Replace `{YOUR_TOKEN}` with your actual token
3. Look for `"id": 987654321` - that's your **Chat ID**

### 4c: Update the Website
1. Open `assets/js/script.js` in a text editor
2. Find the `submitApplicationData` function (around line 245)
3. Replace:
   ```javascript
   const telegramBotToken = 'YOUR_BOT_TOKEN_HERE';
   const chatId = 'YOUR_CHAT_ID_HERE';
   ```
   With your actual values:
   ```javascript
   const telegramBotToken = '123456789:ABCdefGHIjklMNOpqRSTuvWXYZabcdefGH';
   const chatId = '987654321';
   ```

4. Find and uncomment the `fetch` code (remove `/*` and `*/`):
   ```javascript
   // Remove these: /*
   fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
       ...
   });
   // Remove these: */
   ```

5. Save the file and refresh your browser (Ctrl+F5)

### 4d: Test the Integration
1. Fill out a test loan application
2. Click "Submit Application"
3. Check your Telegram bot - you should see the application data!

---

## Quick Reference

### File Locations
```
momo/
├── index.html              ← Main website
├── assets/
│   ├── css/style.css       ← Styling (Orange/MTN theme)
│   └── js/script.js        ← Form logic & calculator
├── README.md               ← Full documentation
├── TELEGRAM_SETUP.md       ← Detailed Telegram setup
├── QUICK_START.md          ← This file
└── sample-data.json        ← Sample application data
```

### Key Features
✅ **Loan Amount Range** - Based on loan type (personal, business, emergency)  
✅ **Interest Calculator** - Real-time calculation as you type  
✅ **Phone Validation** - Accepts Uganda phone formats  
✅ **Age Verification** - Must be 18+ years old  
✅ **Debt Protection** - Loan can't exceed 3x monthly income  
✅ **Mobile Responsive** - Works on phones, tablets, computers  
✅ **All Prices in USH** - Ugandan Shillings throughout  

### Loan Products

| Loan Type | Min Amount | Max Amount | Interest/Month |
|-----------|-----------|-----------|----------------|
| Personal | USH 1 | USH 1,000,000 | 22.5% |
| Business | USH 1 | USH 1,000,000 | 23% |
| Emergency | USH 1 | USH 1,000,000 | 25% |

---

## Example Loan Calculation

**You Apply For:**
- Loan Type: Personal
- Amount: **USH 200,000**
- Repayment Period: **3 months**
- Interest Rate: **22.5% per month**

**System Calculates:**
- Monthly Interest: 200,000 × 22.5% = **USH 45,000**
- Total Interest (3 months): 45,000 × 3 = **USH 135,000**
- **Total to Repay: USH 335,000**

---

## Common Issues & Solutions

### ❓ Website won't load
- Make sure you're in the correct directory: `/home/kurui/Desktop/momo`
- Try refreshing the page: `Ctrl+F5` (hard refresh)
- Check if server is running (you should see messages in terminal)

### ❓ Form won't submit
- Open browser console: Press `F12`
- Check for red error messages
- Fill all required fields (marked with *)
- Reload page and try again

### ❓ Telegram integration not working
- Double-check your Bot Token (no spaces!)
- Double-check your Chat ID (no @ symbol!)
- Make sure you've uncommented the fetch code
- Refresh the page: `Ctrl+F5`
- Check browser console for detailed error messages

### ❓ Page styling looks broken
- This usually means CSS file didn't load
- Hard refresh: `Ctrl+F5`
- Check browser console for 404 errors

### ❓ Where do submitted applications go?
- While testing: Saved to browser's local storage
- With Telegram bot configured: Sent to your Telegram chat
- Check browser console for confirmation messages

---

## Customization Ideas

### Change Colors
Edit `assets/css/style.css`, look for:
```css
:root {
    --primary-color: #FFA500;      /* Orange - change this! */
    --secondary-color: #1a1a1a;
    --accent-color: #00AA44;
}
```

### Change Interest Rates
Edit `assets/js/script.js`, find `const loanRanges`:
```javascript
const loanRanges = {
    personal: { min: 50000, max: 500000, interestRate: 22.5 },  // Change 22.5
    business: { min: 500000, max: 5000000, interestRate: 23 },  // Change 23
    emergency: { min: 20000, max: 200000, interestRate: 25 }    // Change 25
};
```

### Change Company Name
1. Search for "Momo Loans" in `index.html`
2. Replace with your company name
3. Also update footer contact info

### Add More Loan Products
1. Add to `loanRanges` object in `script.js`
2. Add new option in loan type `<select>` in `index.html`
3. Add service card in "Our Loan Products" section

---

## What's Included

### HTML (`index.html`)
- Hero section
- Services/Products overview
- How it works (4-step process)
- Complete loan application form
- Success confirmation screen
- Footer

### CSS (`assets/css/style.css`)
- Professional MTN-inspired design
- Orange and dark gray color scheme
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Custom form styling
- Button and input states

### JavaScript (`assets/js/script.js`)
- Form validation with error messages
- Real-time loan calculator
- Phone number formatting
- Age verification (18+)
- Debt-to-income ratio checking
- Telegram bot integration ready
- Local storage backup

---

## Next Steps

1. ✅ **Get it running** - Use server.py or open index.html
2. ✅ **Test the form** - Fill it out and verify validation
3. ✅ **Set up Telegram** - Follow TELEGRAM_SETUP.md for bot integration
4. ✅ **Customize** - Change colors, interest rates, company name
5. ✅ **Deploy** - Upload to web hosting (Netlify, Vercel, GitHub Pages)

---

## Support

- **Full Documentation**: Read `README.md`
- **Telegram Setup**: Read `TELEGRAM_SETUP.md`
- **Sample Data**: Check `sample-data.json`
- **Browser Console**: Press `F12` for debug messages

---

## Browser Compatibility

Works perfectly in:
- Chrome / Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

---

**Ready to go? Start with Step 1 above! 🚀**

Any questions? Check the full README.md or TELEGRAM_SETUP.md for detailed information.
