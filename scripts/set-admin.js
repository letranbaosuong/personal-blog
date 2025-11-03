const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin
// Sử dụng Application Default Credentials từ Firebase CLI
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=== Set Admin Custom Claims ===\n');

rl.question('Nhập User UID (hoặc email): ', async (input) => {
  try {
    let uid = input.trim();

    // Nếu input là email, tìm UID
    if (input.includes('@')) {
      console.log(`\nĐang tìm user với email: ${input}...`);
      const userRecord = await admin.auth().getUserByEmail(input);
      uid = userRecord.uid;
      console.log(`Đã tìm thấy UID: ${uid}`);
    }

    // Set admin custom claim
    console.log(`\nĐang set admin claim cho user: ${uid}...`);
    await admin.auth().setCustomUserClaims(uid, { admin: true });

    console.log('\n✅ Đã set admin claim thành công!');

    // Verify
    const user = await admin.auth().getUser(uid);
    console.log('\nCustom claims hiện tại:', user.customClaims);

    console.log('\n📝 Lưu ý: User cần đăng xuất và đăng nhập lại để claims có hiệu lực.\n');

  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
});
