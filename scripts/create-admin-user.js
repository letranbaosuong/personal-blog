const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Tìm service account key file
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

// Initialize Firebase Admin
try {
  if (fs.existsSync(serviceAccountPath)) {
    // Sử dụng service account key file
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✓ Đã khởi tạo Firebase Admin với Service Account Key\n');
  } else {
    // Fallback: Sử dụng Application Default Credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('✓ Đã khởi tạo Firebase Admin với Application Default Credentials\n');
  }
} catch (error) {
  console.error('\n❌ Lỗi khởi tạo Firebase Admin:', error.message);
  console.log('\n💡 Cần setup Service Account Key:');
  console.log('1. Vào Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Lưu file JSON với tên "serviceAccountKey.json" vào thư mục root của project');
  console.log('4. Hoặc set biến môi trường:');
  console.log('   export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"\n');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Tạo Admin User Mới ===\n');

// Hàm để hỏi câu hỏi
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdminUser() {
  try {
    // Lấy thông tin từ user
    const email = await question('Nhập email cho admin user: ');
    const password = await question('Nhập password (tối thiểu 6 ký tự): ');
    const displayName = await question('Nhập display name (tùy chọn, Enter để bỏ qua): ');

    // Validate
    if (!email || !email.includes('@')) {
      throw new Error('Email không hợp lệ');
    }
    if (!password || password.length < 6) {
      throw new Error('Password phải có ít nhất 6 ký tự');
    }

    console.log('\nĐang tạo user...');

    // Tạo user mới
    const userRecord = await admin.auth().createUser({
      email: email.trim(),
      password: password,
      emailVerified: true,
      displayName: displayName.trim() || 'Admin User',
    });

    console.log('✓ Đã tạo user:', userRecord.uid);

    // Set admin claim
    console.log('Đang set admin claim...');
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    console.log('\n✅ Đã tạo admin user thành công!\n');
    console.log('Thông tin đăng nhập:');
    console.log('  Email:', email.trim());
    console.log('  Password:', password);
    console.log('  UID:', userRecord.uid);
    console.log('  Display Name:', displayName.trim() || 'Admin User');
    console.log('\n📝 Lưu ý: Hãy lưu lại thông tin đăng nhập này!\n');

  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);

    if (error.code === 'auth/email-already-exists') {
      console.log('\n💡 Email này đã tồn tại. Sử dụng script set-admin để set admin claim:');
      console.log('   npm run set-admin-simple', error.message.match(/[\w\.-]+@[\w\.-]+/)?.[0] || 'EMAIL\n');
    } else if (error.code === 'auth/invalid-email') {
      console.log('\n💡 Email không hợp lệ. Vui lòng kiểm tra lại.\n');
    } else if (error.code === 'auth/invalid-password') {
      console.log('\n💡 Password phải có ít nhất 6 ký tự.\n');
    }
  } finally {
    rl.close();
    process.exit(0);
  }
}

createAdminUser();
