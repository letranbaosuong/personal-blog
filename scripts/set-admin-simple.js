const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

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
    console.log('✓ Đã khởi tạo Firebase Admin với Service Account Key');
  } else {
    // Fallback: Sử dụng Application Default Credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('✓ Đã khởi tạo Firebase Admin với Application Default Credentials');
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

// Lấy user UID hoặc email từ command line argument
const userInput = process.argv[2];

if (!userInput) {
  console.error('\n❌ Vui lòng cung cấp UID hoặc email của user:');
  console.log('\nSử dụng:');
  console.log('  npm run set-admin-simple YOUR_USER_UID');
  console.log('  npm run set-admin-simple user@example.com\n');
  process.exit(1);
}

async function setAdmin() {
  try {
    let uid = userInput;

    // Nếu input là email, tìm UID
    if (userInput.includes('@')) {
      console.log(`\nĐang tìm user với email: ${userInput}...`);
      const userRecord = await admin.auth().getUserByEmail(userInput);
      uid = userRecord.uid;
      console.log(`✓ Đã tìm thấy UID: ${uid}`);
    }

    // Set admin custom claim
    console.log(`\nĐang set admin claim cho user: ${uid}...`);
    await admin.auth().setCustomUserClaims(uid, { admin: true });

    console.log('\n✅ Đã set admin claim thành công!');

    // Verify
    const user = await admin.auth().getUser(uid);
    console.log('\nThông tin user:');
    console.log('  Email:', user.email);
    console.log('  UID:', user.uid);
    console.log('  Custom claims:', user.customClaims);

    console.log('\n📝 Lưu ý: User cần đăng xuất và đăng nhập lại để claims có hiệu lực.\n');

  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);

    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 User không tồn tại. Vui lòng tạo user trong Firebase Console trước.\n');
    } else if (error.message.includes('credential')) {
      console.log('\n💡 Cần setup Service Account Key:');
      console.log('1. Vào Firebase Console > Project Settings > Service Accounts');
      console.log('2. Click "Generate new private key"');
      console.log('3. Lưu file JSON vào thư mục project');
      console.log('4. Set biến môi trường:');
      console.log('   export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"\n');
    }

    process.exit(1);
  }
}

setAdmin();
