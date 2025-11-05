# TaskFlow Share Feature - Setup Guide

## 🎯 Tổng quan

Tính năng chia sẻ cho phép users share Projects, Tasks, và Contacts với nhau **không cần đăng nhập**. Các thành viên có thể:
- ✅ Xem thông tin chi tiết của items được share
- ✅ Real-time synchronization - thay đổi ở 1 nơi cập nhật tất cả
- ✅ Collaborative editing
- ✅ Copy và share links dễ dàng

## 🏗️ Kiến trúc

**Tech Stack:**
- **Firebase Realtime Database** - Lưu trữ shared data và real-time sync
- **Next.js 16** - App Router với client components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

**Flow:**
```
User clicks "Share"
  → Generate unique share code (abc-def-ghi-jkl)
  → Save data lên Firebase: /shared/{type}/{shareCode}
  → Copy share URL: /taskflow?share=abc-def-ghi-jkl&type=project
  → Recipient pastes link
  → Auto load data from Firebase
  → Real-time sync listeners setup
```

## 📦 Files Created/Modified

### New Files:
```
app/[locale]/taskflow/
├── lib/
│   ├── firebase.ts             # Firebase initialization
│   └── shareService.ts         # Share CRUD operations
├── hooks/
│   └── useShare.ts             # Reusable share hook
└── components/
    ├── ShareButton.tsx         # Share button component
    ├── ShareDialog.tsx         # Share dialog modal
    └── ShareIndicator.tsx      # "Shared" badge indicator
```

### Modified Files:
```
- .env.example                  # Added NEXT_PUBLIC_FIREBASE_DATABASE_URL
- TaskFlowClient.tsx            # URL params handling, shared data loading
- TaskDetail.tsx                # Added share button for tasks
- Sidebar.tsx                   # Added share button for projects
- ContactCard.tsx               # Added share button for contacts
- messages/en.json              # English translations
- messages/vi.json              # Vietnamese translations
```

## 🔧 Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or use existing
3. Enable **Realtime Database**:
   - Go to **Build** → **Realtime Database**
   - Click **Create Database**
   - Choose location (Asia: `asia-southeast1` for better performance)
   - Start in **Test mode** (for development)

### 2. Get Firebase Config

1. Go to **Project Settings** (⚙️ icon)
2. Scroll to **Your apps** section
3. Click **Web app** (</>)
4. Copy the config values:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123",
     databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app"
   };
   ```

### 3. Configure Environment Variables

Create `.env.local` (or update existing):

```bash
# Firebase Configuration (Required for sharing feature)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ⚠️ IMPORTANT: Required for Realtime Database
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
```

**Note:** Nếu database ở US region, URL sẽ là:
```
https://your-project-default-rtdb.firebaseio.com
```

### 4. Firebase Security Rules

Go to **Realtime Database** → **Rules** tab:

**For Development (Test Mode):**
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

**For Production (More Secure):**
```json
{
  "rules": {
    "shared": {
      "$type": {
        "$shareCode": {
          ".read": true,
          ".write": true,
          ".validate": "newData.hasChildren(['data', 'shareCode', 'type', 'createdAt', 'lastSync'])"
        }
      }
    }
  }
}
```

### 5. Install & Run

```bash
# Install dependencies (if not already)
npm install firebase

# Run development server
npm run dev

# Visit http://localhost:3000/taskflow
```

## 🎨 UI Features

### 1. Share Buttons
- **Task Detail**: Share button trong "Quick Actions" section
- **Projects (Sidebar)**: Share icon xuất hiện khi hover vào project
- **Contacts**: Share icon xuất hiện khi hover vào contact card

### 2. Share Dialog
- Tự động generate share link khi mở
- Copy button để copy link
- Hiển thị features (real-time sync, no login, collaborative)
- Loading state khi đang generate
- Error handling nếu Firebase chưa config

### 3. Share Indicator
- Badge "Shared" hiển thị trên shared projects
- Icon indicator cho compact views

## 🔄 How It Works

### Sharing Flow

1. **User clicks Share button**
   ```typescript
   setIsShareDialogOpen(true);
   ```

2. **Dialog opens and auto-shares**
   ```typescript
   useEffect(() => {
     if (isOpen && isAvailable) {
       share(data, type); // Calls shareService
     }
   }, [isOpen]);
   ```

3. **Generate unique code**
   ```typescript
   const shareCode = generateShareCode(); // e.g., "abc-def-ghi-jkl"
   ```

4. **Save to Firebase**
   ```typescript
   await set(ref(database, `shared/${type}/${shareCode}`), {
     data: { ...item },
     shareCode,
     type,
     createdAt: new Date().toISOString(),
     lastSync: new Date().toISOString()
   });
   ```

5. **Build share URL**
   ```typescript
   const url = `${origin}/${locale}/taskflow?share=${shareCode}&type=${type}`;
   ```

### Loading Shared Items

1. **TaskFlowClient detects URL params**
   ```typescript
   const shareCode = searchParams.get('share');
   const shareType = searchParams.get('type');
   ```

2. **Load from Firebase**
   ```typescript
   useEffect(() => {
     if (shareCode && shareType) {
       loadShared(shareCode, shareType);
     }
   }, [shareCode, shareType]);
   ```

3. **Setup real-time sync**
   ```typescript
   const unsubscribe = subscribeToSharedData(shareCode, type, (data) => {
     // Update UI when data changes
   });
   ```

### Real-time Sync

```typescript
// Firebase onValue listener
onValue(ref(database, path), (snapshot) => {
  if (snapshot.exists()) {
    const updatedData = snapshot.val();
    callback(updatedData.data); // Notify UI
  }
});
```

## 🧪 Testing

### Manual Testing Checklist

1. **Share a Task**
   - [ ] Open TaskFlow
   - [ ] Click vào một task
   - [ ] Click "Share" button
   - [ ] Dialog hiển thị share link
   - [ ] Click "Copy" button
   - [ ] Paste link vào incognito/another browser
   - [ ] Task hiển thị đúng

2. **Share a Project**
   - [ ] Hover vào project trong Sidebar
   - [ ] Click share icon
   - [ ] Copy và test link

3. **Share a Contact**
   - [ ] Go to Contacts view
   - [ ] Hover vào contact card
   - [ ] Click share icon
   - [ ] Copy và test link

4. **Real-time Sync**
   - [ ] Mở shared link trong 2 browsers
   - [ ] Update task title trong browser 1
   - [ ] Kiểm tra browser 2 tự động update

5. **Error Handling**
   - [ ] Test khi Firebase chưa config (should show warning)
   - [ ] Test với invalid share code (should show error)

## 🐛 Troubleshooting

### Issue: "Sharing not available"

**Cause:** Firebase chưa được configure

**Solution:**
1. Check `.env.local` có đầy đủ variables
2. Đặc biệt check `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
3. Restart dev server sau khi thêm env vars

### Issue: "Failed to connect to Firebase"

**Cause:** Database URL sai hoặc rules không đúng

**Solution:**
1. Verify database URL trong Firebase Console
2. Check security rules allow read/write
3. Check browser console for detailed errors

### Issue: Real-time sync không hoạt động

**Cause:** Listener chưa được setup hoặc unmount

**Solution:**
1. Check `autoSync: true` trong useShare options
2. Check browser network tab xem có WebSocket connection
3. Verify Firebase rules allow `.read`

### Issue: Share link không load

**Cause:** URL params không được parse đúng

**Solution:**
1. Check URL format: `?share=XXX&type=YYY`
2. Verify TaskFlowClient có useSearchParams
3. Check browser console logs

## 📝 Code Examples

### Share a custom item

```typescript
import { useShare } from './hooks/useShare';

function MyComponent() {
  const { share, shareUrl, isSharing } = useShare();

  const handleShare = async () => {
    await share(myData, 'task');
    // shareUrl now available
    navigator.clipboard.writeText(shareUrl);
  };

  return <button onClick={handleShare}>Share</button>;
}
```

### Load shared with real-time sync

```typescript
const { loadShared, sharedData } = useShare({
  autoSync: true,
  onSyncUpdate: (data) => {
    console.log('Data updated:', data);
  }
});

useEffect(() => {
  loadShared('abc-def-123', 'task');
}, []);
```

### Custom share service usage

```typescript
import { shareTask, getSharedData } from './lib/shareService';

// Share
const result = await shareTask(myTask);
console.log(result.shareUrl);

// Load
const data = await getSharedData('share-code', 'task');
console.log(data.data);
```

## 🚀 Next Steps

### Optional Enhancements:

1. **Password Protection**
   - Add optional password field in ShareDialog
   - Store hashed password in Firebase
   - Prompt for password when loading shared link

2. **Expiry Time**
   - Add expiry date selector
   - Auto-delete from Firebase when expired
   - Show "Expired" message to users

3. **View Analytics**
   - Track view count
   - Show "X people viewing" indicator
   - Last accessed timestamp

4. **Permission Levels**
   - View-only vs Edit permissions
   - Owner can revoke access
   - Manage shared users list

5. **QR Code**
   - Generate QR code for share URL
   - Download/print QR code
   - Scan to open shared item

## 📚 Resources

- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Next.js App Router](https://nextjs.org/docs/app)
- [next-intl](https://next-intl-docs.vercel.app/)

## ✅ Completion Status

All features implemented and ready to use! 🎉

**Created by:** Claude Code
**Date:** 2025-01-05
