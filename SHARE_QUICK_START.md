# 🚀 TaskFlow Share - Quick Start Guide

Hướng dẫn nhanh để setup và sử dụng tính năng share trong 5 phút!

## ✅ Hiện trạng

Tính năng share đã được implement **hoàn chỉnh** và **sẵn sàng sử dụng**:

- ✅ Code đã được viết xong 100%
- ✅ Build thành công không lỗi
- ✅ Components đã tích hợp vào UI
- ✅ i18n support cho 6 ngôn ngữ
- ✅ TypeScript type-safe
- ✅ `.env.local` đã được tạo template

**Chỉ cần setup Firebase là có thể dùng ngay!** 🎉

---

## 🔥 Setup Firebase (3 bước)

### Bước 1: Tạo Firebase Project

1. Truy cập: https://console.firebase.google.com/
2. Click **"Add project"** hoặc chọn project có sẵn
3. Follow wizard (enable Google Analytics nếu muốn)

### Bước 2: Enable Realtime Database

1. Trong Firebase Console, click **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Chọn location:
   - **US**: `us-central1` (default)
   - **Asia**: `asia-southeast1` (nhanh hơn cho VN) ⭐ Recommended
4. Chọn **"Start in test mode"** (cho development)
5. Click **"Enable"**

### Bước 3: Lấy Firebase Config (Chi tiết từng bước)

#### 3A. Lấy Config từ Firebase Console

**Bước 1:** Trong Firebase Console, click vào icon ⚙️ **Settings** (góc trên bên trái)
```
┌─────────────────────────────┐
│ ⚙️ Settings                 │ ← Click vào đây
│   • Project settings        │
│   • Usage and billing       │
└─────────────────────────────┘
```

**Bước 2:** Click **"Project settings"**

**Bước 3:** Scroll xuống phần **"Your apps"**
```
Your apps
─────────────────────────────
Currently no apps in this project

[Add app]
  🌐 Web    📱 iOS    🤖 Android    🎮 Unity
```

**Bước 4:** Click icon **Web** (🌐 hoặc </>)

**Bước 5:** Điền thông tin:
- **App nickname:** `TaskFlow` (hoặc tên bạn muốn)
- **Firebase Hosting:** Không cần check
- Click **"Register app"**

**Bước 6:** Copy config code. Bạn sẽ thấy đoạn code như này:
```javascript
// Firebase config sẽ hiển thị như này:
const firebaseConfig = {
  apiKey: "AIzaSyDxxx...",           // ← Copy dòng này
  authDomain: "myproject.firebaseapp.com",
  projectId: "myproject-12345",
  storageBucket: "myproject.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

**Bước 7:** Click **"Continue to console"**

#### 3B. Lấy Database URL

**Bước 1:** Trong menu bên trái, click **"Realtime Database"**

**Bước 2:** Ở phần **Data** tab, bạn sẽ thấy URL ở trên cùng:
```
┌─────────────────────────────────────────────────────────┐
│ https://myproject-12345-default-rtdb.asia-southeast1... │ ← Copy URL này
│                                                          │
│ Data  Rules  Backups  Usage                            │
├─────────────────────────────────────────────────────────┤
│ myproject-12345-default-rtdb                            │
│   ∅ null                                                │
└─────────────────────────────────────────────────────────┘
```

**Copy toàn bộ URL** (ví dụ: `https://myproject-12345-default-rtdb.asia-southeast1.firebasedatabase.app`)

#### 3C. Update `.env.local`

**Bước 1:** Mở file `.env.local` trong project của bạn

**Bước 2:** Thay thế các giá trị `your_xxx_here` bằng giá trị thật từ Firebase:

**VÍ DỤ CỤ THỂ:**

```bash
# BEFORE (template)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here

# AFTER (giá trị thật)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxVpK8jQ2mN3oR7sT9uV1wX2yZ4aB6cD8
```

**File `.env.local` hoàn chỉnh:**

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Firebase Configuration
# ⚠️ THAY THẾ các giá trị bên dưới bằng config từ Firebase Console

# 1️⃣ API Key (từ firebaseConfig.apiKey)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxVpK8jQ2mN3oR7sT9uV1wX2yZ4aB6cD8

# 2️⃣ Auth Domain (từ firebaseConfig.authDomain)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject-12345.firebaseapp.com

# 3️⃣ Project ID (từ firebaseConfig.projectId)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myproject-12345

# 4️⃣ Storage Bucket (từ firebaseConfig.storageBucket)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject-12345.appspot.com

# 5️⃣ Messaging Sender ID (từ firebaseConfig.messagingSenderId)
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012

# 6️⃣ App ID (từ firebaseConfig.appId)
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345

# 7️⃣ Measurement ID (từ firebaseConfig.measurementId) - Optional
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123XYZ

# 8️⃣ Database URL (từ Realtime Database page) - QUAN TRỌNG NHẤT!
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://myproject-12345-default-rtdb.asia-southeast1.firebasedatabase.app
```

**Bước 3:** Save file

**Bước 4:** Restart dev server
```bash
# Stop server (Ctrl+C)
# Start lại
npm run dev
```

#### 📝 Mapping Table (Giúp bạn không nhầm lẫn)

| File `.env.local` | Lấy từ Firebase | Ví dụ |
|------------------|-----------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `firebaseConfig.apiKey` | `AIzaSyDxVpK...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `firebaseConfig.authDomain` | `myproject.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `firebaseConfig.projectId` | `myproject-12345` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `firebaseConfig.storageBucket` | `myproject.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `firebaseConfig.messagingSenderId` | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `firebaseConfig.appId` | `1:123456789012:web:abc...` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `firebaseConfig.measurementId` | `G-ABC123XYZ` |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Realtime Database URL (top bar) | `https://...firebasedatabase.app` |

#### ⚠️ Lưu ý quan trọng:

1. **Không có dấu ngoặc kép:** Copy value trực tiếp, không cần `""`
   ```bash
   # ✅ Đúng
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...

   # ❌ Sai
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyD..."
   ```

2. **Không có khoảng trắng:** Không có space trước/sau dấu `=`
   ```bash
   # ✅ Đúng
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...

   # ❌ Sai
   NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyD...
   ```

3. **Database URL phải chính xác:** Copy toàn bộ URL từ Realtime Database page

---

## 🎮 Cách sử dụng

### 1. Start Dev Server

```bash
npm run dev
```

Truy cập: http://localhost:3000/taskflow

### 2. Share một Task

1. Mở TaskFlow app
2. Click vào **bất kỳ task nào** trong list
   - Hoặc mở task detail
3. Click nút **Share** (icon 🔗)
4. Dialog hiện lên với share link
5. Click **"Copy"**
6. Paste link và gửi cho người khác!

### 3. Share một Project

1. Trong Sidebar, **hover** vào project
2. Click icon **Share** bên phải
3. Copy link

### 4. Share một Contact

1. Vào tab **Contacts**
2. **Hover** vào contact card
3. Click icon **Share**
4. Copy link

### 5. Test Real-time Sync

1. Copy share link
2. Mở link trong **2 browser khác nhau** (hoặc incognito)
3. Thay đổi nội dung ở browser 1
4. → Browser 2 tự động update! ⚡

---

## 🎨 UI Features

### Share Buttons Location

Share buttons **luôn hiển thị** (không cần hover):

- ✅ **Task Cards** - Icon bên cạnh star button
- ✅ **Task Detail** - Button trong Quick Actions
- ✅ **Projects** - Icon bên phải project name
- ✅ **Contacts** - Icon bên cạnh star button

### Share Dialog

Khi click share button:
- ✅ Auto-generate unique share code (12 ký tự)
- ✅ Hiển thị full share URL
- ✅ Copy button với "Copied" feedback
- ✅ Thông tin features (real-time sync, no login, etc.)

---

## 🔍 Verify Setup

### Check 1: .env.local exists

```bash
ls -la .env.local
```

Should exist với đầy đủ Firebase config.

### Check 2: Build successful

```bash
npm run build
```

Should compile successfully không có TypeScript errors.

### Check 3: Share button hiển thị

1. Run `npm run dev`
2. Open TaskFlow
3. Nhìn task card → Should see **share icon** 🔗

### Check 4: Share dialog works

1. Click share button
2. Should see dialog với share link
3. **Nếu thấy warning**: Firebase chưa config đúng
4. **Nếu thấy link**: ✅ Success!

---

## ⚠️ Troubleshooting

### "Sharing not available"

**Nguyên nhân:** Firebase chưa được config

**Fix:**
1. Check `.env.local` có đầy đủ config không
2. Đặc biệt check `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
3. Restart dev server: `Ctrl+C` → `npm run dev`

### Share link không load

**Nguyên nhân:** Database rules chưa đúng

**Fix:**
1. Vào Firebase Console → Realtime Database → **Rules**
2. Update rules:

```json
{
  "rules": {
    "shared": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Click **"Publish"**

### Real-time sync không hoạt động

**Nguyên nhân:** WebSocket connection bị block

**Fix:**
1. Check Firebase Database URL đúng
2. Check browser console có errors không
3. Thử browser khác hoặc incognito

---

## 📝 Example Workflow

### Scenario: Share task với team

1. **User A** creates task "Fix login bug"
2. Click **Share** button → Copy link
3. Send link qua Slack/Email
4. **User B** clicks link → Sees task immediately
5. User B updates task status → User A sees update real-time
6. **User C** joins → 3 people collaborate simultaneously!

### Scenario: Share project roadmap

1. Create project "Q1 2025 Goals"
2. Add tasks vào project
3. Click **Share** icon trong Sidebar
4. Share link với stakeholders
5. Everyone tracks progress real-time

---

## 🎯 What's Implemented

### ✅ Core Features
- [x] Share Projects, Tasks, Contacts
- [x] Generate unique share codes
- [x] Real-time synchronization
- [x] Copy to clipboard
- [x] URL parameter handling
- [x] ShareDialog with features list

### ✅ UI Components
- [x] ShareButton (always visible)
- [x] ShareDialog (modal with copy)
- [x] ShareIndicator (badge)
- [x] Integration in TaskItem
- [x] Integration in TaskDetail
- [x] Integration in Sidebar
- [x] Integration in ContactCard

### ✅ Technical
- [x] Firebase Realtime Database
- [x] TypeScript type-safe
- [x] Service layer (shareService.ts)
- [x] Reusable hook (useShare.ts)
- [x] Error handling
- [x] Loading states
- [x] i18n support (6 languages)

### ✅ Quality
- [x] Build successful
- [x] No TypeScript errors
- [x] Follows code patterns
- [x] Reusable components
- [x] Clean architecture
- [x] Documentation complete

---

## 📚 Additional Resources

- **Full Setup Guide:** `TASKFLOW_SHARE_SETUP.md` (chi tiết hơn)
- **Firebase Docs:** https://firebase.google.com/docs/database
- **Next.js Docs:** https://nextjs.org/docs

---

## 🎊 You're Ready!

Tính năng share đã **100% sẵn sàng**. Chỉ cần:

1. ✅ Setup Firebase (3 bước trên)
2. ✅ Update `.env.local`
3. ✅ Restart dev server
4. ✅ Test share button

**Enjoy your collaborative TaskFlow!** 🚀

---

**Questions?** Check `TASKFLOW_SHARE_SETUP.md` for detailed docs.

**Created by:** Claude Code
**Date:** 2025-01-05
