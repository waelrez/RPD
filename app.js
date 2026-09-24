``javascript``
/* =========================================================
   RESPECT CFW — R.P.D MDT
   app.js
   نظام إدارة الشرطة — نسخة GitHub Pages
   ========================================================= */

"use strict";

/* =========================
   الحالة العامة
========================= */

let currentUser = null;
let currentPage = "dashboard";

/* =========================
   توافق قاعدة البيانات والإصلاحات
========================= */

function getUserRank(user) {
    return Number(user?.rankLevel ?? user?.rank ?? 0);
}

function normalizeUser(user) {
    if (!user || typeof user !== "object") return user;

    const rank = getUserRank(user);

    return {
        ...user,
        rank,
        rankLevel: rank
    };
}

function normalizeDatabase(database) {
    const db = database && typeof database === "object"
        ? database
        : {};

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

    collections.forEach(key => {
        if (!Array.isArray(db[key])) {
            db[key] = [];
        }
    });

    if (!db.settings || typeof db.settings !== "object") {
        db.settings = {
            notifications: true
        };
    }

    if (
        typeof db.settings.notifications !==
        "boolean"
    ) {
        db.settings.notifications = true;
    }

    db.users = db.users.map(normalizeUser);
    db.officers = db.officers.map(normalizeUser);

    return db;
}

function getAppDatabase() {
    const db = normalizeDatabase(
        loadDatabase()
    );

    if (typeof RPD_DB !== "undefined") {
        RPD_DB = db;
    }

    return db;
}

function makeId(prefix) {
    const map = {
        CIT: "citizens",
        VEH: "vehicles",
        RPT: "reports",
        CALL: "calls",
        WNT: "wanted",
        WAR: "warrants",
        TIC: "tickets",
        REC: "records",
        OP: "operations",
        NOT: "notifications",
        ACT: "activities",
        USR: "users",
        RPD: "users"
    };

    const db = getAppDatabase();

    const collection =
        db[map[prefix]] || [];

    if (typeof generateId === "function") {
        return generateId(
            prefix,
            collection
        );
    }

    const number =
        collection.length + 1;

    return (
        `${prefix}-` +
        String(number).padStart(4, "0")
    );
}

function databaseReady() {
    return (
        typeof loadDatabase === "function" &&
        typeof saveDatabase === "function" &&
        typeof findUser === "function" &&
        typeof getRankName === "function" &&
        typeof getRankByLevel === "function"
    );
}

/* =========================
   أدوات عامة
========================= */

function $(id) {
    return document.getElementById(id);
}

function escapeHTML(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function now() {
    return new Date().toLocaleString(
        "ar-MA",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

function today() {
    return new Date().toLocaleDateString(
        "ar-MA"
    );
}

function showMessage(
    message,
    type = "success"
) {
    let box = $("rpd-message");

    if (!box) {
        box = document.createElement(
            "div"
        );

        box.id = "rpd-message";

        box.style.position = "fixed";
        box.style.left = "20px";
        box.style.bottom = "20px";
        box.style.zIndex = "99999";
        box.style.padding = "14px 20px";
        box.style.borderRadius = "12px";
        box.style.color = "#fff";
        box.style.fontWeight = "700";
        box.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.4)";
        box.style.transition =
            "opacity .3s";

        document.body.appendChild(box);
    }

    box.style.background =
        type === "danger"
            ? "#b91c1c"
            : type === "warning"
            ? "#a16207"
            : "#15803d";

    box.textContent = message;
    box.style.opacity = "1";

    clearTimeout(
        window.rpdMessageTimer
    );

    window.rpdMessageTimer =
        setTimeout(() => {
            box.style.opacity = "0";
        }, 3000);
}

/* =========================
   الجلسة
========================= */

function saveSession(user) {
    sessionStorage.setItem(
        "RESPECT_CFW_RPD_SESSION",
        JSON.stringify(
            normalizeUser(user)
        )
    );
}

function getSession() {
    try {
        const data =
            sessionStorage.getItem(
                "RESPECT_CFW_RPD_SESSION"
            );

        return data
            ? normalizeUser(
                  JSON.parse(data)
              )
            : null;
    } catch {
        return null;
    }
}

function clearSession() {
    sessionStorage.removeItem(
        "RESPECT_CFW_RPD_SESSION"
    );
}

/* =========================
   تسجيل الدخول
========================= */

function login() {
    if (!databaseReady()) {
        console.error(
            "database.js لم يتم تحميله قبل app.js"
        );

        showMessage(
            "خطأ: database.js غير محمل. تأكد من ترتيب الملفات في index.html",
            "danger"
        );

        return;
    }

    const username =
        $("username")?.value.trim();

    const password =
        $("password")?.value;

    if (!username || !password) {
        showMessage(
            "يرجى إدخال اسم المستخدم وكلمة المرور",
            "warning"
        );

        return;
    }

    const user =
        findUser(
            username,
            password
        );

    if (!user) {
        showMessage(
            "بيانات الدخول غير صحيحة",
            "danger"
        );

        return;
    }

    currentUser =
        normalizeUser(user);

    saveSession(currentUser);

    const loginScreen =
        $("login-screen");

    const app =
        $("app");

    if (loginScreen) {
        loginScreen.style.display =
            "none";
    }

    if (app) {
        app.style.display =
            "flex";
    }

    updateCurrentUser();

    addActivity(
        "تسجيل دخول",
        `${user.name} قام بتسجيل الدخول إلى النظام`
    );

    renderAll();

    showMessage(
        `مرحباً ${user.name} — ${getRankName(
            getUserRank(user)
        )}`
    );
}

/* =========================
   تسجيل الخروج
========================= */

function logout() {
    if (
        !confirm(
            "هل تريد فعلاً تسجيل الخروج من نظام R.P.D؟"
        )
    ) {
        return;
    }

    if (currentUser) {
        addActivity(
            "تسجيل خروج",
            `${currentUser.name} قام بتسجيل الخروج`
        );
    }

    clearSession();

    currentUser = null;

    location.reload();
}

/* =========================
   المستخدم الحالي
========================= */

function updateCurrentUser() {
    if (!currentUser) return;

    const rankName =
        getRankName(
            getUserRank(
                currentUser
            )
        );

    const elements = [
        "current-user",
        "user-name",
        "profile-name"
    ];

    elements.forEach(id => {
        const el = $(id);

        if (el) {
            el.textContent =
                currentUser.name;
        }
    });

    const rankElements = [
        "current-rank",
        "user-rank",
        "profile-rank"
    ];

    rankElements.forEach(id => {
        const el = $(id);

        if (el) {
            el.textContent =
                rankName;
        }
    });

    const badge =
        $("user-badge");

    if (badge) {
        badge.textContent =
            currentUser.badge ||
            "RPD-0000";
    }

    const date =
        $("current-date");

    if (date) {
        date.textContent =
            today();
    }
}

/* =========================
   التنقل
========================= */

const PAGE_PERMISSIONS = {
    dashboard: 0,
    citizens: 0,
    officers: 5,
    vehicles: 5,
    reports: 10,
    calls: 10,
    wanted: 20,
    warrants: 20,
    tickets: 10,
    records: 20,
    operations: 30,
    notifications: 0,
    database: 50,
    users: 85,
    ranks: 90,
    settings: 0
};

function hasPermission(page) {
    if (!currentUser) {
        return false;
    }

    const required =
        PAGE_PERMISSIONS[page] ?? 0;

    return (
        getUserRank(
            currentUser
        ) >= required
    );
}

function openPage(page) {
    if (!currentUser) return;

    if (!hasPermission(page)) {
        showMessage(
            "ليست لديك الصلاحية للوصول إلى هذه الصفحة",
            "danger"
        );

        return;
    }

    currentPage = page;

    document
        .querySelectorAll(".page")
        .forEach(p => {
            p.style.display = "none";
            p.classList.remove(
                "active"
            );
        });

    const target =
        $(`page-${page}`);

    if (target) {
        target.style.display =
            "block";

        target.classList.add(
            "active"
        );
    }

    document
        .querySelectorAll(
            ".sidebar button, .nav-btn"
        )
        .forEach(btn => {
            btn.classList.remove(
                "active"
            );

            const onclick =
                btn.getAttribute(
                    "onclick"
                ) || "";

            if (
                onclick.includes(
                    `openPage('${page}')`
                ) ||
                onclick.includes(
                    `openPage("${page}")`
                )
            ) {
                btn.classList.add(
                    "active"
                );
            }
        });

    renderPage(page);
}

function renderPage(page) {
    switch (page) {
        case "dashboard":
            renderDashboard();
            break;

        case "citizens":
            renderCitizens();
            break;

        case "officers":
            renderOfficers();
            break;

        case "vehicles":
            renderVehicles();
            break;

        case "reports":
            renderReports();
            break;

        case "calls":
            renderCalls();
            break;

        case "wanted":
            renderWanted();
            break;

        case "warrants":
            renderWarrants();
            break;

        case "tickets":
            renderTickets();
            break;

        case "records":
            renderRecords();
            break;

        case "operations":
            renderOperations();
            break;

        case "notifications":
            renderNotifications();
            break;

        case "database":
            renderDatabase();
            break;

        case "users":
            renderUsers();
            break;

        case "ranks":
            renderRanks();
            break;

        case "settings":
            renderSettings();
            break;
    }
}

/* =========================
   لوحة التحكم
========================= */

function renderDashboard() {
    const db =
        getAppDatabase();

    setText(
        "stat-citizens",
        db.citizens.length
    );

    setText(
        "stat-officers",
        db.officers.length
    );

    setText(
        "stat-vehicles",
        db.vehicles.length
    );

    setText(
        "stat-reports",
        db.reports.length
    );

    setText(
        "stat-calls",
        db.calls.length
    );

    setText(
        "stat-wanted",
        db.wanted.length
    );

    setText(
        "stat-warrants",
        db.warrants.length
    );

    setText(
        "stat-tickets",
        db.tickets.length
    );

    setText(
        "stat-records",
        db.records.length
    );

    setText(
        "stat-operations",
        db.operations.length
    );

    renderActivities();
    renderSystemStatus();
}

function renderSystemStatus() {
    setText(
        "system-status",
        "النظام يعمل"
    );

    setText(
        "database-status",
        "متصل محلياً"
    );
}

/* =========================
   النشاطات
========================= */

function renderActivities() {
    const db =
        getAppDatabase();

    const container =
        $("activity-list") ||
        $("activities-list") ||
        $("dashboard-activities");

    if (!container) return;

    const activities =
        db.activities || [];

    if (!activities.length) {
        container.innerHTML =
            `<div class="empty">لا توجد نشاطات</div>`;

        return;
    }

    container.innerHTML =
        activities
            .slice()
            .reverse()
            .slice(0, 20)
            .map(a => `
                <div class="activity-item">
                    <div>
                        <strong>
                            ${escapeHTML(
                                a.title ||
                                a.text ||
                                "نشاط"
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                a.description ||
                                ""
                            )}
                        </p>
                    </div>

                    <small>
                        ${escapeHTML(
                            a.date ||
                            a.time ||
                            "-"
                        )}
                    </small>
                </div>
            `)
            .join("");
}

/* =========================
   المواطنون
========================= */

function renderCitizens(list = null) {
    const db =
        getAppDatabase();

    const citizens =
        list || db.citizens || [];

    const tbody =
        $("citizens-table-body");

    if (!tbody) return;

    if (!citizens.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    لا توجد بيانات مواطنين
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        citizens.map(c => `
            <tr>
                <td>
                    ${escapeHTML(c.id)}
                </td>

                <td>
                    ${escapeHTML(c.name)}
                </td>

                <td>
                    ${escapeHTML(
                        c.age || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        c.gender || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        c.phone || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        c.city ||
                        c.address ||
                        "-"
                    )}
                </td>

                <td>
                    <span class="badge ${
                        c.status === "مطلوب"
                            ? "danger"
                            : "success"
                    }">
                        ${escapeHTML(
                            c.status ||
                            "عادي"
                        )}
                    </span>
                </td>

                <td>
                    <button
                        onclick="viewCitizen('${escapeHTML(
                            c.id
                        )}')"
                    >
                        عرض
                    </button>
                </td>
            </tr>
        `).join("");
}

function searchCitizens() {
    const input =
        $("citizen-search");

    if (!input) return;

    const query =
        input.value
            .trim()
            .toLowerCase();

    const db =
        getAppDatabase();

    const result =
        (db.citizens || [])
            .filter(c =>
                [
                    c.id,
                    c.name,
                    c.phone,
                    c.city,
                    c.address,
                    c.nationalId
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query)
            );

    renderCitizens(result);
}

function openCitizenModal() {
    const modal =
        $("citizen-modal");

    if (modal) {
        modal.style.display =
            "flex";
    }
}

function addCitizen() {
    if (
        !hasPermission(
            "citizens"
        )
    ) {
        return;
    }

    const name =
        $("citizen-name")
            ?.value
            .trim();

    const nationalId =
        $("citizen-national-id")
            ?.value
            .trim();

    const age =
        $("citizen-age")
            ?.value;

    const gender =
        $("citizen-gender")
            ?.value;

    const phone =
        $("citizen-phone")
            ?.value
            .trim();

    const city =
        $("citizen-city")
            ?.value
            .trim();

    if (!name) {
        showMessage(
            "اسم المواطن مطلوب",
            "warning"
        );

        return;
    }

    const db =
        getAppDatabase();

    const citizen = {
        id: makeId("CIT"),
        name,
        nationalId,
        age,
        gender,
        phone,
        city,
        address: city,
        status: "عادي",
        createdAt: now(),
        createdBy:
            currentUser.name
    };

    db.citizens.push(
        citizen
    );

    saveDatabase(db);

    addActivity(
        "مواطن جديد",
        `تم تسجيل المواطن ${name}`
    );

    closeModal(
        "citizen-modal"
    );

    clearForm(
        "citizen-modal"
    );

    renderCitizens();
    renderDashboard();

    showMessage(
        "تم تسجيل المواطن بنجاح"
    );
}

function viewCitizen(id) {
    const db =
        getAppDatabase();

    const c =
        db.citizens.find(
            x => x.id === id
        );

    if (!c) return;

    alert(
`ملف المواطن

المعرف: ${c.id}
الاسم: ${c.name}
العمر: ${c.age || "-"}
الجنس: ${c.gender || "-"}
الهاتف: ${c.phone || "-"}
المدينة: ${c.city || c.address || "-"}
الحالة: ${c.status || "-"}
الترخيص: ${c.license || "-"}
السجل الجنائي: ${
        c.criminalRecord
            ? "نعم"
            : "لا"
    }
الملاحظات: ${c.notes || "-"}` 
    );
}

/* =========================
   الضباط
========================= */

function renderOfficers(list = null) {
    const db =
        getAppDatabase();

    const officers =
        list || db.officers || [];

    const tbody =
        $("officers-table-body");

    if (!tbody) return;

    if (!officers.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    لا توجد بيانات ضباط
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        officers.map(o => {
            const rank =
                getUserRank(o);

            return `
                <tr>
                    <td>
                        ${escapeHTML(
                            o.badge || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            o.name || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            getRankName(
                                rank
                            )
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            o.department ||
                            "-"
                        )}
                    </td>

                    <td>
                        <span class="badge">
                            ${escapeHTML(
                                o.status ||
                                "-"
                            )}
                        </span>
                    </td>

                    <td>
                        ${escapeHTML(
                            o.service ||
                            "-"
                        )}
                    </td>

                    <td>
                        <button
                            onclick="viewOfficer('${escapeHTML(
                                o.badge || ""
                            )}')"
                        >
                            عرض
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
}

function searchOfficers() {
    const input =
        $("officer-search");

    if (!input) return;

    const query =
        input.value
            .trim()
            .toLowerCase();

    const db =
        getAppDatabase();

    const result =
        (db.officers || [])
            .filter(o =>
                [
                    o.badge,
                    o.name,
                    o.department,
                    getRankName(
                        getUserRank(o)
                    )
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query)
            );

    renderOfficers(result);
}

function viewOfficer(badge) {
    const db =
        getAppDatabase();

    const o =
        db.officers.find(
            x => x.badge === badge
        );

    if (!o) return;

    alert(
`ملف الضابط

الشارة: ${o.badge || "-"}
الاسم: ${o.name || "-"}
الرتبة: ${getRankName(
        getUserRank(o)
    )}
القسم: ${o.department || "-"}
الحالة: ${o.status || "-"}
الخدمة: ${o.service || "-"}` 
    );
}

/* =========================
   المركبات
========================= */

function renderVehicles(list = null) {
    const db =
        getAppDatabase();

    const vehicles =
        list || db.vehicles || [];

    const tbody =
        $("vehicles-table-body");

    if (!tbody) return;

    if (!vehicles.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    لا توجد مركبات
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        vehicles.map(v => `
            <tr>
                <td>
                    ${escapeHTML(
                        v.plate || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        v.model || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        v.color || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        v.type || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        v.owner || "-"
                    )}
                </td>

                <td>
                    <span class="badge">
                        ${escapeHTML(
                            v.status ||
                            "غير معروف"
                        )}
                    </span>
                </td>

                <td>
                    ${escapeHTML(
                        v.insurance ||
                        "-"
                    )}
                </td>

                <td>
                    <button
                        onclick="viewVehicle('${escapeHTML(
                            v.id ||
                            v.plate ||
                            ""
                        )}')"
                    >
                        عرض
                    </button>
                </td>
            </tr>
        `).join("");
}

function searchVehicles() {
    const input =
        $("vehicle-search");

    if (!input) return;

    const query =
        input.value
            .trim()
            .toLowerCase();

    const db =
        getAppDatabase();

    const result =
        (db.vehicles || [])
            .filter(v =>
                [
                    v.id,
                    v.plate,
                    v.model,
                    v.owner,
                    v.color
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query)
            );

    renderVehicles(result);
}

function openVehicleModal() {
    const modal =
        $("vehicle-modal");

    if (modal) {
        modal.style.display =
            "flex";
    }
}

function addVehicle() {
    const plate =
        $("vehicle-plate")
            ?.value
            .trim();

    const model =
        $("vehicle-model")
            ?.value
            .trim();

    const color =
        $("vehicle-color")
            ?.value
            .trim();

    const type =
        $("vehicle-type")
            ?.value;

    const owner =
        $("vehicle-owner")
            ?.value
            .trim();

    if (!plate || !model) {
        showMessage(
            "رقم اللوحة ونوع المركبة مطلوبان",
            "warning"
        );

        return;
    }

    const db =
        getAppDatabase();

    const vehicle = {
        id: makeId("VEH"),
        plate,
        model,
        color,
        type,
        owner,
        status: "نشطة",
        insurance: "سارية",
        createdAt: now()
    };

    db.vehicles.push(
        vehicle
    );

    saveDatabase(db);

    addActivity(
        "إضافة مركبة",
        `تم تسجيل المركبة ${plate}`
    );

    closeModal(
        "vehicle-modal"
    );

    clearForm(
        "vehicle-modal"
    );

    renderVehicles();
    renderDashboard();

    showMessage(
        "تم تسجيل المركبة بنجاح"
    );
}

function viewVehicle(id) {
    const db =
        getAppDatabase();

    const v =
        db.vehicles.find(
            x =>
                x.id === id ||
                x.plate === id
        );

    if (!v) return;

    alert(
`ملف المركبة

المعرف: ${v.id || "-"}
اللوحة: ${v.plate || "-"}
الموديل: ${v.model || "-"}
اللون: ${v.color || "-"}
النوع: ${v.type || "-"}
المالك: ${v.owner || "-"}
الحالة: ${v.status || "-"}
التأمين: ${v.insurance || "-"}` 
    );
}

/* =========================
   التقارير
========================= */

function renderReports() {
    const db =
        getAppDatabase();

    const tbody =
        $("reports-table-body");

    if (!tbody) return;

    const reports =
        db.reports || [];

    if (!reports.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    لا توجد تقارير
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        reports.map(r => `
            <tr>
                <td>
                    ${escapeHTML(
                        r.id
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        r.title ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        r.type ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        r.location ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        r.officer ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        r.date ||
                        "-"
                    )}
                </td>

                <td>
                    <span class="badge">
                        ${escapeHTML(
                            r.status ||
                            "مفتوح"
                        )}
                    </span>
                </td>

                <td>
                    <button
                        onclick="viewReport('${escapeHTML(
                            r.id
                        )}')"
                    >
                        عرض
                    </button>
                </td>
            </tr>
        `).join("");
}

function openReportModal() {
    const modal =
        $("report-modal");

    if (modal) {
        modal.style.display =
            "flex";
    }
}

function addReport() {
    const title =
        $("report-title")
            ?.value
            .trim();

    const type =
        $("report-type")
            ?.value;

    const location =
        $("report-location")
            ?.value
            .trim();

    const description =
        $("report-description")
            ?.value
            .trim();

    if (!title || !description) {
        showMessage(
            "العنوان ووصف التقرير مطلوبان",
            "warning"
        );

        return;
    }

    const db =
        getAppDatabase();

    const report = {
        id: makeId("RPT"),
        title,
        type,
        location,
        description,
        officer:
            currentUser?.name ||
            "-",
        date: now(),
        status: "مفتوح"
    };

    db.reports.push(
        report
    );

    saveDatabase(db);

    addActivity(
        "تقرير جديد",
        `تم إنشاء التقرير ${report.id}`
    );

    closeModal(
        "report-modal"
    );

    clearForm(
        "report-modal"
    );

    renderReports();
    renderDashboard();

    showMessage(
        "تم إنشاء التقرير بنجاح"
    );
}

function viewReport(id) {
    const db =
        getAppDatabase();

    const r =
        db.reports.find(
            x => x.id === id
        );

    if (!r) return;

    alert(
`التقرير

المعرف: ${r.id}
العنوان: ${r.title || "-"}
النوع: ${r.type || "-"}
الموقع: ${r.location || "-"}
الضابط: ${r.officer || "-"}
التاريخ: ${r.date || "-"}
الحالة: ${r.status || "-"}
الوصف:

${r.description || "-"}` 
    );
}

/* =========================
   البلاغات
========================= */

function renderCalls() {
    const db =
        getAppDatabase();

    const container =
        $("calls-container") ||
        $("calls-list");

    if (!container) return;

    const calls =
        db.calls || [];

    if (!calls.length) {
        container.innerHTML =
            `<div class="empty">لا توجد بلاغات حالياً</div>`;

        return;
    }

    container.innerHTML =
        calls.map(c => `
            <div class="call-card">

                <div>
                    <strong>
                        ${escapeHTML(
                            c.title ||
                            "بلاغ"
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            c.description ||
                            ""
                        )}
                    </p>
                </div>

                <div>
                    <span class="badge ${
                        c.status ===
                        "مغلق"
                            ? "success"
                            : "danger"
                    }">
                        ${escapeHTML(
                            c.status ||
                            "جديد"
                        )}
                    </span>
                </div>

                <small>
                    ${escapeHTML(
                        c.location ||
                        "-"
                    )}

                    —

                    ${escapeHTML(
                        c.date ||
                        c.createdAt ||
                        "-"
                    )}
                </small>

            </div>
        `).join("");
}

function openCallModal() {
    const modal =
        $("call-modal");

    if (modal) {
        modal.style.display =
            "flex";
    }
}

function addCall() {
    const title =
        $("call-title")
            ?.value
            .trim();

    const location =
        $("call-location")
            ?.value
            .trim();

    const priority =
        $("call-priority")
            ?.value;

    const description =
        $("call-description")
            ?.value
            .trim();

    if (!title && !description) {
        showMessage(
            "أدخل عنوان أو وصف البلاغ",
            "warning"
        );

        return;
    }

    const db =
        getAppDatabase();

    const call = {
        id: makeId("CALL"),
        title:
            title ||
            "بلاغ جديد",
        location,
        priority:
            priority ||
            "متوسطة",
        description,
        status: "نشط",
        createdAt: now(),
        date: now(),
        assignedOfficer: ""
    };

    db.calls.push(
        call
    );

    saveDatabase(db);

    addActivity(
        "بلاغ جديد",
        `تم تسجيل البلاغ ${call.id}`
    );

    closeModal(
        "call-modal"
    );

    clearForm(
        "call-modal"
    );

    renderCalls();
    renderDashboard();

    showMessage(
        "تم تسجيل البلاغ بنجاح"
    );
}

/* =========================
   المطلوبون
========================= */

function renderWanted() {
    const db =
        getAppDatabase();

    const tbody =
        $("wanted-table-body");

    const container =
        $("wanted-container");

    const wanted =
        db.wanted || [];

    if (tbody) {
        if (!wanted.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        لا توجد سجلات مطلوبين
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML =
                wanted.map(w => `
                    <tr>
                        <td>
                            ${escapeHTML(
                                w.id ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                w.name ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                w.danger ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                w.reason ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                w.date ||
                                "-"
                            )}
                        </td>

                        <td>
                            <span class="badge danger">
                                ${escapeHTML(
                                    w.status ||
                                    "مطلوب"
                                )}
                            </span>
                        </td>

                        <td>
                            <button
                                onclick="viewWanted('${escapeHTML(
                                    w.id
                                )}')"
                            >
                                عرض
                            </button>
                        </td>
                    </tr>
                `).join("");
        }

        return;
    }

    if (!container) return;

    if (!wanted.length) {
        container.innerHTML =
            `<div class="empty">لا توجد سجلات مطلوبين</div>`;

        return;
    }

    container.innerHTML =
        wanted.map(w => `
            <div class="wanted-card">
                <strong>
                    ${escapeHTML(
                        w.name ||
                        "-"
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        w.reason ||
                        "-"
                    )}
                </p>

                <span class="badge danger">
                    ${escapeHTML(
                        w.status ||
                        "مطلوب"
                    )}
                </span>
            </div>
        `).join("");
}

function viewWanted(id) {
    const db =
        getAppDatabase();

    const w =
        db.wanted.find(
            x => x.id === id
        );

    if (!w) return;

    alert(
`ملف المطلوب

المعرف: ${w.id || "-"}
الاسم: ${w.name || "-"}
درجة الخطورة: ${w.danger || "-"}
السبب: ${w.reason || "-"}
التاريخ: ${w.date || "-"}
الحالة: ${w.status || "-"}` 
    );
}

/* =========================
   المذكرات
========================= */

function renderWarrants() {
    const db =
        getAppDatabase();

    const tbody =
        $("warrants-table-body");

    const container =
        $("warrants-container");

    const warrants =
        db.warrants || [];

    if (tbody) {
        if (!warrants.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        لا توجد مذكرات
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML =
                warrants.map(w => `
                    <tr>
                        <td>
                            ${escapeHTML(
                                w.id ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                w.person ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                w.type ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                w.authority ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                w.date ||
                                "-"
                            )}
                        </td>

                        <td>
                            <span class="badge">
                                ${escapeHTML(
                                    w.status ||
                                    "-"
                                )}
                            </span>
                        </td>

                        <td>
                            <button
                                onclick="viewWarrant('${escapeHTML(
                                    w.id
                                )}')"
                            >
                                عرض
                            </button>
                        </td>
                    </tr>
                `).join("");
        }

        return;
    }

    if (!container) return;

    if (!warrants.length) {
        container.innerHTML =
            `<div class="empty">لا توجد مذكرات</div>`;

        return;
    }

    container.innerHTML =
        warrants.map(w => `
            <div class="warrant-card">
                <strong>
                    ${escapeHTML(
                        w.person ||
                        "-"
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        w.type ||
                        "-"
                    )}
                </p>

                <span class="badge">
                    ${escapeHTML(
                        w.status ||
                        "-"
                    )}
                </span>
            </div>
        `).join("");
}

function viewWarrant(id) {
    const db =
        getAppDatabase();

    const w =
        db.warrants.find(
            x => x.id === id
        );

    if (!w) return;

    alert(
`المذكرة

المعرف: ${w.id || "-"}
الشخص: ${w.person || "-"}
النوع: ${w.type || "-"}
الجهة: ${w.authority || "-"}
التاريخ: ${w.date || "-"}
الحالة: ${w.status || "-"}` 
    );
}

/* =========================
   المخالفات
========================= */

function renderTickets() {
    const db =
        getAppDatabase();

    const tbody =
        $("tickets-table-body");

    const container =
        $("tickets-container");

    const tickets =
        db.tickets || [];

    if (tbody) {
        if (!tickets.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        لا توجد مخالفات
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML =
                tickets.map(t => `
                    <tr>
                        <td>
                            ${escapeHTML(
                                t.id ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                t.citizen ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                t.type ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                t.fine ??
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                t.officer ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                t.date ||
                                "-"
                            )}
                        </td>

                        <td>
                            <button
                                onclick="viewTicket('${escapeHTML(
                                    t.id
                                )}')"
                            >
                                عرض
                            </button>
                        </td>
                    </tr>
                `).join("");
        }

        return;
    }

    if (!container) return;

    if (!tickets.length) {
        container.innerHTML =
            `<div class="empty">لا توجد مخالفات</div>`;

        return;
    }

    container.innerHTML =
        tickets.map(t => `
            <div class="ticket-card">
                <strong>
                    ${escapeHTML(
                        t.citizen ||
                        "-"
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        t.type ||
                        "-"
                    )}
                </p>

                <span>
                    ${escapeHTML(
                        t.fine ??
                        "-"
                    )}
                </span>
            </div>
        `).join("");
}

function viewTicket(id) {
    const db =
        getAppDatabase();

    const t =
        db.tickets.find(
            x => x.id === id
        );

    if (!t) return;

    alert(
`المخالفة

المعرف: ${t.id || "-"}
المواطن: ${t.citizen || "-"}
النوع: ${t.type || "-"}
الغرامة: ${t.fine ?? "-"}
الضابط: ${t.officer || "-"}
التاريخ: ${t.date || "-"}` 
    );
}

/* =========================
   السجلات الجنائية
========================= */

function renderRecords() {
    const db =
        getAppDatabase();

    const tbody =
        $("records-table-body");

    const container =
        $("records-container");

    const records =
        db.records || [];

    if (tbody) {
        if (!records.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        لا توجد سجلات جنائية
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML =
                records.map(r => `
                    <tr>
                        <td>
                            ${escapeHTML(
                                r.id ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                r.citizen ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                r.citizenId ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                r.category ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                r.description ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                r.date ||
                                "-"
                            )}
                        </td>

                        <td>
                            <span class="badge">
                                ${escapeHTML(
                                    r.status ||
                                    "-"
                                )}
                            </span>
                        </td>
                    </tr>
                `).join("");
        }

        return;
    }

    if (!container) return;

    if (!records.length) {
        container.innerHTML =
            `<div class="empty">لا توجد سجلات جنائية</div>`;

        return;
    }

    container.innerHTML =
        records.map(r => `
            <div class="record-card">
                <strong>
                    ${escapeHTML(
                        r.citizen ||
                        "-"
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        r.description ||
                        "-"
                    )}
                </p>

                <small>
                    ${escapeHTML(
                        r.date ||
                        "-"
                    )}
                </small>
            </div>
        `).join("");
}

/* =========================
   العمليات
========================= */

function renderOperations() {
    const db =
        getAppDatabase();

    const tbody =
        $("operations-table-body");

    const container =
        $("operations-container");

    const operations =
        db.operations || [];

    if (tbody) {
        if (!operations.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        لا توجد عمليات
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML =
                operations.map(o => `
                    <tr>
                        <td>
                            ${escapeHTML(
                                o.id ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                o.name ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                o.location ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                o.commander ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                o.units ??
                                "-"
                            )}
                        </td>

                        <td>
                            <span class="badge">
                                ${escapeHTML(
                                    o.status ||
                                    "-"
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHTML(
                                o.start ||
                                "-"
                            )}
                        </td>
                    </tr>
                `).join("");
        }

        return;
    }

    if (!container) return;

    if (!operations.length) {
        container.innerHTML =
            `<div class="empty">لا توجد عمليات</div>`;

        return;
    }

    container.innerHTML =
        operations.map(o => `
            <div class="operation-card">
                <strong>
                    ${escapeHTML(
                        o.name ||
                        "-"
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        o.location ||
                        "-"
                    )}
                </p>

                <span class="badge">
                    ${escapeHTML(
                        o.status ||
                        "-"
                    )}
                </span>
            </div>
        `).join("");
}

/* =========================
   الإشعارات
========================= */

function renderNotifications() {
    const db =
        getAppDatabase();

    const container =
        $("notifications-container") ||
        $("notifications-list");

    if (!container) return;

    const notifications =
        db.notifications || [];

    if (!notifications.length) {
        container.innerHTML =
            `<div class="empty">لا توجد إشعارات</div>`;

        return;
    }

    container.innerHTML =
        notifications
            .slice()
            .reverse()
            .map(n => `
                <div class="notification-card ${
                    n.read
                        ? "read"
                        : "unread"
                }">

                    <strong>
                        ${escapeHTML(
                            n.title ||
                            "إشعار"
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            n.message ||
                            ""
                        )}
                    </p>

                    <small>
                        ${escapeHTML(
                            n.date ||
                            "-"
                        )}
                    </small>

                </div>
            `)
            .join("");
}

/* =========================
   قاعدة البيانات
========================= */

function renderDatabase() {
    const db =
        getAppDatabase();

    setText(
        "database-version",
        db.version ||
        "2026.1"
    );

    setText(
        "database-size",
        JSON.stringify(db).length
    );

    setText(
        "database-users",
        db.users.length
    );

    setText(
        "database-citizens",
        db.citizens.length
    );

    setText(
        "database-officers",
        db.officers.length
    );

    setText(
        "database-vehicles",
        db.vehicles.length
    );
}

function exportDatabase() {
    if (
        !currentUser ||
        getUserRank(
            currentUser
        ) < 50
    ) {
        showMessage(
            "ليس لديك صلاحية تصدير قاعدة البيانات",
            "danger"
        );

        return;
    }

    const db =
        getAppDatabase();

    const blob =
        new Blob(
            [
                JSON.stringify(
                    db,
                    null,
                    4
                )
            ],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;
    a.download =
        "RESPECT_CFW_RPD_DATABASE.json";

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(
        url
    );

    showMessage(
        "تم تصدير قاعدة البيانات"
    );
}

function resetDatabase() {
    if (
        !currentUser ||
        getUserRank(
            currentUser
        ) < 100
    ) {
        showMessage(
            "هذه العملية مخصصة لقائد الشرطة فقط",
            "danger"
        );

        return;
    }

    const confirmReset =
        confirm(
            "تحذير: سيتم حذف البيانات المحلية وإرجاع قاعدة البيانات للوضع الافتراضي. هل تريد المتابعة؟"
        );

    if (!confirmReset) {
        return;
    }

    if (
        typeof resetDatabaseStorage ===
        "function"
    ) {
        resetDatabaseStorage();
    } else {
        localStorage.removeItem(
            "RESPECT_CFW_RPD_DATABASE"
        );
    }

    showMessage(
        "تمت إعادة ضبط قاعدة البيانات",
        "success"
    );

    setTimeout(
        () => location.reload(),
        700
    );
}

/* =========================
   المستخدمون
========================= */

function renderUsers() {
    const db =
        getAppDatabase();

    const tbody =
        $("users-table-body");

    if (!tbody) return;

    const users =
        db.users || [];

    if (!users.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    لا توجد حسابات
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        users.map(u => `
            <tr>
                <td>
                    ${escapeHTML(
                        u.id ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        u.username ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        u.name ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        getRankName(
                            getUserRank(u)
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        u.department ||
                        "-"
                    )}
                </td>

                <td>
                    <span class="badge">
                        ${escapeHTML(
                            u.status ||
                            "-"
                        )}
                    </span>
                </td>

                <td>
                    ${escapeHTML(
                        u.badge ||
                        "-"
                    )}
                </td>
            </tr>
        `).join("");
}

function openUserModal() {
    if (
        !currentUser ||
        getUserRank(
            currentUser
        ) < 85
    ) {
        showMessage(
            "هذه العملية مخصصة للرتب العليا",
            "danger"
        );

        return;
    }

    const existing =
        $("dynamic-user-modal");

    if (existing) {
        existing.style.display =
            "flex";

        return;
    }

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "dynamic-user-modal";

    modal.className =
        "modal";

    modal.innerHTML = `
        <div class="modal-content">

            <div class="modal-header">
                <h2>
                    إنشاء مستخدم جديد
                </h2>

                <button
                    onclick="closeModal('dynamic-user-modal')"
                >
                    ×
                </button>
            </div>

            <div class="modal-body">

                <input
                    id="new-user-username"
                    placeholder="اسم المستخدم"
                >

                <input
                    id="new-user-name"
                    placeholder="الاسم"
                >

                <input
                    id="new-user-password"
                    type="password"
                    placeholder="كلمة المرور"
                >

                <input
                    id="new-user-rank"
                    type="number"
                    min="0"
                    max="100"
                    value="10"
                    placeholder="مستوى الرتبة"
                >

                <input
                    id="new-user-department"
                    placeholder="القسم"
                >

            </div>

            <button
                class="primary-btn"
                onclick="addUser()"
            >
                إنشاء المستخدم
            </button>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    modal.style.display =
        "flex";
}

function addUser() {
    if (
        !currentUser ||
        getUserRank(
            currentUser
        ) < 85
    ) {
        showMessage(
            "هذه العملية مخصصة للرتب العليا",
            "danger"
        );

        return;
    }

    const username =
        $("new-user-username")
            ?.value
            .trim();

    const name =
        $("new-user-name")
            ?.value
            .trim();

    const password =
        $("new-user-password")
            ?.value;

    const rank =
        Number(
            $("new-user-rank")
                ?.value || 0
        );

    const department =
        $("new-user-department")
            ?.value
            .trim();

    if (
        !username ||
        !name ||
        !password
    ) {
        showMessage(
            "يرجى ملء البيانات الأساسية",
            "warning"
        );

        return;
    }

    if (
        rank < 0 ||
        rank > 100
    ) {
        showMessage(
            "الرتبة يجب أن تكون بين 0 و100",
            "warning"
        );

        return;
    }

    if (
        rank >=
        getUserRank(
            currentUser
        )
    ) {
        showMessage(
            "لا يمكنك إنشاء مستخدم برتبة مساوية أو أعلى من رتبتك",
            "danger"
        );

        return;
    }

    const db =
        getAppDatabase();

    if (
        db.users.some(
            u =>
                u.username ===
                username
        )
    ) {
        showMessage(
            "اسم المستخدم موجود مسبقاً",
            "danger"
        );

        return;
    }

    const user = {
        id: makeId("USR"),
        username,
        password,
        name,
        rank,
        rankLevel: rank,
        badge: makeId("RPD"),
        department:
            department ||
            "غير محدد",
        status: "فعال",
        createdAt: now()
    };

    db.users.push(
        user
    );

    saveDatabase(db);

    addActivity(
        "مستخدم جديد",
        `تم إنشاء المستخدم ${username}`
    );

    closeModal(
        "dynamic-user-modal"
    );

    renderUsers();

    showMessage(
        "تم إنشاء المستخدم بنجاح"
    );
}

/* =========================
   الرتب 0 → 100
========================= */

function renderRanks() {
    const container =
        $("ranks-grid");

    if (!container) return;

    let html = "";

    for (
        let level = 0;
        level <= 100;
        level++
    ) {
        const rank =
            getRankByLevel(
                level
            );

        const isCurrent =
            currentUser &&
            getUserRank(
                currentUser
            ) === level;

        html += `
            <div class="rank-card ${
                isCurrent
                    ? "current-rank"
                    : ""
            }">

                <div class="rank-level">
                    ${level}
                </div>

                <div class="rank-name">
                    ${escapeHTML(
                        rank.name
                    )}
                </div>

                <div class="rank-permissions">
                    ${escapeHTML(
                        rank.permissions?.join(
                            " • "
                        ) ||
                        "صلاحيات أساسية"
                    )}
                </div>

            </div>
        `;
    }

    container.innerHTML =
        html;
}

/* =========================
   الإعدادات
========================= */

function renderSettings() {
    const db =
        getAppDatabase();

    const notifications =
        $("notifications-toggle");

    if (notifications) {
        notifications.checked =
            db.settings.notifications !==
            false;
    }
}

function toggleNotifications() {
    const db =
        getAppDatabase();

    const input =
        $("notifications-toggle");

    db.settings.notifications =
        input
            ? input.checked
            : !db.settings
                .notifications;

    saveDatabase(db);

    showMessage(
        db.settings.notifications
            ? "تم تفعيل الإشعارات"
            : "تم تعطيل الإشعارات"
    );
}

function toggleTheme() {
    document.body.classList.toggle(
        "light-mode"
    );

    const light =
        document.body.classList.contains(
            "light-mode"
        );

    localStorage.setItem(
        "RPD_LIGHT_MODE",
        light ? "1" : "0"
    );

    if (light) {
        applyLightMode();
    } else {
        removeLightMode();
    }
}

function applyLightMode() {
    let style =
        $("rpd-light-style");

    if (!style) {
        style =
            document.createElement(
                "style"
            );

        style.id =
            "rpd-light-style";

        document.head.appendChild(
            style
        );
    }

    style.textContent = `
        body.light-mode {
            --bg: #eef2f7;
            --panel: #ffffff;
            --panel2: #f3f4f6;
            --text: #111827;
            --muted: #64748b;
            --border: #d1d5db;
        }

        body.light-mode .sidebar,
        body.light-mode .topbar,
        body.light-mode .modal-content {
            color: var(--text);
        }
    `;
}

function removeLightMode() {
    const style =
        $("rpd-light-style");

    if (style) {
        style.remove();
    }
}

function loadTheme() {
    if (
        localStorage.getItem(
            "RPD_LIGHT_MODE"
        ) === "1"
    ) {
        document.body.classList.add(
            "light-mode"
        );

        applyLightMode();
    }
}

/* =========================
   النوافذ
========================= */

function closeModal(id) {
    const modal =
        $(id);

    if (!modal) return;

    modal.style.display =
        "none";

    if (
        id ===
        "dynamic-user-modal"
    ) {
        setTimeout(
            () => {
                modal.remove();
            },
            300
        );
    }
}

function clearForm(modalId) {
    const modal =
        $(modalId);

    if (!modal) return;

    modal
        .querySelectorAll(
            "input, textarea, select"
        )
        .forEach(el => {
            if (
                el.type !==
                "button"
            ) {
                el.value = "";
            }
        });
}

/* إغلاق النافذة عند الضغط خارجها */

document.addEventListener(
    "click",
    event => {
        if (
            event.target.classList.contains(
                "modal"
            )
        ) {
            event.target.style.display =
                "none";
        }
    }
);

/* =========================
   الأنشطة
========================= */

function addActivity(
    title,
    description
) {
    try {
        const db =
            getAppDatabase();

        if (!db.activities) {
            db.activities = [];
        }

        db.activities.push({
            id: makeId("ACT"),
            title,
            description,
            date: now(),
            user:
                currentUser?.name ||
                "النظام"
        });

        if (
            db.activities.length >
            100
        ) {
            db.activities =
                db.activities.slice(
                    -100
                );
        }

        saveDatabase(db);
    } catch (error) {
        console.error(
            "Activity error:",
            error
        );
    }
}

/* =========================
   أدوات DOM
========================= */

function setText(
    id,
    value
) {
    const el = $(id);

    if (el) {
        el.textContent =
            value;
    }
}

/* =========================
   تحديث كل شيء
========================= */

function renderAll() {
    if (!databaseReady()) {
        return;
    }

    renderDashboard();
    renderCitizens();
    renderOfficers();
    renderVehicles();
    renderReports();
    renderCalls();
    renderWanted();
    renderWarrants();
    renderTickets();
    renderRecords();
    renderOperations();
    renderNotifications();
    renderDatabase();
    renderUsers();
    renderRanks();
    renderSettings();

    openPage(
        currentPage ||
        "dashboard"
    );
}

/* =========================
   الاختصارات
========================= */

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key ===
            "Escape"
        ) {
            document
                .querySelectorAll(
                    ".modal"
                )
                .forEach(
                    modal => {
                        modal.style.display =
                            "none";
                    }
                );
        }

        if (
            event.ctrlKey &&
            event.key.toLowerCase() ===
                "k"
        ) {
            event.preventDefault();

            const search =
                $("citizen-search");

            if (search) {
                search.focus();
            }
        }
    }
);

/* =========================
   تشغيل النظام
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadTheme();

        if (!databaseReady()) {
            console.error(
                "RESPECT CFW: database.js غير محمل أو فيه خطأ."
            );

            showMessage(
                "خطأ: ملف database.js غير محمل. يجب تحميله قبل app.js",
                "danger"
            );
        }

        const session =
            getSession();

        if (
            session &&
            databaseReady()
        ) {
            currentUser =
                normalizeUser(
                    session
                );

            const loginScreen =
                $("login-screen");

            const app =
                $("app");

            if (loginScreen) {
                loginScreen.style.display =
                    "none";
            }

            if (app) {
                app.style.display =
                    "flex";
            }

            updateCurrentUser();

            renderAll();
        } else {
            const loginScreen =
                $("login-screen");

            const app =
                $("app");

            if (loginScreen) {
                loginScreen.style.display =
                    "flex";
            }

            if (app) {
                app.style.display =
                    "none";
            }
        }

        /* Enter لتسجيل الدخول */

        const password =
            $("password");

        if (password) {
            password.addEventListener(
                "keydown",
                event => {
                    if (
                        event.key ===
                        "Enter"
                    ) {
                        login();
                    }
                }
            );
        }

        const username =
            $("username");

        if (username) {
            username.addEventListener(
                "keydown",
                event => {
                    if (
                        event.key ===
                        "Enter"
                    ) {
                        login();
                    }
                }
            );
        }
    }
);

/* =========================================================
   نهاية R.P.D MDT
   RESPECT CFW
========================================================= */
```
