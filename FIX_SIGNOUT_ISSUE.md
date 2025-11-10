# 🔧 Fix Sign Out Issue

## ⚠️ Vấn đề

Click vào avatar hoặc click Sign Out không hoạt động.

Có thể do:
1. JSON parse error trong localStorage
2. Event handler bị block
3. JavaScript error

---

## ✅ Giải Pháp (Thử từng bước)

### Solution 1: Clear localStorage (Quan trọng nhất!)

**Mở Console (F12) và chạy:**

```javascript
// Clear all localStorage
localStorage.clear();

// Reload page
location.reload();
```

**Sau đó test lại:**
1. Click avatar → Dropdown nên mở
2. Click "Sign Out" → Page nên reload

---

### Solution 2: Check Console Errors

**Mở Console (F12) và check:**

**Nếu thấy:**
```
SyntaxError: Unexpected end of JSON input
```

**Chạy:**
```javascript
// Fix JSON parse error
localStorage.removeItem('taskflow_notified_reminders');
localStorage.removeItem('taskflow_tasks');
localStorage.removeItem('taskflow_projects');
location.reload();
```

---

### Solution 3: Check Click Events

**Mở Console (F12) và test:**

**1. Test dropdown:**
```javascript
// Bạn sẽ thấy log khi click avatar:
🔍 Avatar clicked! Current isOpen: false
🔍 New isOpen will be: true
```

**2. Test sign out:**
```javascript
// Bạn sẽ thấy log khi click Sign Out:
🚪 Sign out button clicked!
🚪 Sign out result: true
🚪 Reloading page...
```

**Nếu KHÔNG thấy logs → JavaScript error, check console**

---

### Solution 4: Hard Refresh

**Nhấn:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Hoặc:**
1. Ctrl + F5 (Windows)
2. Clear cache: Ctrl + Shift + Delete

---

### Solution 5: Verify Code Compiled

**Check terminal output:**

Nên thấy:
```
✓ Compiled /[locale]/taskflow/components/UserProfile.tsx
```

Nếu có errors → Fix và restart server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🧪 Debug Steps

### Step 1: Check if dropdown opens

**Test:**
1. Click avatar
2. Dropdown nên mở

**If NOT opening:**

```javascript
// Check in console:
document.querySelector('[class*="UserProfile"]')
// Should return element
```

---

### Step 2: Check if Sign Out button exists

**Open dropdown, then check console:**

```javascript
// Find Sign Out button
document.querySelector('button:has(.lucide-log-out)')
// or
document.querySelectorAll('button').forEach(btn => {
  if (btn.textContent.includes('Sign Out')) {
    console.log('Found Sign Out button:', btn);
  }
});
```

---

### Step 3: Test Sign Out manually

**In console:**

```javascript
// Import and call signOutUser
const { signOutUser } = await import('./app/[locale]/taskflow/lib/auth');
await signOutUser();
location.reload();
```

---

## 🎯 Expected Behavior

### When clicking avatar:

**Console:**
```
🔍 Avatar clicked! Current isOpen: false
🔍 New isOpen will be: true
```

**UI:**
```
Dropdown mở ra với:
- User info
- Sign In with Email (nếu anonymous)
- Sign Out button
```

---

### When clicking Sign Out:

**Console:**
```
🚪 Sign out button clicked!
🚪 Sign out result: true
🚪 Reloading page...
✅ User signed out successfully
```

**UI:**
```
1. Button text: "Signing out..."
2. Page reloads
3. New anonymous user created
4. Avatar changes to new initials
```

---

## 📋 Complete Test Procedure

### 1. Clear Everything

```javascript
// In Console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Wait for page load

Check console for:
```
✅ User signed in anonymously: abc123xyz
```

### 3. Test Avatar Click

Click avatar → Dropdown should open

### 4. Test Sign Out Click

Click "Sign Out" → Page should reload

### 5. Verify New User

- Avatar has different initials
- New user ID in console

---

## 🔍 Common Issues

### Issue 1: Dropdown doesn't open

**Cause:** JavaScript error or component not rendered

**Fix:**
```javascript
localStorage.clear();
location.reload();
```

### Issue 2: Click Sign Out, nothing happens

**Check console for errors:**

**If see:**
```
❌ Sign out failed: Error...
```

**Fix:**
```javascript
// Force sign out and reload
localStorage.clear();
location.reload();
```

### Issue 3: "Firebase Auth not available"

**Cause:** Firebase not initialized

**Fix:**
1. Check `.env.local` has Firebase config
2. Restart dev server:
   ```bash
   npm run dev
   ```

### Issue 4: Page reload but same user

**Cause:** Sign out didn't complete

**Fix:**
```javascript
// Manual cleanup
localStorage.removeItem('taskflow_user');
location.reload();
```

---

## ⚡ Quick Fix (If nothing works)

**Nuclear option - Reset everything:**

```javascript
// In Console (F12)
// Clear all data
localStorage.clear();
sessionStorage.clear();

// Clear all cookies
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// Hard reload
location.reload(true);
```

---

## 📸 Visual Check

### Before Click (Avatar):
```
┌──────────────────┐
│ [UA] User abc123 │ ← Click here
│      Anonymous   │
└──────────────────┘
```

### After Click (Dropdown Open):
```
┌─────────────────────────────────────┐
│  [UA]  User abc123                  │
│        Anonymous User               │
├─────────────────────────────────────┤
│  📧 Sign In with Email             │
│  🚪 Sign Out                        │ ← Click here
└─────────────────────────────────────┘
```

### After Sign Out (Reloaded):
```
┌──────────────────┐
│ [AB] User xyz789 │ ← Different user!
│      Anonymous   │
└──────────────────┘
```

---

## ✅ Success Checklist

Test each item:

- [ ] Avatar exists at sidebar bottom
- [ ] Click avatar → Dropdown opens
- [ ] See "Sign Out" button in dropdown
- [ ] Click "Sign Out" → Console log appears
- [ ] Page reloads after 1-2 seconds
- [ ] New anonymous user created
- [ ] Avatar shows different initials
- [ ] Console shows: "✅ User signed out successfully"
- [ ] Console shows: "✅ User signed in anonymously: [newID]"

---

## 🎯 Next Steps

After fix:

1. ✅ Clear localStorage
2. ✅ Reload page
3. ✅ Test avatar click
4. ✅ Test sign out
5. ✅ Test sign in with email

If still not working → Share console errors with me!

---

## 💡 Pro Tips

**Always check Console (F12) for:**
- Red errors
- Warning messages
- Log messages from the app

**Common logs to look for:**
```
🔍 Avatar clicked!
🚪 Sign out button clicked!
✅ User signed out successfully
✅ User signed in anonymously
```

**If you don't see these logs → Event handler not working**

---

## 🆘 Still Not Working?

Share these details:

1. **Console errors** (all red errors)
2. **Console logs** when clicking avatar
3. **Console logs** when clicking Sign Out
4. **Browser** (Chrome, Firefox, Safari?)
5. **Any visible errors** on the page

I'll help debug! 🔧
