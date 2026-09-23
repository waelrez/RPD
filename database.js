```javascript
/* =========================================================
   RESPECT CFW — R.P.D MDT
   قاعدة البيانات المحلية
========================================================= */

const RPD_DATABASE_KEY = "RESPECT_CFW_RPD_DATABASE";

/* =========================================================
   الرتب 0 → 100
========================================================= */

const RPD_RANKS = [

    {
        level: 0,
        name: "مواطن",
        permissions: ["عرض الملف الشخصي"]
    },

    {
        level: 1,
        name: "متدرب شرطة",
        permissions: ["عرض بيانات أساسية"]
    },

    {
        level: 5,
        name: "شرطي مستجد",
        permissions: [
            "البحث عن المواطنين",
            "البحث عن المركبات"
        ]
    },

    {
        level: 10,
        name: "شرطي",
        permissions: [
            "البحث عن المواطنين",
            "البحث عن المركبات",
            "إنشاء التقارير",
            "استقبال البلاغات"
        ]
    },

    {
        level: 20,
        name: "شرطي أول",
        permissions: [
            "إدارة التقارير",
            "إدارة البلاغات",
            "البحث المتقدم"
        ]
    },

    {
        level: 30,
        name: "عريف",
        permissions: [
            "إدارة الدوريات",
            "مراجعة التقارير"
        ]
    },

    {
        level: 40,
        name: "رقيب",
        permissions: [
            "إدارة الضباط التابعين",
            "اعتماد التقارير",
            "إدارة العمليات"
        ]
    },

    {
        level: 50,
        name: "رقيب أول",
        permissions: [
            "إدارة الوحدات",
            "إدارة العمليات",
            "مراجعة السجلات"
        ]
    },

    {
        level: 60,
        name: "ملازم",
        permissions: [
            "إدارة قسم",
            "إدارة الضباط",
            "إدارة العمليات",
            "إدارة البلاغات"
        ]
    },

    {
        level: 70,
        name: "نقيب",
        permissions: [
            "إدارة الأقسام",
            "إدارة الضباط",
            "إدارة العمليات",
            "إدارة السجلات"
        ]
    },

    {
        level: 80,
        name: "رائد",
        permissions: [
            "إدارة القيادة",
            "إدارة المستخدمين",
            "إدارة الأقسام",
            "إدارة العمليات"
        ]
    },

    {
        level: 85,
        name: "مقدم",
        permissions: [
            "إدارة القيادة",
            "إدارة المستخدمين",
            "إدارة الرتب",
            "إدارة قاعدة البيانات"
        ]
    },

    {
        level: 90,
        name: "عقيد",
        permissions: [
            "صلاحيات القيادة العليا",
            "إدارة المستخدمين",
            "إدارة الرتب",
            "إدارة قاعدة البيانات"
        ]
    },

    {
        level: 95,
        name: "عميد",
        permissions: [
            "القيادة العليا",
            "الإدارة الكاملة"
        ]
    },

    {
        level: 99,
        name: "نائب قائد الشرطة",
        permissions: [
            "إدارة النظام",
            "إدارة القيادة",
            "إدارة المستخدمين",
            "إدارة الرتب",
            "إدارة قاعدة البيانات"
        ]
    },

    {
        level: 100,
        name: "قائد الشرطة",
        permissions: [
            "صلاحية كاملة للنظام",
            "إدارة جميع المستخدمين",
            "إدارة جميع الرتب",
            "إدارة قاعدة البيانات",
            "إدارة القيادة"
        ]
    }

];


/* =========================================================
   الحسابات
========================================================= */

const DEFAULT_USERS = [

    {
        id: "USR-0001",
        username: "chief",
        password: "1234",

        name: "قائد الشرطة",
        badge: "RPD-0001",

        rankLevel: 100,
        department: "القيادة العامة",

        status: "متصل"
    },

    {
        id: "USR-0002",
        username: "commander",
        password: "1234",

        name: "مدير العمليات",
        badge: "RPD-0090",

        rankLevel: 90,
        department: "العمليات",

        status: "متصل"
    },

    {
        id: "USR-0003",
        username: "officer",
        password: "1234",

        name: "محمد العلوي",
        badge: "RPD-1025",

        rankLevel: 10,
        department: "الدوريات",

        status: "متصل"
    }

];


/* =========================================================
   المواطنون
========================================================= */

const DEFAULT_CITIZENS = [

    {
        id: "CIT-1001",
        name: "ياسين بنعلي",
        age: 28,
        phone: "0600000001",

        license: "سارية",

        address: "المدينة المركزية",

        criminalRecord: false,

        notes: ""
    },

    {
        id: "CIT-1002",
        name: "سامي الإدريسي",
        age: 34,
        phone: "0600000002",

        license: "سارية",

        address: "المنطقة الشمالية",

        criminalRecord: true,

        notes: "لديه سجل سابق"
    },

    {
        id: "CIT-1003",
        name: "أمين المرابط",
        age: 22,
        phone: "0600000003",

        license: "منتهية",

        address: "المنطقة الشرقية",

        criminalRecord: false,

        notes: ""
    }

];


/* =========================================================
   الضباط
========================================================= */

const DEFAULT_OFFICERS = [

    {
        badge: "RPD-0001",

        name: "قائد الشرطة",

        rankLevel: 100,

        department: "القيادة العامة",

        status: "متصل",

        service: "قيادة"
    },

    {
        badge: "RPD-0090",

        name: "مدير العمليات",

        rankLevel: 90,

        department: "العمليات",

        status: "متصل",

        service: "قيادة"
    },

    {
        badge: "RPD-1025",

        name: "محمد العلوي",

        rankLevel: 10,

        department: "الدوريات",

        status: "متصل",

        service: "دورية"
    },

    {
        badge: "RPD-1042",

        name: "عمر السالمي",

        rankLevel: 20,

        department: "المرور",

        status: "غير متصل",

        service: "مرور"
    }

];


/* =========================================================
   المركبات
========================================================= */

const DEFAULT_VEHICLES = [

    {
        plate: "RPD-01",
        model: "دورية الشرطة",
        color: "أبيض وأسود",
        owner: "شرطة R.P.D",
        status: "نشطة"
    },

    {
        plate: "RPD-02",
        model: "سيارة دورية",
        color: "أسود",
        owner: "شرطة R.P.D",
        status: "نشطة"
    },

    {
        plate: "ABC-245",
        model: "مركبة مدنية",
        color: "رمادي",
        owner: "ياسين بنعلي",
        status: "سليمة"
    },

    {
        plate: "XYZ-731",
        model: "مركبة مدنية",
        color: "أزرق",
        owner: "سامي الإدريسي",
        status: "مطلوبة للفحص"
    }

];


/* =========================================================
   التقارير
========================================================= */

const DEFAULT_REPORTS = [

    {
        id: "REP-0001",

        type: "دورية",

        officer: "RPD-1025",

        date: "2026-09-23",

        status: "مغلق",

        description:
            "تم تنفيذ دورية اعتيادية في المنطقة المركزية."
    },

    {
        id: "REP-0002",

        type: "تحقيق",

        officer: "RPD-0090",

        date: "2026-09-23",

        status: "قيد المراجعة",

        description:
            "ملف تحقيق مفتوح للمراجعة."
    }

];


/* =========================================================
   البلاغات
========================================================= */

const DEFAULT_CALLS = [

    {
        id: "CALL-001",

        location: "المنطقة المركزية",

        priority: "عالية",

        description:
            "بلاغ يحتاج إلى استجابة دورية.",

        status: "نشط",

        createdAt: "2026-09-23 16:20",

        assignedOfficer: "RPD-1025"
    },

    {
        id: "CALL-002",

        location: "المنطقة الشمالية",

        priority: "متوسطة",

        description:
            "بلاغ مروري.",

        status: "نشط",

        createdAt: "2026-09-23 16:45",

        assignedOfficer: ""
    }

];


/* =========================================================
   المطلوبون
========================================================= */

const DEFAULT_WANTED = [

    {
        id: "WNT-001",

        name: "سجل تجريبي",

        danger: "متوسطة",

        reason: "تحقيق مفتوح",

        date: "2026-09-22",

        status: "مطلوب"
    }

];


/* =========================================================
   المذكرات
========================================================= */

const DEFAULT_WARRANTS = [

    {
        id: "WAR-001",

        person: "سجل تجريبي",

        type: "مذكرة بحث",

        authority: "إدارة التحقيقات",

        date: "2026-09-22",

        status: "سارية"
    }

];


/* =========================================================
   المخالفات
========================================================= */

const DEFAULT_TICKETS = [

    {
        id: "TIC-001",

        citizen: "ياسين بنعلي",

        type: "تجاوز السرعة",

        fine: 500,

        officer: "RPD-1025",

        date: "2026-09-21"
    },

    {
        id: "TIC-002",

        citizen: "أمين المرابط",

        type: "وقوف غير قانوني",

        fine: 300,

        officer: "RPD-1042",

        date: "2026-09-22"
    }

];


/* =========================================================
   السجلات الجنائية
========================================================= */

const DEFAULT_RECORDS = [

    {
        id: "REC-001",

        citizen: "سامي الإدريسي",

        citizenId: "CIT-1002",

        category: "سجل سابق",

        description:
            "بيانات تجريبية للسجل الجنائي.",

        date: "2026-08-14",

        status: "مسجل"
    }

];


/* =========================================================
   العمليات
========================================================= */

const DEFAULT_OPERATIONS = [

    {
        id: "OP-001",

        name: "عملية الدوريات المركزية",

        location: "المنطقة المركزية",

        commander: "RPD-0090",

        units: 4,

        status: "نشطة",

        start: "2026-09-23 15:00"
    }

];


/* =========================================================
   الإشعارات
========================================================= */

const DEFAULT_NOTIFICATIONS = [

    {
        id: "NOT-001",

        title: "النظام",

        message:
            "تم تشغيل نظام RESPECT CFW — R.P.D MDT.",

        type: "نظام",

        date: "2026-09-23 17:00",

        read: false
    },

    {
        id: "NOT-002",

        title: "بلاغ جديد",

        message:
            "يوجد بلاغ جديد يحتاج إلى استجابة.",

        type: "بلاغ",

        date: "2026-09-23 16:45",

        read: false
    }

];


/* =========================================================
   النشاطات
========================================================= */

const DEFAULT_ACTIVITIES = [

    {
        icon: "🚨",
        text: "تم تسجيل بلاغ جديد",
        time: "منذ دقائق"
    },

    {
        icon: "📋",
        text: "تم إنشاء تقرير شرطة",
        time: "منذ 20 دقيقة"
    },

    {
        icon: "👮",
        text: "دخل ضابط إلى النظام",
        time: "منذ 30 دقيقة"
    },

    {
        icon: "🚔",
        text: "تم تحديث بيانات مركبة",
        time: "منذ ساعة"
    }

];


/* =========================================================
   إنشاء قاعدة البيانات
========================================================= */

function createDefaultDatabase() {

    return {

        version: "2026.1",

        system: {
            name: "RESPECT CFW",
            department: "R.P.D",
            title: "محطة البيانات المتنقلة",
            language: "ar",
            direction: "rtl"
        },

        users: JSON.parse(
            JSON.stringify(DEFAULT_USERS)
        ),

        citizens: JSON.parse(
            JSON.stringify(DEFAULT_CITIZENS)
        ),

        officers: JSON.parse(
            JSON.stringify(DEFAULT_OFFICERS)
        ),

        vehicles: JSON.parse(
            JSON.stringify(DEFAULT_VEHICLES)
        ),

        reports: JSON.parse(
            JSON.stringify(DEFAULT_REPORTS)
        ),

        calls: JSON.parse(
            JSON.stringify(DEFAULT_CALLS)
        ),

        wanted: JSON.parse(
            JSON.stringify(DEFAULT_WANTED)
        ),

        warrants: JSON.parse(
            JSON.stringify(DEFAULT_WARRANTS)
        ),

        tickets: JSON.parse(
            JSON.stringify(DEFAULT_TICKETS)
        ),

        records: JSON.parse(
            JSON.stringify(DEFAULT_RECORDS)
        ),

        operations: JSON.parse(
            JSON.stringify(DEFAULT_OPERATIONS)
        ),

        notifications: JSON.parse(
            JSON.stringify(DEFAULT_NOTIFICATIONS)
        ),

        activities: JSON.parse(
            JSON.stringify(DEFAULT_ACTIVITIES)
        )

    };
}


/* =========================================================
   تحميل قاعدة البيانات
========================================================= */

function loadDatabase() {

    const saved = localStorage.getItem(
        RPD_DATABASE_KEY
    );

    if (!saved) {

        const database =
            createDefaultDatabase();

        localStorage.setItem(
            RPD_DATABASE_KEY,
            JSON.stringify(database)
        );

        return database;
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "خطأ في قراءة قاعدة البيانات:",
            error
        );

        const database =
            createDefaultDatabase();

        localStorage.setItem(
            RPD_DATABASE_KEY,
            JSON.stringify(database)
        );

        return database;
    }
}


/* =========================================================
   حفظ قاعدة البيانات
========================================================= */

function saveDatabase(database) {

    localStorage.setItem(
        RPD_DATABASE_KEY,
        JSON.stringify(database)
    );
}


/* =========================================================
   قاعدة البيانات الحالية
========================================================= */

let RPD_DB = loadDatabase();


/* =========================================================
   البحث عن الرتبة
========================================================= */

function getRankByLevel(level) {

    let selectedRank = RPD_RANKS[0];

    for (const rank of RPD_RANKS) {

        if (level >= rank.level) {
            selectedRank = rank;
        }

    }

    return selectedRank;
}


/* =========================================================
   اسم الرتبة
========================================================= */

function getRankName(level) {

    return getRankByLevel(level).name;
}


/* =========================================================
   صلاحيات المستخدم
========================================================= */

function getUserPermissions(level) {

    return getRankByLevel(level).permissions;
}


/* =========================================================
   البحث عن مستخدم
========================================================= */

function findUser(username, password) {

    return RPD_DB.users.find(user =>

        (
            user.username === username ||
            user.badge === username
        )

        &&

        user.password === password

    );
}


/* =========================================================
   إنشاء معرف جديد
========================================================= */

function generateId(prefix, collection) {

    const number =
        collection.length + 1;

    return (
        prefix +
        "-" +
        String(number).padStart(4, "0")
    );
}


/* =========================================================
   إعادة ضبط قاعدة البيانات
========================================================= */

function resetDatabaseStorage() {

    const database =
        createDefaultDatabase();

    localStorage.setItem(
        RPD_DATABASE_KEY,
        JSON.stringify(database)
    );

    RPD_DB = database;

    return database;
}
```
