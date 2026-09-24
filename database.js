``javascript
/* =========================================================
   RESPECT CFW — R.P.D MDT
   DATABASE.JS
   Version corrigée / compatible avec app.js
   ========================================================= */

"use strict";

/* =========================================================
   DATABASE CONFIG
   ========================================================= */

const RPD_DATABASE_KEY = "RESPECT_CFW_RPD_DATABASE";


/* =========================================================
   RANKS
   ========================================================= */

const RPD_RANKS = [
    {
        level: 0,
        name: "Citoyen",
        permissions: []
    },
    {
        level: 1,
        name: "Cadet",
        permissions: ["dashboard"]
    },
    {
        level: 5,
        name: "Agent Stagiaire",
        permissions: ["dashboard", "citizens", "calls"]
    },
    {
        level: 10,
        name: "Officier",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications"
        ]
    },
    {
        level: 20,
        name: "Officier Senior",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications"
        ]
    },
    {
        level: 30,
        name: "Sergent",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications"
        ]
    },
    {
        level: 40,
        name: "Sergent-Chef",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications"
        ]
    },
    {
        level: 50,
        name: "Lieutenant",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users"
        ]
    },
    {
        level: 60,
        name: "Capitaine",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users"
        ]
    },
    {
        level: 70,
        name: "Commandant",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users",
            "ranks"
        ]
    },
    {
        level: 80,
        name: "Colonel",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users",
            "ranks"
        ]
    },
    {
        level: 85,
        name: "Colonel-Chef",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users",
            "ranks"
        ]
    },
    {
        level: 90,
        name: "Général",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users",
            "ranks",
            "database"
        ]
    },
    {
        level: 95,
        name: "Général de Division",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users",
            "ranks",
            "database"
        ]
    },
    {
        level: 99,
        name: "Directeur Général",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users",
            "ranks",
            "database",
            "settings"
        ]
    },
    {
        level: 100,
        name: "Chef de la Police",
        permissions: [
            "dashboard",
            "citizens",
            "officers",
            "vehicles",
            "reports",
            "calls",
            "wanted",
            "warrants",
            "tickets",
            "records",
            "operations",
            "notifications",
            "users",
            "ranks",
            "database",
            "settings"
        ]
    }
];


/* =========================================================
   DEFAULT USERS
   ========================================================= */

const DEFAULT_USERS = [
    {
        id: "USR-0001",
        username: "chief",
        password: "1234",
        name: "قائد الشرطة",
        badge: "RPD-0001",
        rankLevel: 100,

        // Compatibility avec app.js
        rank: 100,

        department: "القيادة العامة",
        status: "active",
        createdAt: new Date().toISOString()
    },

    {
        id: "USR-0002",
        username: "commander",
        password: "1234",
        name: "قائد العمليات",
        badge: "RPD-0002",
        rankLevel: 90,

        // Compatibility avec app.js
        rank: 90,

        department: "العمليات",
        status: "active",
        createdAt: new Date().toISOString()
    },

    {
        id: "USR-0003",
        username: "officer",
        password: "1234",
        name: "ضابط الشرطة",
        badge: "RPD-0010",
        rankLevel: 10,

        // Compatibility avec app.js
        rank: 10,

        department: "دوريات الشرطة",
        status: "active",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT CITIZENS
   ========================================================= */

const DEFAULT_CITIZENS = [
    {
        id: "CIT-0001",
        firstName: "محمد",
        lastName: "العربي",
        dob: "1995-04-12",
        gender: "ذكر",
        phone: "0600000000",
        address: "Los Santos",
        status: "clean",
        notes: "",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT OFFICERS
   ========================================================= */

const DEFAULT_OFFICERS = [
    {
        id: "OFF-0001",
        badge: "RPD-0001",
        name: "قائد الشرطة",
        rankLevel: 100,

        // Compatibility avec app.js
        rank: 100,

        department: "القيادة العامة",
        status: "active",
        phone: "",
        notes: "",
        createdAt: new Date().toISOString()
    },

    {
        id: "OFF-0002",
        badge: "RPD-0002",
        name: "قائد العمليات",
        rankLevel: 90,

        // Compatibility avec app.js
        rank: 90,

        department: "العمليات",
        status: "active",
        phone: "",
        notes: "",
        createdAt: new Date().toISOString()
    },

    {
        id: "OFF-0003",
        badge: "RPD-0010",
        name: "ضابط الشرطة",
        rankLevel: 10,

        // Compatibility avec app.js
        rank: 10,

        department: "دوريات الشرطة",
        status: "active",
        phone: "",
        notes: "",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT VEHICLES
   ========================================================= */

const DEFAULT_VEHICLES = [
    {
        id: "VEH-0001",
        plate: "RPD-01",
        model: "Police Cruiser",
        type: "Patrol",
        status: "available",
        assignedTo: "",
        location: "Commissariat Central",
        notes: "",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT REPORTS
   ========================================================= */

const DEFAULT_REPORTS = [
    {
        id: "REP-0001",
        title: "Rapport initial",
        type: "Général",
        officer: "قائد الشرطة",
        status: "open",
        description: "Rapport système initial.",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT CALLS
   ========================================================= */

const DEFAULT_CALLS = [
    {
        id: "CALL-0001",
        type: "Patrouille",
        priority: "normal",
        location: "Commissariat Central",
        description: "Appel système initial.",
        status: "closed",
        assignedTo: "",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT WANTED
   ========================================================= */

const DEFAULT_WANTED = [
    {
        id: "WTD-0001",
        citizenId: "",
        name: "Aucune personne recherchée",
        reason: "",
        level: "low",
        status: "inactive",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT WARRANTS
   ========================================================= */

const DEFAULT_WARRANTS = [
    {
        id: "WAR-0001",
        citizenId: "",
        name: "",
        reason: "",
        issuedBy: "قائد الشرطة",
        status: "active",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT TICKETS
   ========================================================= */

const DEFAULT_TICKETS = [
    {
        id: "TKT-0001",
        citizenId: "",
        citizenName: "",
        officer: "قائد الشرطة",
        reason: "",
        amount: 0,
        status: "paid",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT RECORDS
   ========================================================= */

const DEFAULT_RECORDS = [
    {
        id: "REC-0001",
        citizenId: "",
        citizenName: "",
        type: "system",
        title: "Enregistrement système",
        description: "",
        officer: "قائد الشرطة",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT OPERATIONS
   ========================================================= */

const DEFAULT_OPERATIONS = [
    {
        id: "OP-0001",
        name: "Opération RPD",
        type: "General",
        status: "planned",
        commander: "قائد الشرطة",
        location: "Los Santos",
        description: "Opération système initiale.",
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT NOTIFICATIONS
   ========================================================= */

const DEFAULT_NOTIFICATIONS = [
    {
        id: "NOT-0001",
        title: "Bienvenue",
        message: "Bienvenue dans RESPECT CFW — R.P.D MDT.",
        type: "info",
        read: false,
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   DEFAULT ACTIVITIES
   ========================================================= */

const DEFAULT_ACTIVITIES = [];


/* =========================================================
   CLONE HELPER
   ========================================================= */

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}


/* =========================================================
   USER NORMALIZATION
   ========================================================= */

function normalizeUser(user) {
    if (!user || typeof user !== "object") {
        return user;
    }

    const rankLevel = Number(
        user.rankLevel !== undefined
            ? user.rankLevel
            : (user.rank !== undefined ? user.rank : 0)
    );

    user.rankLevel = Number.isFinite(rankLevel) ? rankLevel : 0;

    // app.js utilise "rank"
    user.rank = user.rankLevel;

    return user;
}


/* =========================================================
   OFFICER NORMALIZATION
   ========================================================= */

function normalizeOfficer(officer) {
    if (!officer || typeof officer !== "object") {
        return officer;
    }

    const rankLevel = Number(
        officer.rankLevel !== undefined
            ? officer.rankLevel
            : (officer.rank !== undefined ? officer.rank : 0)
    );

    officer.rankLevel = Number.isFinite(rankLevel) ? rankLevel : 0;

    // app.js utilise "rank"
    officer.rank = officer.rankLevel;

    return officer;
}


/* =========================================================
   DATABASE CREATION
   ========================================================= */

function createDefaultDatabase() {

    return {
        version: "1.0.0",

        users: cloneData(DEFAULT_USERS),

        citizens: cloneData(DEFAULT_CITIZENS),

        officers: cloneData(DEFAULT_OFFICERS),

        vehicles: cloneData(DEFAULT_VEHICLES),

        reports: cloneData(DEFAULT_REPORTS),

        calls: cloneData(DEFAULT_CALLS),

        wanted: cloneData(DEFAULT_WANTED),

        warrants: cloneData(DEFAULT_WARRANTS),

        tickets: cloneData(DEFAULT_TICKETS),

        records: cloneData(DEFAULT_RECORDS),

        operations: cloneData(DEFAULT_OPERATIONS),

        notifications: cloneData(DEFAULT_NOTIFICATIONS),

        activities: cloneData(DEFAULT_ACTIVITIES),

        system: {
            name: "RESPECT CFW",
            department: "R.P.D",
            title: "R.P.D MDT",
            version: "1.0.0"
        }
    };
}


/* =========================================================
   DATABASE NORMALIZATION
   ========================================================= */

function normalizeDatabase(database) {

    if (!database || typeof database !== "object") {
        database = createDefaultDatabase();
    }

    const defaultDatabase = createDefaultDatabase();

    const collections = [
        "users",
        "citizens",
        "officers",
        "vehicles",
        "reports",
        "calls",
        "wanted",
        "warrants",
        "tickets",
        "records",
        "operations",
        "notifications",
        "activities"
    ];

    collections.forEach(function(collection) {

        if (!Array.isArray(database[collection])) {
            database[collection] = cloneData(defaultDatabase[collection]);
        }

    });


    database.users = database.users.map(normalizeUser);

    database.officers = database.officers.map(normalizeOfficer);


    if (!database.version) {
        database.version = "1.0.0";
    }


    if (!database.system || typeof database.system !== "object") {
        database.system = cloneData(defaultDatabase.system);
    }


    return database;
}


/* =========================================================
   LOAD DATABASE
   ========================================================= */

function loadDatabase() {

    try {

        const stored = localStorage.getItem(RPD_DATABASE_KEY);

        if (!stored) {

            const database = createDefaultDatabase();

            localStorage.setItem(
                RPD_DATABASE_KEY,
                JSON.stringify(database)
            );

            return database;
        }


        const database = JSON.parse(stored);

        const normalized = normalizeDatabase(database);

        localStorage.setItem(
            RPD_DATABASE_KEY,
            JSON.stringify(normalized)
        );

        return normalized;

    } catch (error) {

        console.error(
            "RPD DATABASE LOAD ERROR:",
            error
        );

        const database = createDefaultDatabase();

        try {
            localStorage.setItem(
                RPD_DATABASE_KEY,
                JSON.stringify(database)
            );
        } catch (storageError) {
            console.error(
                "RPD DATABASE STORAGE ERROR:",
                storageError
            );
        }

        return database;
    }
}


/* =========================================================
   GLOBAL DATABASE
   ========================================================= */

let RPD_DB = loadDatabase();


/* =========================================================
   SAVE DATABASE
   ========================================================= */

function saveDatabase(database) {

    try {

        const normalized = normalizeDatabase(database);

        RPD_DB = normalized;

        localStorage.setItem(
            RPD_DATABASE_KEY,
            JSON.stringify(normalized)
        );

        return true;

    } catch (error) {

        console.error(
            "RPD DATABASE SAVE ERROR:",
            error
        );

        return false;
    }
}


/* =========================================================
   GET RANK BY LEVEL
   ========================================================= */

function getRankByLevel(level) {

    const numericLevel = Number(level);

    let selectedRank = RPD_RANKS[0];

    RPD_RANKS.forEach(function(rank) {

        if (rank.level <= numericLevel) {
            selectedRank = rank;
        }

    });

    return selectedRank;
}


/* =========================================================
   GET RANK NAME
   ========================================================= */

function getRankName(level) {

    return getRankByLevel(level).name;
}


/* =========================================================
   GET USER PERMISSIONS
   ========================================================= */

function getUserPermissions(user) {

    if (!user) {
        return [];
    }

    const level = Number(
        user.rankLevel !== undefined
            ? user.rankLevel
            : user.rank
    );

    const rank = getRankByLevel(level);

    return rank.permissions || [];
}


/* =========================================================
   FIND USER
   ========================================================= */

function findUser(username, password) {

    if (!username || password === undefined || password === null) {
        return null;
    }

    const cleanUsername = String(username)
        .trim()
        .toLowerCase();

    const cleanPassword = String(password);

    const database = RPD_DB || loadDatabase();

    const users = Array.isArray(database.users)
        ? database.users
        : [];


    const user = users.find(function(item) {

        if (!item) {
            return false;
        }

        const itemUsername = String(
            item.username || ""
        )
            .trim()
            .toLowerCase();

        const itemPassword = String(
            item.password ?? ""
        );

        return (
            itemUsername === cleanUsername &&
            itemPassword === cleanPassword
        );
    });


    if (!user) {
        return null;
    }


    return normalizeUser({
        ...user
    });
}


/* =========================================================
   GENERATE ID
   ========================================================= */

function generateId(prefix, collection = []) {

    if (!Array.isArray(collection)) {
        collection = [];
    }

    let maxNumber = 0;


    collection.forEach(function(item) {

        if (!item || typeof item !== "object") {
            return;
        }

        const possibleValues = [
            item.id,
            item.badge,
            item.plate
        ];


        possibleValues.forEach(function(value) {

            if (!value) {
                return;
            }

            const match = String(value).match(
                /(\d+)$/
            );

            if (!match) {
                return;
            }

            const number = Number(match[1]);

            if (number > maxNumber) {
                maxNumber = number;
            }

        });

    });


    const nextNumber = maxNumber + 1;


    return (
        String(prefix) +
        "-" +
        String(nextNumber).padStart(4, "0")
    );
}


/* =========================================================
   RESET DATABASE STORAGE
   ========================================================= */

function resetDatabaseStorage() {

    try {

        localStorage.removeItem(
            RPD_DATABASE_KEY
        );

        RPD_DB = createDefaultDatabase();

        localStorage.setItem(
            RPD_DATABASE_KEY,
            JSON.stringify(RPD_DB)
        );

        return true;

    } catch (error) {

        console.error(
            "RPD DATABASE RESET ERROR:",
            error
        );

        return false;
    }
}


/* =========================================================
   REFRESH DATABASE
   ========================================================= */

function refreshDatabase() {

    RPD_DB = loadDatabase();

    return RPD_DB;
}


/* =========================================================
   DATABASE READY CHECK
   ========================================================= */

function isDatabaseReady() {

    return !!(
        RPD_DB &&
        Array.isArray(RPD_DB.users) &&
        Array.isArray(RPD_DB.citizens) &&
        Array.isArray(RPD_DB.officers)
    );
}


/* =========================================================
   DATABASE STARTUP LOG
   ========================================================= */

console.log(
    "RESPECT CFW — R.P.D MDT DATABASE LOADED"
);

console.log(
    "Users:",
    RPD_DB.users.length
);

console.log(
    "Citizens:",
    RPD_DB.citizens.length
);

console.log(
    "Officers:",
    RPD_DB.officers.length
);

console.log(
    "Database ready:",
    isDatabaseReady()
);
```
