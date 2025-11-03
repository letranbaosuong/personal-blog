# Hướng dẫn Set Admin Claims

Có 2 cách để set admin custom claims cho user trong Firebase.

## Cách 1: Sử dụng Service Account Key (Khuyến nghị - Đơn giản nhất)

### Bước 1: Lấy Service Account Key

1. Vào [Firebase Console](https://console.firebase.google.com)
2. Chọn project của bạn
3. Click vào biểu tượng ⚙️ (Settings) > **Project settings**
4. Chuyển sang tab **Service accounts**
5. Click nút **Generate new private key**
6. Click **Generate key** để tải file JSON xuống
7. Đổi tên file thành `serviceAccountKey.json`
8. Di chuyển file vào thư mục root của project

### Bước 2: Thêm file vào .gitignore

```bash
echo "serviceAccountKey.json" >> .gitignore
```

**LƯU Ý QUAN TRỌNG**: KHÔNG bao giờ commit file service account key lên Git!

### Bước 3: Set biến môi trường

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$PWD/serviceAccountKey.json"
```

Hoặc thêm vào file `.env.local`:

```env
GOOGLE_APPLICATION_CREDENTIALS=/đường/dẫn/đến/serviceAccountKey.json
```

### Bước 4: Chạy script

```bash
# Sử dụng email
npm run set-admin-simple admin@example.com

# Hoặc sử dụng UID
npm run set-admin-simple abc123xyz
```

---

## Cách 2: Sử dụng Firebase CLI

### Bước 1: Login Firebase CLI

```bash
firebase login
```

### Bước 2: Chọn project

```bash
firebase use YOUR_PROJECT_ID
```

Để xem danh sách projects:

```bash
firebase projects:list
```

### Bước 3: Set Application Default Credentials

**Option A: Sử dụng gcloud CLI (nếu đã cài đặt)**

```bash
gcloud auth application-default login
```

**Option B: Sử dụng Service Account Key (như Cách 1)**

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$PWD/serviceAccountKey.json"
```

### Bước 4: Chạy script interactive

```bash
npm run set-admin
```

Script sẽ hỏi bạn nhập UID hoặc email của user.

---

## Tạo Admin User từ đầu

Nếu bạn chưa có user nào trong Firebase:

### 1. Tạo user qua Firebase Console

1. Vào Firebase Console > **Authentication** > **Users**
2. Click **Add user**
3. Nhập email và password
4. Click **Add user**
5. Copy **User UID** để sử dụng

### 2. Hoặc tạo user bằng code

Tạo file `scripts/create-admin-user.js`:

```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('../serviceAccountKey.json')),
});

async function createAdminUser() {
  try {
    // Tạo user mới
    const userRecord = await admin.auth().createUser({
      email: 'admin@example.com',
      password: 'your-secure-password',
      emailVerified: true,
      displayName: 'Admin User',
    });

    console.log('✓ Đã tạo user:', userRecord.uid);

    // Set admin claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    console.log('✓ Đã set admin claim');
    console.log('\nThông tin đăng nhập:');
    console.log('  Email:', 'admin@example.com');
    console.log('  Password:', 'your-secure-password');
    console.log('  UID:', userRecord.uid);

  } catch (error) {
    console.error('Lỗi:', error.message);
  }
}

createAdminUser();
```

Chạy:

```bash
node scripts/create-admin-user.js
```

---

## Verify Admin Claims

Sau khi set admin claims, user cần **đăng xuất và đăng nhập lại**.

### Kiểm tra trong code

```typescript
import { auth } from '@/lib/firebase/config';

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const token = await user.getIdTokenResult();
    console.log('Admin:', token.claims.admin); // true nếu là admin
  }
});
```

### Kiểm tra bằng Firebase Console

1. Vào **Authentication** > **Users**
2. Click vào user
3. Xem phần **Custom claims**

---

## Troubleshooting

### Lỗi: "Cannot run login in non-interactive mode"

Chạy trực tiếp trong terminal thay vì qua script:

```bash
firebase login
```

### Lỗi: "Could not load the default credentials"

Cần set `GOOGLE_APPLICATION_CREDENTIALS`:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$PWD/serviceAccountKey.json"
```

### Lỗi: "User not found"

User chưa tồn tại trong Firebase Authentication. Tạo user trước:

```bash
# Vào Firebase Console > Authentication > Users > Add user
```

### Admin claims không có hiệu lực

User cần đăng xuất và đăng nhập lại:

```typescript
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

await signOut(auth);
// Sau đó đăng nhập lại
```

---

## Security Notes

- ⚠️ **KHÔNG** commit `serviceAccountKey.json` lên Git
- ⚠️ **KHÔNG** share service account key với người khác
- ⚠️ Thêm `serviceAccountKey.json` vào `.gitignore`
- ⚠️ Trong production, sử dụng Secret Manager thay vì file
- ⚠️ Rotate (thay đổi) service account key định kỳ

---

## Các lệnh hữu ích

```bash
# List tất cả users
npm run list-users

# Remove admin claim
npm run remove-admin USER_UID

# List tất cả admin users
npm run list-admins
```

(Cần tạo thêm các script này nếu cần)
