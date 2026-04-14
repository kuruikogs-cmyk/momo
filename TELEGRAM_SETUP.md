# Momo Loans - Configuration Guide
# This file helps you set up the Telegram bot integration

## Telegram Bot Setup Instructions

### 1. Create Your Telegram Bot

#### Step 1a: Open Telegram
- Search for **@BotFather** in Telegram
- Click on **BotFather** (verified with blue checkmark)

#### Step 1b: Create New Bot
- Send: `/start`
- Send: `/newbot`
- Choose a name for your bot (e.g., **Momo Loans Bot**)
- Choose a username (must end with "bot", e.g., **momo_loans_ug_bot**)

#### Step 1c: Save Your Bot Token
BotFather will give you a token that looks like:
```
123456789:ABCdefGHIjklMNOpqRSTuvWXYZabcdefGH
```
**SAVE THIS TOKEN SECURELY!**

### 2. Get Your Chat ID

#### Option A: Using getUpdates API (Recommended)
1. Open your browser and go to:
```
https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates
```
Replace `{8578797610:AAGXTt2oa6MaXTo2khM3LR0StAejU7ZCNdY}` with your actual token (no curly braces)

2. It should show: `{"ok":true,"result":[]}`

3. Open Telegram and:
   - Start a chat with your bot (click START if you see the bot in results)
   - Send any message to your bot
   - Refresh the browser page with the getUpdates link

4. You'll now see something like:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "message_id": 1,
        "from": {
          "id": 987654321,  <-- This is your CHAT_ID
          "is_bot": false,
          "first_name": "Your Name"
        }
      }
    }
  ]
}
```

Copy the `"id"` value from the `"from"` object (e.g., `987654321`)

#### Option B: Using a Bot
1. Search for **@userinfobot** in Telegram
2. Send it any message
3. It will reply with your user ID

### 3. Update the JavaScript Configuration

Edit `assets/js/script.js` and find the `submitApplicationData` function (around line 245).

Replace:
```javascript
const telegramBotToken = '8578797610:AAGXTt2oa6MaXTo2khM3LR0StAejU7ZCNdY';
const chatId = '6816093099';
```

With your actual values:
```javascript
const telegramBotToken = '8578797610:AAGXTt2oa6MaXTo2khM3LR0StAejU7ZCNdY';
const chatId = '6816093099';
```

### 4. Enable the Integration

Find the commented-out `fetch` code in the `submitApplicationData` function and uncomment it:

**Before (commented out):**
```javascript
/*
fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    ...
});
*/
```

**After (uncommented):**
```javascript
fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    ...
});
```

### 5. Test Your Integration

1. Open the website in your browser
2. Fill out the loan application form completely
3. Click "Submit Application"
4. Check your Telegram bot for the formatted message

## Telegram Bot Commands Setup (Optional)

To make your bot more user-friendly, you can set up commands in BotFather:

1. Open Telegram and go to **@BotFather**
2. Send: `/setcommands`
3. Select your bot
4. Send these commands:
```
start - Welcome to Momo Loans
apply - Start new loan application
status - Check application status
help - Get help and FAQs
contact - Contact customer support
```

## Receiving Messages in Your Chat

You have two options:

### Option 1: Personal Chat (Simple)
- Get your personal user ID
- Use that as the `chatId`
- Receives all applications to your personal chat

### Option 2: Group/Channel (Recommended for Teams)
- Create a group or channel
- Add your bot to the group
- Send a message to the group
- Get the chat ID using getUpdates
- Use that as the `chatId`
- The group is your dedicated Momo Loans inbox

## Sample Configuration After Setup

Your updated `assets/js/script.js` section should look like:

```javascript
function submitApplicationData(formData) {
    // Bot credentials - REPLACE WITH YOUR ACTUAL VALUES
    const telegramBotToken = '8578797610:AAGXTt2oa6MaXTo2khM3LR0StAejU7ZCNdY';
    const chatId = '6816093099';
    
    console.log('Application Data:', formData);
    const message = formatTelegramMessage(formData);
    
    // Send to Telegram
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Message sent to Telegram:', data);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
    
    // Also store locally for backup
    localStorage.setItem('momo_application_' + Date.now(), JSON.stringify(formData));
}
```

## Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS:**

1. **Protect Your Bot Token**
   - Never share your bot token publicly
   - Never commit it to public GitHub repositories
   - Treat it like a password

2. **For Production Deployment**
   - Use environment variables instead of hardcoding the token
   - Store the token on your backend server
   - Use your backend to forward requests to Telegram
   - Never expose the token in client-side JavaScript

3. **Backend Proxy (Recommended for Security)**
   Instead of calling Telegram API from frontend, create a backend route:

   **Backend (Node.js example):**
   ```javascript
   app.post('/api/submit-loan', (req, res) => {
       const formData = req.body;
       const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
       const chatId = process.env.TELEGRAM_CHAT_ID;
       
       const message = formatTelegramMessage(formData);
       
       fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({
               chat_id: chatId,
               text: message,
               parse_mode: 'HTML'
           })
       })
       .then(() => res.json({success: true}))
       .catch(err => res.status(500).json({error: err.message}));
   });
   ```

   **Frontend:**
   ```javascript
   fetch('/api/submit-loan', {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(formData)
   })
   ```

## Troubleshooting Telegram Integration

### Message not arriving?

**Issue**: "Message not sent"
- **Solution**: Verify bot token is correct (copy from BotFather again)
- **Solution**: Verify chat ID is correct (use getUpdates to confirm)

**Issue**: CORS error in console
- **Solution**: This is normal - Telegram API blocks direct browser requests
- **Solution**: Use a backend proxy server instead (see Security section above)
- **Solution**: Or the message will still be sent (check Telegram anyway)

**Issue**: Bot responds but application form shows error
- **Solution**: Check browser console (F12) for detailed error
- **Solution**: Verify internet connection is working
- **Solution**: Verify Telegram API is not rate-limited

### Bot Status

To check if your bot is working, send a test message:
1. Open Telegram on your bot
2. Type: `/start`
3. Send a message
4. Go to: `https://api.telegram.org/bot{TOKEN}/getUpdates`
5. You should see your messages in the result

## Performance Tips

1. **Rate Limiting**: Telegram allows ~30 messages/second per bot
2. **Batch Processing**: For high volume, batch multiple applications
3. **Fallback Storage**: Always save to localStorage as backup
4. **Error Handling**: Check console logs if messages fail

## Next Steps

1. ✅ Create bot with @BotFather
2. ✅ Get your bot token and chat ID
3. ✅ Update assets/js/script.js with your credentials
4. ✅ Uncomment the fetch code
5. ✅ Test the form by submitting an application
6. ✅ Verify message arrives in Telegram
7. ✅ Deploy to production with security measures

## Support

If you need help:
- Check Telegram API docs: https://core.telegram.org/bots/api
- Review browser console errors (F12 Developer Tools)
- Verify all credentials are correct
- Check that bot is active and not deleted

---

**Good luck with Momo Loans! 🚀**
