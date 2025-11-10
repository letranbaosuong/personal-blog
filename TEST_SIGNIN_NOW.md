# 🧪 Test Sign In Feature - Quick Guide

## ⚡ Quick Test (5 phút)

### Step 1: Clear localStorage (quan trọng!)

Mở browser console (F12) và chạy:

```javascript
localStorage.clear();
location.reload();
```

### Step 2: Mở TaskFlow

```
http://localhost:3000/en/taskflow
```

### Step 3: Check Avatar

Scroll xuống sidebar (bên trái) đến cuối trang.

Bạn sẽ thấy:
```
┌──────────────────┐
│ [UA] User abc123 │ ← Avatar với initials
│      Anonymous   │
└──────────────────┘
```

### Step 4: Click Avatar

Click vào avatar → Dropdown menu hiện ra:

```
┌─────────────────────────────────────┐
│  [UA]  User abc123                  │
│        Anonymous User               │
│        ID: abc123...                │
├─────────────────────────────────────┤
│  ⚠️ Anonymous account - Data is    │
│     stored locally only. Sign in    │
│     with email to sync across       │
│     devices.                        │
├─────────────────────────────────────┤
│  📧 Sign In with Email             │ ← NÚT MỚI!
│  🚪 Sign Out                        │
└─────────────────────────────────────┘
```

### Step 5: Click "Sign In with Email"

Dialog sẽ mở ra:

```
┌──────────────────────────────────────┐
│  👤 Create Account              [X]  │
│  ──────────────────────────────────  │
│                                      │
│  Display Name: [____________]        │
│  Email:        [____________]        │
│  Password:     [____________]        │
│                                      │
│  ✨ Create an account to access     │
│     your tasks from any device       │
│                                      │
│       [ Create Account ]             │
│                                      │
│  Already have an account? Sign in   │
└──────────────────────────────────────┘
```

### Step 6: Tạo Account

Fill form:
- Display Name: `Bảo Sương`
- Email: `test@example.com`
- Password: `test123456`

Click "Create Account"

### ⚠️ Expected Error (Chưa enable Firebase)

Bạn sẽ thấy error đỏ trong dialog:

```
❌ Firebase: Error (auth/operation-not-allowed).
```

**Đây là BÌNH THƯỜNG!** Vì chưa enable Email/Password trong Firebase Console.

---

## 🔥 Fix: Enable Firebase Email/Password

### Quick Steps:

1. **Mở Firebase Console:**
   ```
   https://console.firebase.google.com/
   ```

2. **Chọn project:** `personal-blog-00`

3. **Navigate:** Build → Authentication → Sign-in method

4. **Find Email/Password:**
   ```
   📧 Email/Password      Disabled    ← Click vào đây
   ```

5. **Enable:**
   - Toggle "Enable" → ON (màu xanh)
   - Click "Save"

6. **Reload app:**
   ```javascript
   location.reload();
   ```

---

## ✅ Test Lại (Sau khi enable)

### Step 1: Mở dropdown lại

Click avatar → Sign In with Email

### Step 2: Tạo account

- Display Name: `Bảo Sương`
- Email: `test@example.com`
- Password: `test123456`

Click "Create Account"

### Step 3: Success!

- ✅ Dialog đóng
- ✅ Page reload
- ✅ Avatar hiện lại với tên mới: `BS` (initials)

### Step 4: Click avatar để verify

```
┌─────────────────────────────────────┐
│  [BS]  Bảo Sương                    │
│        test@example.com             │ ← EMAIL!
├─────────────────────────────────────┤
│  ✅ Signed in with email - Your    │ ← SUCCESS MESSAGE!
│     data syncs across all devices.  │
├─────────────────────────────────────┤
│  🚪 Sign Out                        │ ← Chỉ còn Sign Out
└─────────────────────────────────────┘
```

**KHÔNG còn** "Sign In with Email" button!

---

## 🧪 Test Cross-Device

### Device 1 (Máy hiện tại):

Bạn đã sign in với `test@example.com`

### Device 2 (Browser khác hoặc incognito):

1. Mở `http://localhost:3000/en/taskflow`
2. Click avatar → Sign In with Email
3. Click "Already have an account? Sign in"
4. Enter email: `test@example.com`
5. Enter password: `test123456`
6. Click "Sign In"

**Result:**
- ✅ Same user ID
- ✅ Same display name
- ✅ Ready for data sync!

---

## 📊 Console Logs

Để debug, mở Console (F12) và watch:

### When creating account:
```javascript
📧 Creating account with email: test@example.com name: Bảo Sương
✅ User created successfully: test@example.com
```

### When signing in:
```javascript
📧 Signing in with email: test@example.com
✅ Sign in success: true
```

### When error:
```javascript
❌ Sign up failed: Error: ...
```

---

## 🎯 Quick Checklist

Test UI elements:

- [ ] Avatar hiện ở sidebar bottom
- [ ] Click avatar → Dropdown mở
- [ ] Anonymous user: Có nút "Sign In with Email"
- [ ] Click "Sign In with Email" → Dialog mở
- [ ] Dialog có 2 modes: Sign In / Sign Up
- [ ] Form validation works (required fields)
- [ ] Error hiện khi Firebase chưa enable
- [ ] Sau khi enable Firebase: Create account works
- [ ] Sau sign in: Email hiện trong profile
- [ ] Email user: KHÔNG có "Sign In with Email" button
- [ ] Sign Out works → Quay về anonymous

---

## 🐛 Troubleshooting

### Không thấy avatar

**Check:**
1. Scroll xuống cuối sidebar
2. F12 → Console → Check errors
3. Verify Firebase initialized

**Fix:**
```javascript
localStorage.clear();
location.reload();
```

### Không thấy "Sign In with Email" button

**Check:**
1. User phải là anonymous (thấy "Anonymous User")
2. Nếu đã sign in email → Sign out trước

**Fix:**
Click "Sign Out" → Reload

### Dialog không mở

**Check:**
1. F12 → Console → Check errors
2. Verify no JavaScript errors

**Fix:**
Hard refresh: `Ctrl + Shift + R`

### "Firebase Auth not available"

**Check:**
`.env.local` has Firebase config

**Fix:**
Restart server:
```bash
npm run dev
```

---

## 📸 Screenshots Reference

### 1. Anonymous User Dropdown
```
[UA] User abc123
     Anonymous
     ⚠️ Anonymous account...
     📧 Sign In with Email  ← MUST SEE THIS
     🚪 Sign Out
```

### 2. Sign In Dialog
```
👤 Create Account   [X]
─────────────────────
Display Name: [___]
Email:        [___]
Password:     [___]

[ Create Account ]

Already have an account? Sign in
```

### 3. Email User Dropdown
```
[BS] Bảo Sương
     test@example.com  ← EMAIL HERE
     ✅ Signed in...   ← SUCCESS MESSAGE
     🚪 Sign Out       ← NO "Sign In with Email"
```

---

## ✅ Done!

Nếu tất cả work → Sign In feature đã hoạt động!

Next step: Enable Email/Password trong Firebase Console để test thật!
