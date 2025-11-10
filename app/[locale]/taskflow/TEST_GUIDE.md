# 🧪 Hướng Dẫn Test Authentication - Từng Bước

## ✅ Server Status
Server đang chạy tại: **http://localhost:3000**

---

## 📍 Bước 1: Mở TaskFlow

### 1.1. Mở Browser
- Mở Google Chrome, Firefox, hoặc Safari

### 1.2. Truy cập URL
```
http://localhost:3000/en/taskflow
```

### 1.3. Refresh Page (Quan trọng!)
**Nhấn:** `Ctrl + Shift + R` (Windows/Linux) hoặc `Cmd + Shift + R` (Mac)

> **Tại sao?** Để load code mới nhất từ server

---

## 📍 Bước 2: Tìm UserProfile

### 2.1. Vị Trí UserProfile

UserProfile nằm ở **Sidebar Footer** (cuối sidebar bên trái):

```
┌─────────────────────────┐
│  TaskFlow               │  ← Header
│                         │
│  My Day                 │
│  Important              │
│  All Tasks              │
│  Completed              │
│  Contacts               │
│                         │
│  Projects               │
│  + New                  │
│                         │
│                         │
│  ↓ Scroll down ↓        │
│                         │
│  [👤]      [🌐] [🌙]   │  ← UserProfile ĐÂY!
│  Avatar    Lang  Theme  │
└─────────────────────────┘
```

### 2.2. Tìm Avatar

**Nếu THẤY:**
- Hình tròn màu gradient (xanh-tím)
- Có 2 chữ cái bên trong (ví dụ: "UA", "US")
- ✅ **UserProfile đã hiển thị!**

**Nếu KHÔNG THẤY:**
- Chỉ có icon Language Switcher và Theme Toggle
- ❌ **Cần debug (xem Bước 5)**

---

## 📍 Bước 3: Test UserProfile Dropdown

### 3.1. Click vào Avatar

**Click vào hình tròn avatar** (ở góc dưới trái sidebar)

### 3.2. Kiểm tra Dropdown

**Nên thấy popup hiển thị:**
```
┌─────────────────────────────┐
│  [UA]  User abc123          │  ← Avatar + Name
│        Anonymous User       │  ← User type
│        ID: abc123...        │  ← User ID
├─────────────────────────────┤
│  ℹ️  You're signed in       │  ← Info box
│     anonymously...          │
├─────────────────────────────┤
│  🚪 Sign Out                │  ← Sign out button
└─────────────────────────────┘
```

**Nếu thấy popup:**
- ✅ **UserProfile hoạt động!**

**Nếu không thấy popup:**
- ❌ **Cần debug**

### 3.3. Test Click Outside

**Click bên ngoài popup** (vào màn hình chính)

**Popup nên đóng:**
- ✅ **Click outside hoạt động!**

---

## 📍 Bước 4: Test Sign Out

### 4.1. Mở Dropdown
Click vào avatar

### 4.2. Click "Sign Out"
**Click vào nút "🚪 Sign Out"**

### 4.3. Kiểm tra Loading State
**Nên thấy:**
```
🔄 Signing out...
```

### 4.4. Page Reload
**Page sẽ tự động reload**

### 4.5. Check New User ID
1. Mở lại dropdown (click avatar)
2. User ID sẽ **KHÁC** với lúc trước
3. ✅ **Sign out thành công!**

**Ví dụ:**
```
Trước sign out: ID: abc123...
Sau sign out:   ID: xyz789...  ← UID MỚI
```

---

## 📍 Bước 5: Debug (Nếu Không Thấy UserProfile)

### 5.1. Mở Browser Console

**Nhấn:** `F12` hoặc `Ctrl + Shift + I` (Windows/Linux) hoặc `Cmd + Option + I` (Mac)

### 5.2. Check Console Tab

**Tìm lỗi màu đỏ:**

```javascript
// VÍ DỤ LỖI:

// Lỗi 1: Import error
❌ Error: Cannot find module './UserProfile'
→ Fix: Check file path

// Lỗi 2: Auth not available
❌ Firebase app not initialized
→ Fix: Check .env.local

// Lỗi 3: Component error
❌ useAuth is not defined
→ Fix: Check import
```

### 5.3. Check Network Tab

1. Click tab **Network**
2. Reload page (`F5`)
3. Tìm request màu đỏ (failed)
4. Check response

### 5.4. Check Elements Tab

1. Click tab **Elements** (hoặc **Inspector**)
2. Tìm sidebar footer:
   ```html
   <div class="...">
     <!-- Should have UserProfile here -->
   </div>
   ```
3. Nếu không có `UserProfile` → Component không render

---

## 📍 Bước 6: Check Firebase Auth Status

### 6.1. Mở Console
Nhấn `F12`

### 6.2. Run Commands

**Paste vào Console:**

```javascript
// Check user signed in
console.log('Signed in:', isSignedIn());

// Get user info
console.log('User ID:', getUserId());
console.log('Display name:', getUserDisplayName());

// Get current user
console.log('Current user:', getCurrentUser());
```

**Kết quả mong đợi:**
```javascript
Signed in: true
User ID: "abc123xyz456789"
Display name: "User abc123"
Current user: { uid: "abc123...", ... }
```

**Nếu thấy:**
```javascript
Signed in: false
User ID: null
```
→ ❌ **Auth chưa hoạt động**

---

## 📍 Bước 7: Test Dark Mode

### 7.1. Toggle Dark Mode
Click vào **Theme Toggle** button (icon mặt trăng/mặt trời)

### 7.2. Check UserProfile
**Avatar và dropdown nên:**
- Đổi màu background
- Text màu sáng (dark mode) hoặc tối (light mode)
- Gradient vẫn đẹp

✅ **Dark mode hoạt động!**

---

## 📍 Bước 8: Test Mobile View

### 8.1. Mở DevTools
Nhấn `F12`

### 8.2. Toggle Device Toolbar
**Nhấn:** Icon smartphone (hoặc `Ctrl + Shift + M`)

### 8.3. Select Device
Chọn: **iPhone 12 Pro** hoặc **Pixel 5**

### 8.4. Check UserProfile
- Avatar vẫn hiển thị?
- Click hoạt động?
- Dropdown responsive?

✅ **Mobile view OK!**

---

## 🔍 Common Issues & Solutions

### Issue 1: Không thấy Avatar

**Nguyên nhân:**
- Component chưa render
- Import path sai
- Browser cache

**Solution:**
```bash
# Hard refresh
Ctrl + Shift + R

# Clear cache
DevTools → Network → Disable cache
```

### Issue 2: Click Avatar không mở Dropdown

**Nguyên nhân:**
- JavaScript error
- Event handler không hoạt động

**Solution:**
```javascript
// Check console for errors
console.log('Errors?');

// Check if onClick works
// (should see state change in React DevTools)
```

### Issue 3: Sign Out không hoạt động

**Nguyên nhân:**
- Firebase Auth chưa enable
- signOutUser() lỗi

**Solution:**
1. Check Firebase Console
2. Enable Anonymous Auth
3. Check console errors

### Issue 4: Auth Error Banner hiển thị

**Nếu thấy banner vàng:**
```
❗ Firebase Anonymous Auth Not Enabled
```

**Solution:**
1. Go to Firebase Console
2. Enable Anonymous Auth
3. Refresh page

---

## ✅ Checklist Test Hoàn Chỉnh

Copy checklist này và đánh dấu khi test:

```
[ ] Bước 1: Mở http://localhost:3000/en/taskflow
[ ] Bước 2: Hard refresh (Ctrl+Shift+R)
[ ] Bước 3: Tìm avatar ở sidebar footer
[ ] Bước 4: Click avatar → Dropdown mở
[ ] Bước 5: Check user info hiển thị
[ ] Bước 6: Click outside → Dropdown đóng
[ ] Bước 7: Click avatar lại → Dropdown mở
[ ] Bước 8: Click "Sign Out"
[ ] Bước 9: Wait for reload
[ ] Bước 10: Check User ID mới (khác ID cũ)
[ ] Bước 11: Toggle dark mode → UI đúng
[ ] Bước 12: Test mobile view → Responsive
[ ] Bước 13: Check console → No errors
```

---

## 🎥 Video Demo (Text)

```
1. Mở TaskFlow
   → Loading... → Page loaded

2. Scroll sidebar xuống dưới
   → Thấy: [Avatar] [Language] [Theme]

3. Click vào Avatar (hình tròn màu xanh-tím)
   → Dropdown mở
   → Hiển thị:
      - User abc123
      - Anonymous User
      - ID: abc123...
      - Info box
      - Sign Out button

4. Click "Sign Out"
   → Nút đổi thành "Signing out..."
   → Page reload
   → Tự động sign in lại

5. Click Avatar lại
   → User ID MỚI (khác lúc trước)
   ✅ Sign out thành công!
```

---

## 📞 Nếu Vẫn Không Thấy

### Gửi cho tôi:

1. **Screenshot sidebar footer**
   - Chụp phần dưới cùng của sidebar

2. **Console errors**
   - F12 → Console tab
   - Copy paste errors màu đỏ

3. **Network status**
   - F12 → Network tab
   - Check request failed

4. **React DevTools (nếu có)**
   - Check component tree
   - Tìm UserProfile component

---

## 🎯 Expected Result

**Nếu mọi thứ OK:**

1. ✅ Avatar hiển thị ở sidebar footer
2. ✅ Click avatar → Dropdown mở
3. ✅ User info hiển thị đầy đủ
4. ✅ Click outside → Dropdown đóng
5. ✅ Click Sign Out → Page reload
6. ✅ User ID mới sau khi sign out
7. ✅ Dark mode hoạt động
8. ✅ Mobile responsive
9. ✅ No console errors

**Screenshot mong đợi:**

```
Sidebar Footer:
┌──────────────────────────┐
│                          │
│  [UA]      [🌐] [🌙]    │
│  ↑          ↑     ↑      │
│  Avatar    Lang  Theme   │
└──────────────────────────┘
```

---

## 🚀 Quick Test Command

**Paste vào browser console để test nhanh:**

```javascript
// Test auth
console.log('🔐 Auth Test:');
console.log('- Signed in:', isSignedIn());
console.log('- User ID:', getUserId());
console.log('- Display name:', getUserDisplayName());
console.log('- Initials:', getUserInitials());

// Test sign out
console.log('\n🚪 Testing sign out...');
signOutUser().then(success => {
  console.log('- Sign out:', success ? '✅ Success' : '❌ Failed');
});
```

---

**Hãy thử theo từng bước và cho tôi biết kết quả!** 🎯

Nếu gặp vấn đề, gửi:
- Screenshot sidebar
- Console errors
- Mô tả chi tiết
