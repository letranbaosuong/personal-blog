# 🔐 TaskFlow Share - Authentication Strategy

## 🎯 Mục tiêu

Thêm authentication đơn giản để:
- ✅ Biết **ai tạo** share
- ✅ Biết **ai chỉnh sửa**
- ✅ **Revoke** share được (owner only)
- ✅ **Permissions** rõ ràng (owner vs viewer)
- ✅ **Dễ dùng** - không cần đăng ký phức tạp

---

## 💡 Authentication Strategy

### Option 1: Firebase Anonymous Auth ⭐ RECOMMENDED

**Concept**: Tự động đăng nhập anonymous khi vào app

```
User opens TaskFlow
    ↓
Auto sign-in anonymously
    ↓
User ID: "anon_abc123xyz" (Firebase generates)
    ↓
User creates task → Share
    ↓
Share data includes:
- createdBy: "anon_abc123xyz"
- createdByName: "Anonymous User"
    ↓
Other users open share link → Also auto sign-in anonymously
    ↓
Can see who created, can edit (if permitted)
```

**Pros**:
- ✅ Zero friction - không cần đăng ký
- ✅ Instant - tự động sign in
- ✅ Có user ID để track ownership
- ✅ FREE Firebase Auth
- ✅ Có thể upgrade sang email/Google sau

**Cons**:
- ⚠️ User mất ID nếu clear browser data
- ⚠️ Không có profile name/avatar (mặc định "Anonymous")

### Option 2: Optional Email/Google Sign-In

**Concept**: Cho phép user upgrade từ anonymous

```
User 1: Anonymous → Clicks "Sign in with Google"
    ↓
Upgrade account → Now has name "John Doe"
    ↓
Shares retain ownership, now shows "John Doe"

User 2: Anonymous → Stays anonymous
    ↓
Can still collaborate, shows "Anonymous User"
```

**Pros**:
- ✅ Best of both worlds
- ✅ Optional - không bắt buộc
- ✅ Better UX khi có nhiều collaborators
- ✅ Profile picture/name

**Cons**:
- ⚠️ Phức tạp hơn một chút
- ⚠️ Cần UI cho sign in

---

## 🏗️ Architecture

### 1. Firebase Auth Setup

```typescript
// lib/auth.ts
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Auto sign-in on app load
const auth = getAuth(firebaseApp);

export const signInUser = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
```

### 2. Updated Share Data Structure

```typescript
interface SharedData<T> {
  data: T; // Task/Project/Contact
  shareCode: string;
  type: ShareType;

  // NEW: Owner info
  createdBy: string; // Firebase User ID
  createdByName: string; // Display name or "Anonymous"
  createdAt: string;

  // NEW: Permissions
  permissions: {
    owner: string; // User ID of owner
    viewers: string[]; // Array of user IDs who can view
    editors: string[]; // Array of user IDs who can edit
    public: boolean; // If true, anyone with link can edit
  };

  // Existing
  lastSync: string;
  expiresAt?: string;
}
```

### 3. Permission Levels

```typescript
enum PermissionLevel {
  OWNER = 'owner',     // Can edit, revoke, manage permissions
  EDITOR = 'editor',   // Can edit data
  VIEWER = 'viewer',   // Can only view
  PUBLIC = 'public',   // Anyone with link (current behavior)
}

// Check permission
const canEdit = (userId: string, sharedData: SharedData<T>) => {
  const { permissions } = sharedData;

  // Public mode - anyone can edit
  if (permissions.public) return true;

  // Owner always can edit
  if (permissions.owner === userId) return true;

  // Check editor list
  if (permissions.editors.includes(userId)) return true;

  return false;
};
```

---

## 📝 Implementation Plan

### Phase 1: Firebase Anonymous Auth (Core)

**Files to create/modify**:
1. `lib/auth.ts` - Auth service
2. `hooks/useAuth.ts` - Auth hook
3. `lib/shareService.ts` - Update to include user info
4. `TaskFlowClient.tsx` - Auto sign-in on mount
5. `components/UserBadge.tsx` - Show current user (optional)

**Flow**:
```typescript
// 1. Auto sign-in on app load
useEffect(() => {
  signInUser();
}, []);

// 2. When sharing, include user info
const shareTask = async (task: Task) => {
  const user = getCurrentUser();
  const sharedData = {
    data: task,
    shareCode: generateCode(),
    type: 'task',
    createdBy: user?.uid || 'unknown',
    createdByName: user?.displayName || 'Anonymous User',
    permissions: {
      owner: user?.uid || 'unknown',
      viewers: [],
      editors: [],
      public: true, // Keep current behavior
    },
    createdAt: new Date().toISOString(),
    lastSync: new Date().toISOString(),
  };

  await saveToFirebase(sharedData);
};

// 3. Check permission before editing
const updateTask = async (updates) => {
  const user = getCurrentUser();
  if (!canEdit(user?.uid, sharedData)) {
    showError('You do not have permission to edit');
    return;
  }

  // Proceed with update
  await updateSharedData(updates);
};
```

### Phase 2: Optional Email/Google Sign-In (Enhancement)

**New UI components**:
1. `AuthDialog.tsx` - Sign in modal
2. `UserMenu.tsx` - User dropdown with sign out
3. `SharePermissionsDialog.tsx` - Manage who can access

**Flow**:
```typescript
// User clicks "Sign in"
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  // Firebase auto-merges anonymous account
  // User keeps all their shared items!
};

// Share with specific people
const shareWithUser = async (email: string, permission: 'editor' | 'viewer') => {
  // Lookup user by email
  // Add to editors/viewers list
  // Send notification (optional)
};
```

---

## 🔐 Firebase Security Rules

### Updated Rules for Auth:

```json
{
  "rules": {
    "shared": {
      "$type": {
        "$shareCode": {
          // Public shares - anyone can read
          ".read": "data.child('permissions/public').val() === true || auth != null",

          // Write rules
          ".write": "
            // Public mode - anyone can write
            data.child('permissions/public').val() === true ||
            // Owner can always write
            data.child('permissions/owner').val() === auth.uid ||
            // Editors can write
            data.child('permissions/editors').val().contains(auth.uid)
          ",

          // Validate structure
          ".validate": "
            newData.hasChildren(['data', 'shareCode', 'type', 'createdBy', 'permissions'])
          "
        }
      }
    }
  }
}
```

---

## 🎨 UI/UX Changes

### 1. Share Dialog - Show Owner Info

```
┌─────────────────────────────────────────┐
│ Share Task                         [x]  │
├─────────────────────────────────────────┤
│                                          │
│ 👤 Created by: You                      │
│ 🔓 Anyone with link can edit            │
│                                          │
│ 🔗 Share Link                           │
│ ┌────────────────────────────────────┐  │
│ │ http://localhost:3000/taskflow?... │  │
│ └────────────────────────────────────┘  │
│                         [Copy]           │
│                                          │
│ ⚙️ Permissions                          │
│ ○ Public (anyone can edit)              │
│ ○ Private (invite only)                 │
│                                          │
│ [Revoke Share]                          │
│                                          │
└─────────────────────────────────────────┘
```

### 2. Viewing Shared Item

```
┌─────────────────────────────────────────┐
│ 📋 Shared Task                          │
├─────────────────────────────────────────┤
│                                          │
│ Fix bug in login page                   │
│                                          │
│ 👤 Created by: John Doe                 │
│ 📅 Shared: 2 hours ago                  │
│ 🔄 Last synced: Just now                │
│                                          │
│ ✏️ You can edit this                    │
│ (or 👁️ View-only)                       │
│                                          │
└─────────────────────────────────────────┘
```

### 3. Top Bar - User Info (Optional)

```
┌────────────────────────────────────────────┐
│ TaskFlow                       👤 You  ▼   │
│                                             │
│ Click user icon:                            │
│ ┌──────────────────────┐                   │
│ │ Anonymous User       │                   │
│ │ ID: anon_abc123     │                   │
│ │                      │                   │
│ │ [Sign in with Google]│                   │
│ │ [Sign in with Email] │                   │
│ └──────────────────────┘                   │
└────────────────────────────────────────────┘
```

---

## 💾 Firebase Cost

### With Auth:
- **Authentication**: FREE unlimited users
- **Realtime Database**: Same as before (FREE tier sufficient)
- **Total**: Still FREE for most use cases! 🎉

### Estimated Usage:
- 1000 users/month
- Each user creates 10 shares
- Each share has 5 collaborators
- Total: 10,000 shares, 50,000 syncs/month
- Cost: **$0** (within free tier)

---

## 🚀 Migration Path

### For Existing Shares:

```typescript
// Auto-migrate old shares to new format
const migrateShare = async (oldShare: OldSharedData) => {
  const newShare: SharedData = {
    ...oldShare,
    createdBy: 'legacy_user',
    createdByName: 'Anonymous User',
    permissions: {
      owner: 'legacy_user',
      viewers: [],
      editors: [],
      public: true, // Keep public by default
    },
  };

  await updateSharedData(shareCode, type, newShare);
};
```

---

## ✅ Benefits Summary

### Before (No Auth):
- ❌ Không biết ai tạo share
- ❌ Không thể revoke
- ❌ Không có permissions
- ❌ Anyone can do anything

### After (With Auth):
- ✅ Biết ai tạo, ai edit
- ✅ Owner có thể revoke
- ✅ Có thể set permissions
- ✅ Track collaboration history
- ✅ Optional upgrade to email/Google
- ✅ Vẫn đơn giản - auto sign-in anonymous

---

## 🎯 Recommendation

**Implement theo thứ tự**:

1. ✅ **Phase 1: Anonymous Auth** (Đơn giản, đủ dùng)
   - Auto sign-in anonymous
   - Track owner
   - Basic permissions
   - Revoke share

2. ⏭️ **Phase 2: Optional Sign-In** (Nếu cần)
   - Google sign-in
   - Email sign-in
   - Profile management
   - Share with specific users

**Start với Phase 1** - đơn giản, hiệu quả, đáp ứng 90% use cases!

---

## 🎉 Next Steps

1. Setup Firebase Auth
2. Create auth service
3. Update share service with user info
4. Add permission checks
5. Update UI
6. Test
7. Deploy

Let's implement! 💪
