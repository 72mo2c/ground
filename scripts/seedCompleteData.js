// ======================================
// Seed Complete Data - بيانات تجريبية شاملة
// ======================================

const { sequelize } = require('../config/database');
const { Company, Subscription, CompanySettings, AuditLog, Admin } = require('../models');

// أسماء شركات واقعية
const companyNames = [
  'شركة النور للتكنولوجيا',
  'مؤسسة الأمل للتجارة',
  'شركة الفجر للخدمات',
  'مجموعة السلام الصناعية',
  'شركة الإبداع الرقمي',
  'مؤسسة التقدم للاستشارات',
  'شركة الأفق للتطوير',
  'مجموعة النجاح التجارية',
  'شركة البناء الحديث',
  'مؤسسة الرؤية للتسويق',
  'شركة الابتكار التقني',
  'مجموعة الازدهار للاستثمار',
  'شركة الريادة للحلول',
  'مؤسسة التميز للخدمات',
  'شركة الطموح للتطوير',
  'مجموعة الشروق للتجارة',
  'شركة المستقبل التقنية',
  'مؤسسة الإنجاز للاستشارات',
  'شركة القمة للخدمات',
  'مجموعة الثقة التجارية',
  'شركة الجودة الصناعية',
  'مؤسسة الكفاءة للتطوير',
  'شركة التطور الرقمي',
  'مجموعة الأمانة للتجارة',
  'شركة الإتقان للحلول',
  'مؤسسة الاحتراف للخدمات',
  'شركة الرقي التقنية',
  'مجموعة الفخر للاستثمار',
  'شركة الإخلاص للتطوير',
  'مؤسسة المهارة للاستشارات',
  'شركة السرعة اللوجستية',
  'مجموعة الدقة الصناعية',
  'شركة الشفافية المالية',
  'مؤسسة الكمال للخدمات',
  'شركة النجاعة التقنية',
  'مجموعة الفعالية التجارية',
  'شركة الديناميكية للتطوير',
  'مؤسسة الحيوية للتسويق',
  'شركة الطاقة الإيجابية',
  'مجموعة التحفيز للأعمال',
  'شركة الإلهام للحلول',
  'مؤسسة الشغف للتكنولوجيا',
  'شركة العزيمة للتطوير',
  'مجموعة الإصرار التجارية',
  'شركة التصميم الإبداعي',
  'مؤسسة المرونة للخدمات',
  'شركة الذكاء الاصطناعي',
  'مجموعة البيانات الضخمة',
  'شركة الأمن السيبراني',
  'مؤسسة السحابة الإلكترونية',
];

// أنواع الصناعات
const industries = [
  'تكنولوجيا',
  'تجارة',
  'صناعة',
  'خدمات',
  'تعليم',
  'صحة',
  'مالية',
  'عقارات',
  'سياحة',
  'إعلام',
];

// أنواع الخطط مع الأسعار
const planPrices = {
  basic: 29,
  standard: 79,
  premium: 149,
  enterprise: 299,
};

// دالة لتوليد بريد إلكتروني
function generateEmail(companyName) {
  const name = companyName
    .toLowerCase()
    .replace(/[أإآ]/g, 'a')
    .replace(/ب/g, 'b')
    .replace(/ت/g, 't')
    .replace(/ث/g, 'th')
    .replace(/ج/g, 'j')
    .replace(/ح/g, 'h')
    .replace(/خ/g, 'kh')
    .replace(/د/g, 'd')
    .replace(/ذ/g, 'dh')
    .replace(/ر/g, 'r')
    .replace(/ز/g, 'z')
    .replace(/س/g, 's')
    .replace(/ش/g, 'sh')
    .replace(/ص/g, 's')
    .replace(/ض/g, 'd')
    .replace(/ط/g, 't')
    .replace(/ظ/g, 'z')
    .replace(/ع/g, 'a')
    .replace(/غ/g, 'gh')
    .replace(/ف/g, 'f')
    .replace(/ق/g, 'q')
    .replace(/ك/g, 'k')
    .replace(/ل/g, 'l')
    .replace(/م/g, 'm')
    .replace(/ن/g, 'n')
    .replace(/ه/g, 'h')
    .replace(/و/g, 'w')
    .replace(/ي/g, 'y')
    .replace(/[ة]/g, 'a')
    .replace(/\s+/g, '')
    .replace(/[^a-z]/g, '');

  return `info@${name}.com`;
}

// دالة لتوليد رقم هاتف عشوائي
function generatePhone() {
  return `+966 ${Math.floor(Math.random() * 900000000 + 100000000)}`;
}

// دالة لتوليد تاريخ عشوائي
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// دالة رئيسية للبذر
async function seedCompleteData() {
  try {
    console.log('🌱 Starting comprehensive data seeding...\n');

    // الحصول على superadmin للتسجيل في AuditLog
    const superadmin = await Admin.findOne({ where: { username: 'superadmin' } });
    if (!superadmin) {
      console.error('❌ Superadmin not found. Please run seed:admins first.');
      process.exit(1);
    }

    // 1. إنشاء الشركات
    console.log('📊 Creating companies...');
    const companies = [];

    for (let i = 0; i < companyNames.length; i++) {
      const name = companyNames[i];
      const email = generateEmail(name);
      const phone = generatePhone();
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const isActive = Math.random() > 0.1; // 90% نشط

      const company = await Company.create({
        name,
        email,
        password: 'company123', // سيتم تشفيرها تلقائياً
        phone,
        address: `${Math.floor(Math.random() * 1000)} شارع الملك فهد، الرياض، المملكة العربية السعودية`,
        industry,
        website: `https://www.${email.split('@')[1]}`,
        is_active: isActive,
      });

      companies.push(company);

      // إنشاء إعدادات الشركة
      await CompanySettings.create({
        company_id: company.id,
        theme_color: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981'][
          Math.floor(Math.random() * 4)
        ],
        language: 'ar',
        timezone: 'Asia/Riyadh',
        notifications_enabled: true,
        email_notifications: true,
      });

      // تسجيل في AuditLog
      await AuditLog.log({
        admin_id: superadmin.id,
        action: 'create_company',
        entity_type: 'company',
        entity_id: company.id,
        details: `تم إنشاء شركة: ${name}`,
      });
    }

    console.log(`   ✅ Created ${companies.length} companies\n`);

    // 2. إنشاء الاشتراكات
    console.log('💳 Creating subscriptions...');
    let subscriptionsCount = 0;

    for (const company of companies) {
      // تحديد عدد الاشتراكات (1-3 لكل شركة)
      const subsCount = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < subsCount; i++) {
        const planTypes = ['basic', 'standard', 'premium', 'enterprise'];
        const planType = planTypes[Math.floor(Math.random() * planTypes.length)];
        const price = planPrices[planType];

        // تحديد تاريخ البداية (خلال السنة الماضية)
        const startDate = randomDate(
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          new Date()
        );

        // تحديد مدة الاشتراك (1-12 شهر)
        const durationMonths = Math.floor(Math.random() * 12) + 1;
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + durationMonths);

        // تحديد الحالة
        let status = 'active';
        const now = new Date();
        
        if (endDate < now) {
          status = Math.random() > 0.3 ? 'expired' : 'cancelled';
        } else if (Math.random() > 0.9) {
          status = 'cancelled';
        } else if (Math.random() > 0.95) {
          status = 'pending';
        }

        await Subscription.create({
          company_id: company.id,
          plan_type: planType,
          status,
          start_date: startDate,
          end_date: endDate,
          price,
          auto_renew: Math.random() > 0.5,
        });

        subscriptionsCount++;

        // تسجيل في AuditLog
        await AuditLog.log({
          admin_id: superadmin.id,
          action: 'create_subscription',
          entity_type: 'subscription',
          entity_id: company.id,
          details: `تم إنشاء اشتراك ${planType} للشركة: ${company.name}`,
        });
      }
    }

    console.log(`   ✅ Created ${subscriptionsCount} subscriptions\n`);

    // 3. إنشاء سجلات أنشطة إضافية
    console.log('📝 Creating audit logs...');
    const actions = [
      'login',
      'update_company',
      'view_dashboard',
      'update_subscription',
      'change_settings',
    ];

    for (let i = 0; i < 100; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];

      await AuditLog.log({
        admin_id: superadmin.id,
        action,
        entity_type: 'company',
        entity_id: company.id,
        details: `تم ${action} للشركة: ${company.name}`,
        created_at: randomDate(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          new Date()
        ),
      });
    }

    console.log('   ✅ Created 100 audit log entries\n');

    // 4. إحصائيات نهائية
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DATA SEEDING COMPLETED SUCCESSFULLY!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   • Companies: ${companies.length}`);
    console.log(`   • Subscriptions: ${subscriptionsCount}`);
    console.log(`   • Audit Logs: ${await AuditLog.count()}`);
    console.log('');
    console.log('🚀 Your admin panel is now ready with realistic data!');
    console.log('   Open: http://localhost:3001/login');
    console.log('   Username: superadmin');
    console.log('   Password: superadmin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// تشغيل البذر
seedCompleteData();
