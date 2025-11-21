require('dotenv').config();
const { Company } = require('./models');

async function check() {
  try {
    const companies = await Company.findAll({
      attributes: ['id', 'identifier', 'name', 'is_active']
    });
    
    console.log('Companies in database:');
    companies.forEach(c => {
      console.log(`- ${c.identifier}: is_active = ${c.is_active} (type: ${typeof c.is_active})`);
    });
    
    if (companies.length === 0) {
      console.log('❌ No companies found! Run: npm run seed');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}
check();
