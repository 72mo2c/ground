// ======================================
// System Diagnostic Script
// نص تشخيص النظام
// ======================================

require('dotenv').config();
const { testConnection } = require('./config/database');
const { Admin } = require('./models');

console.log('🔍 Starting system diagnostic...\n');

async function runDiagnostic() {
  let hasErrors = false;

  // 1. Check Environment Variables
  console.log('📋 Checking environment variables...');
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT'
  ];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      console.log(`   ❌ ${varName} is not set`);
      hasErrors = true;
    } else if (process.env[varName].includes('username') || 
               process.env[varName].includes('change-this')) {
      console.log(`   ⚠️  ${varName} is using default value - please update!`);
      hasErrors = true;
    } else {
      console.log(`   ✅ ${varName} is configured`);
    }
  });

  // JWT_ADMIN_SECRET check
  if (!process.env.JWT_ADMIN_SECRET) {
    console.log('   ⚠️  JWT_ADMIN_SECRET is not set (using JWT_SECRET as fallback)');
  } else {
    console.log('   ✅ JWT_ADMIN_SECRET is configured');
  }

  console.log('');

  // 2. Check Database Connection
  console.log('🗄️  Testing database connection...');
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('   ✅ Database connection successful\n');
    } else {
      console.log('   ❌ Database connection failed\n');
      hasErrors = true;
      return;
    }
  } catch (error) {
    console.log('   ❌ Database connection error:', error.message);
    console.log('   💡 Check your DATABASE_URL in .env file\n');
    hasErrors = true;
    return;
  }

  // 3. Check if tables exist and admins are seeded
  console.log('👥 Checking admin accounts...');
  try {
    const adminsCount = await Admin.count();
    if (adminsCount === 0) {
      console.log('   ⚠️  No admin accounts found');
      console.log('   💡 Run: npm run seed:admins\n');
      hasErrors = true;
    } else {
      console.log(`   ✅ Found ${adminsCount} admin account(s)`);
      
      // Check for superadmin
      const superadmin = await Admin.findOne({ 
        where: { username: 'superadmin' } 
      });
      
      if (superadmin) {
        console.log('   ✅ Superadmin account exists');
        console.log('      Username: superadmin');
        console.log('      Password: superadmin123');
      } else {
        console.log('   ⚠️  Superadmin account not found');
        console.log('   💡 Run: npm run seed:admins\n');
      }
    }
  } catch (error) {
    console.log('   ❌ Error checking admins:', error.message);
    console.log('   💡 Tables might not be created yet. Start the server first.\n');
    hasErrors = true;
  }

  console.log('');

  // 4. Check CORS Configuration
  console.log('🌐 Checking CORS configuration...');
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  console.log(`   ✅ CORS_ORIGIN: ${corsOrigin}`);
  console.log('   ✅ Admin Panel Origin: http://localhost:3001 (hardcoded)\n');

  // 5. Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (hasErrors) {
    console.log('⚠️  DIAGNOSTIC RESULT: Issues found');
    console.log('   Please fix the issues above before starting the system.\n');
    console.log('📖 For detailed setup instructions, see:');
    console.log('   DATABASE_SETUP_GUIDE.md\n');
  } else {
    console.log('✅ DIAGNOSTIC RESULT: All checks passed!');
    console.log('   Your system is ready to run.\n');
    console.log('🚀 Start the system:');
    console.log('   cd ..');
    console.log('   npm run dev\n');
    console.log('🔐 Login to admin panel:');
    console.log('   URL: http://localhost:3001/login');
    console.log('   Username: superadmin');
    console.log('   Password: superadmin123\n');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(hasErrors ? 1 : 0);
}

runDiagnostic().catch(error => {
  console.error('❌ Diagnostic script error:', error);
  process.exit(1);
});
