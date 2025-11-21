// ======================================
// Test Login Script
// نص اختبار تسجيل الدخول
// ======================================

require('dotenv').config();
const { Admin } = require('./models');
const jwt = require('jsonwebtoken');

async function testLogin() {
  console.log('🧪 Testing Admin Login System...\n');

  try {
    // 1. البحث عن superadmin
    console.log('1️⃣ Looking for superadmin account...');
    const admin = await Admin.findOne({ 
      where: { username: 'superadmin' } 
    });

    if (!admin) {
      console.log('   ❌ Superadmin not found!');
      console.log('   💡 Run: npm run seed:admins\n');
      process.exit(1);
    }

    console.log('   ✅ Superadmin found!');
    console.log('      ID:', admin.id);
    console.log('      Username:', admin.username);
    console.log('      Role:', admin.role);
    console.log('      Active:', admin.is_active);
    console.log('');

    // 2. اختبار كلمة المرور
    console.log('2️⃣ Testing password...');
    const isPasswordValid = await admin.comparePassword('superadmin123');
    
    if (!isPasswordValid) {
      console.log('   ❌ Password check failed!');
      console.log('   💡 Password might be incorrect\n');
      process.exit(1);
    }

    console.log('   ✅ Password is correct!\n');

    // 3. إنشاء توكن
    console.log('3️⃣ Generating JWT token...');
    const jwtSecret = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET;
    
    if (!jwtSecret || jwtSecret.includes('change-this')) {
      console.log('   ⚠️  Warning: JWT_SECRET is using default value!');
      console.log('   💡 Update JWT_SECRET in .env file\n');
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        role: admin.role,
        type: 'admin'
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    console.log('   ✅ Token generated successfully!');
    console.log('      Token (first 50 chars):', token.substring(0, 50) + '...');
    console.log('');

    // 4. اختبار فك تشفير التوكن
    console.log('4️⃣ Verifying token...');
    const decoded = jwt.verify(token, jwtSecret);
    
    console.log('   ✅ Token verified successfully!');
    console.log('      Decoded ID:', decoded.id);
    console.log('      Decoded Username:', decoded.username);
    console.log('      Decoded Type:', decoded.type);
    console.log('');

    // 5. النتيجة النهائية
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL TESTS PASSED!');
    console.log('');
    console.log('Login should work with:');
    console.log('   Username: superadmin');
    console.log('   Password: superadmin123');
    console.log('');
    console.log('🔗 Test it at: http://localhost:3001/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Possible issues:');
    console.log('   - Database not connected (check DATABASE_URL in .env)');
    console.log('   - Tables not created (start server first)');
    console.log('   - Admins not seeded (run: npm run seed:admins)');
    console.log('');
    process.exit(1);
  }
}

// Run test
testLogin();
