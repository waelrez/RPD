```javascript
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
   أدوات عامة
========================= */

function $(id) {
    return document.getElementById(id);
}

function escapeHTML(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function now() {
    return new Date().toLocaleString("ar-MA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function today() {
    return new Date().toLocaleDateString("ar-MA");
}

function showMessage(message, type = "success") {
    let box = $("rpd-message");

    if (!box) {
        box = document.createElement("div");
        box.id = "rpd-message";

        box.style.position = "fixed";
        box.style.left = "20px";
        box.style.bottom = "20px";
        box.style.zIndex = "99999";
        box.style.padding = "14px 20px";
        box.style.borderRadius = "12px";
        box.style.color = "#fff";
        box.style.fontWeight = "700";
        box.style.boxShadow = "0 10px 30px rgba(0,0,0,.4)";
        box.style.transition = "opacity .3s";

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

    clearTimeout(window.rpdMessageTimer);

    window.rpdMessageTimer = setTimeout(() => {
        box.style.opacity = "0";
    }, 3000);
}

/* =========================
   الجلسة
========================= */

function saveSession(user) {
    sessionStorage.setItem(
        "RESPECT_CFW_RPD_SESSION",
        JSON.stringify(user)
    );
}

function getSession() {
    try {
        const data = sessionStorage.getItem(
            "RESPECT_CFW_RPD_SESSION"
        );

        return data ? JSON.parse(data) : null;
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
    const username = $("username")?.value.trim();
    const password = $("password")?.value;

    if (!username || !password) {
        showMessage("يرجى إدخال اسم المستخدم وكلمة المرور", "warning");
        return;
    }

    const user = findUser(username, password);

    if (!user) {
        showMessage("بيانات الدخول غير صحيحة", "danger");
        return;
    }

    currentUser = user;
    saveSession(user);

    const loginScreen = $("login-screen");
    const app = $("app");

    if (loginScreen) loginScreen.style.display = "none";
    if (app) app.style.display = "flex";

    updateCurrentUser();
    addActivity(
        "تسجيل دخول",
        `${user.name} قام بتسجيل الدخول إلى النظام`
    );

    renderAll();

    showMessage(
        `مرحباً ${user.name} — ${getRankName(user.rank)}`
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

    const rankName = getRankName(currentUser.rank);

    const elements = [
        "current-user",
        "user-name",
        "profile-name"
    ];

    elements.forEach(id => {
        const el = $(id);
        if (el) el.textContent = currentUser.name;
    });

    const rankElements = [
        "current-rank",
        "user-rank",
        "profile-rank"
    ];

    rankElements.forEach(id => {
        const el = $(id);
        if (el) el.textContent = rankName;
    });

    const badge = $("user-badge");

    if (badge) {
        badge.textContent =
            currentUser.badge || "RPD-0000";
    }

    const date = $("current-date");

    if (date) {
        date.textContent = today();
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
    if (!currentUser) return false;

    const required =
        PAGE_PERMISSIONS[page] ?? 0;

    return Number(currentUser.rank) >= required;
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

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none";
        p.classList.remove("active");
    });

    const target = $(`page-${page}`);

    if (target) {
        target.style.display = "block";
        target.classList.add("active");
    }

    document.querySelectorAll(
        ".sidebar button, .nav-btn"
    ).forEach(btn => {
        btn.classList.remove("active");

        const onclick = btn.getAttribute("onclick") || "";

        if (
            onclick.includes(`openPage('${page}')`) ||
            onclick.includes(`openPage("${page}")`)
        ) {
            btn.classList.add("active");
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
   لوحة القيادة
========================= */

function renderDashboard() {
    const db = loadDatabase();

    setText(
        "stat-officers",
        db.officers?.length || 0
    );

    setText(
        "stat-citizens",
        db.citizens?.length || 0
    );

    setText(
        "stat-vehicles",
        db.vehicles?.length || 0
    );

    setText(
        "stat-calls",
        db.calls?.filter(
            c => c.status !== "مغلق"
        ).length || 0
    );

    setText(
        "online-officers",
        db.officers?.filter(
            o =>
                o.status === "متصل" ||
                o.status === "في الخدمة"
        ).length || 0
    );

    renderActivity();
    renderSystemStatus();
}

function renderActivity() {
    const db = loadDatabase();
    const container =
        $("activity-list");

    if (!container) return;

    const activities =
        (db.activities || [])
            .slice()
            .reverse()
            .slice(0, 10);

    if (!activities.length) {
        container.innerHTML =
            `<div class="empty">لا توجد أنشطة حالياً</div>`;
        return;
    }

    container.innerHTML = activities.map(a => `
        <div class="activity-item">
            <strong>${escapeHTML(a.title)}</strong>
            <span>${escapeHTML(a.description)}</span>
            <small>${escapeHTML(a.date || "")}</small>
        </div>
    `).join("");
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
   المواطنين
========================= */

function renderCitizens(list = null) {
    const db = loadDatabase();

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

    tbody.innerHTML = citizens.map(c => `
        <tr>
            <td>${escapeHTML(c.id)}</td>
            <td>${escapeHTML(c.name)}</td>
            <td>${escapeHTML(c.age || "-")}</td>
            <td>${escapeHTML(c.gender || "-")}</td>
            <td>${escapeHTML(c.phone || "-")}</td>
            <td>${escapeHTML(c.city || "-")}</td>
            <td>
                <span class="badge ${
                    c.status === "مطلوب"
                        ? "danger"
                        : "success"
                }">
                    ${escapeHTML(c.status || "عادي")}
                </span>
            </td>
            <td>
                <button onclick="viewCitizen('${escapeHTML(c.id)}')">
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
        input.value.trim().toLowerCase();

    const db = loadDatabase();

    const result =
        (db.citizens || []).filter(c =>
            [
                c.id,
                c.name,
                c.phone,
                c.city,
                c.nationalId
            ]
                .join(" ")
                .toLowerCase()
                .includes(query)
        );

    renderCitizens(result);
}

function openCitizenModal() {
    const modal = $("citizen-modal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function addCitizen() {
    if (!hasPermission("citizens")) return;

    const name =
        $("citizen-name")?.value.trim();

    const nationalId =
        $("citizen-national-id")?.value.trim();

    const age =
        $("citizen-age")?.value;

    const gender =
        $("citizen-gender")?.value;

    const phone =
        $("citizen-phone")?.value.trim();

    const city =
        $("citizen-city")?.value.trim();

    if (!name) {
        showMessage(
            "اسم المواطن مطلوب",
            "warning"
        );
        return;
    }

    const db = loadDatabase();

    const citizen = {
        id: generateId("CIT"),
        name,
        nationalId,
        age,
        gender,
        phone,
        city,
        status: "عادي",
        createdAt: now(),
        createdBy: currentUser.name
    };

    db.citizens.push(citizen);

    saveDatabase(db);

    addActivity(
        "إضافة مواطن",
        `تمت إضافة المواطن ${name}`
    );

    closeModal("citizen-modal");

    clearForm("citizen-modal");

    renderCitizens();

    renderDashboard();

    showMessage(
        "تمت إضافة المواطن بنجاح"
    );
}

function viewCitizen(id) {
    const db = loadDatabase();

    const c =
        db.citizens.find(x => x.id === id);

    if (!c) return;

    alert(
`ملف المواطن

المعرف: ${c.id}
الاسم: ${c.name}
رقم الهوية: ${c.nationalId || "-"}
العمر: ${c.age || "-"}
الجنس: ${c.gender || "-"}
الهاتف: ${c.phone || "-"}
المدينة: ${c.city || "-"}
الحالة: ${c.status || "-"}
تاريخ التسجيل: ${c.createdAt || "-"}`
    );
}

/* =========================
   الضباط
========================= */

function renderOfficers() {
    const db = loadDatabase();

    const tbody =
        $("officers-table-body");

    if (!tbody) return;

    const officers =
        db.officers || [];

    if (!officers.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    لا توجد بيانات ضباط
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = officers.map(o => `
        <tr>
            <td>${escapeHTML(o.badge || o.id)}</td>
            <td>${escapeHTML(o.name)}</td>
            <td>${escapeHTML(getRankName(o.rank))}</td>
            <td>${escapeHTML(o.department || "-")}</td>
            <td>${escapeHTML(o.phone || "-")}</td>
            <td>
                <span class="badge ${
                    o.status === "متصل" ||
                    o.status === "في الخدمة"
                        ? "success"
                        : "warning"
                }">
                    ${escapeHTML(o.status || "غير متصل")}
                </span>
            </td>
            <td>${escapeHTML(o.joinDate || "-")}</td>
            <td>
                <button onclick="viewOfficer('${escapeHTML(o.id)}')">
                    عرض
                </button>
            </td>
        </tr>
    `).join("");
}

function viewOfficer(id) {
    const db = loadDatabase();

    const o =
        db.officers.find(x => x.id === id);

    if (!o) return;

    alert(
`ملف الضابط

الاسم: ${o.name}
الرتبة: ${getRankName(o.rank)}
المستوى: ${o.rank}/100
الرقم الوظيفي: ${o.badge || o.id}
القسم: ${o.department || "-"}
الحالة: ${o.status || "-"}
تاريخ الالتحاق: ${o.joinDate || "-"}`
    );
}

/* =========================
   المركبات
========================= */

function renderVehicles(list = null) {
    const db = loadDatabase();

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

    tbody.innerHTML = vehicles.map(v => `
        <tr>
            <td>${escapeHTML(v.plate || "-")}</td>
            <td>${escapeHTML(v.model || "-")}</td>
            <td>${escapeHTML(v.color || "-")}</td>
            <td>${escapeHTML(v.type || "-")}</td>
            <td>${escapeHTML(v.owner || "-")}</td>
            <td>
                <span class="badge">
                    ${escapeHTML(v.status || "غير معروف")}
                </span>
            </td>
            <td>${escapeHTML(v.insurance || "-")}</td>
            <td>
                <button onclick="viewVehicle('${escapeHTML(v.id)}')">
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
        input.value.trim().toLowerCase();

    const db = loadDatabase();

    const result =
        (db.vehicles || []).filter(v =>
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
    const modal = $("vehicle-modal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function addVehicle() {
    const plate =
        $("vehicle-plate")?.value.trim();

    const model =
        $("vehicle-model")?.value.trim();

    const color =
        $("vehicle-color")?.value.trim();

    const type =
        $("vehicle-type")?.value;

    const owner =
        $("vehicle-owner")?.value.trim();

    if (!plate || !model) {
        showMessage(
            "رقم اللوحة ونوع المركبة مطلوبان",
            "warning"
        );
        return;
    }

    const db = loadDatabase();

    const vehicle = {
        id: generateId("VEH"),
        plate,
        model,
        color,
        type,
        owner,
        status: "نشطة",
        insurance: "سارية",
        createdAt: now()
    };

    db.vehicles.push(vehicle);

    saveDatabase(db);

    addActivity(
        "إضافة مركبة",
        `تم تسجيل المركبة ${plate}`
    );

    closeModal("vehicle-modal");

    clearForm("vehicle-modal");

    renderVehicles();

    renderDashboard();

    showMessage(
        "تم تسجيل المركبة بنجاح"
    );
}

function viewVehicle(id) {
    const db = loadDatabase();

    const v =
        db.vehicles.find(x => x.id === id);

    if (!v) return;

    alert(
`ملف المركبة

اللوحة: ${v.plate}
الموديل: ${v.model}
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
    const db = loadDatabase();

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

    tbody.innerHTML = reports.map(r => `
        <tr>
            <td>${escapeHTML(r.id)}</td>
            <td>${escapeHTML(r.title || "-")}</td>
            <td>${escapeHTML(r.type || "-")}</td>
            <td>${escapeHTML(r.location || "-")}</td>
            <td>${escapeHTML(r.officer || "-")}</td>
            <td>${escapeHTML(r.date || "-")}</td>
            <td>
                <span class="badge">
                    ${escapeHTML(r.status || "مفتوح")}
                </span>
            </td>
            <td>
                <button onclick="viewReport('${escapeHTML(r.id)}')">
                    عرض
                </button>
            </td>
        </tr>
    `).join("");
}

function openReportModal() {
    const modal = $("report-modal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function addReport() {
    const title =
        $("report-title")?.value.trim();

    const type =
        $("report-type")?.value;

    const location =
        $("report-location")?.value.trim();

    const description =
        $("report-description")?.value.trim();

    if (!title || !description) {
        showMessage(
            "العنوان ووصف التقرير مطلوبان",
            "warning"
        );
        return;
    }

    const db = loadDatabase();

    const report = {
        id: generateId("RPT"),
        title,
        type,
        location,
        description,
        officer: currentUser.name,
        date: now(),
        status: "مفتوح"
    };

    db.reports.push(report);

    saveDatabase(db);

    addActivity(
        "تقرير جديد",
        `تم إنشاء التقرير ${report.id}`
    );

    closeModal("report-modal");

    clearForm("report-modal");

    renderReports();
    renderDashboard();

    showMessage(
        "تم إنشاء التقرير بنجاح"
    );
}

function viewReport(id) {
    const db = loadDatabase();

    const r =
        db.reports.find(x => x.id === id);

    if (!r) return;

    alert(
`التقرير

المعرف: ${r.id}
العنوان: ${r.title}
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
    const db = loadDatabase();

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

    container.innerHTML = calls.map(c => `
        <div class="call-card">
            <div>
                <strong>${escapeHTML(c.title || "بلاغ")}</strong>
                <p>${escapeHTML(c.description || "")}</p>
            </div>

            <div>
                <span class="badge ${
                    c.status === "مغلق"
                        ? "success"
                        : "danger"
                }">
                    ${escapeHTML(c.status || "جديد")}
                </span>
            </div>

            <small>
                ${escapeHTML(c.location || "-")}
                —
                ${escapeHTML(c.date || "-")}
            </small>
        </div>
    `).join("");
}

function openCallModal() {
    const modal = $("call-modal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function addCall() {
    const title =
        $("call-title")?.value.trim();

    const location =
        $("call-location")?.value.trim();

    const priority =
        $("call-priority")?.value;

    const description =
        $("call-description")?.value.trim();

    if (!title || !location) {
        showMessage(
            "عنوان البلاغ والموقع مطلوبان",
            "warning"
        );
        return;
    }

    const db = loadDatabase();

    const call = {
        id: generateId("CALL"),
        title,
        location,
        priority,
        description,
        status: "جديد",
        date: now(),
        createdBy: currentUser.name
    };

    db.calls.push(call);

    saveDatabase(db);

    addActivity(
        "بلاغ جديد",
        `تم تسجيل البلاغ ${call.id}`
    );

    closeModal("call-modal");

    clearForm("call-modal");

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
    const db = loadDatabase();

    const container =
        $("wanted-list") ||
        $("wanted-table-body");

    if (!container) return;

    const wanted =
        db.wanted || [];

    if (!wanted.length) {
        container.innerHTML =
            `<div class="empty">لا توجد أسماء مطلوبة</div>`;
        return;
    }

    if (container.tagName === "TBODY") {
        container.innerHTML =
            wanted.map(w => `
                <tr>
                    <td>${escapeHTML(w.id)}</td>
                    <td>${escapeHTML(w.name)}</td>
                    <td>${escapeHTML(w.reason || "-")}</td>
                    <td>${escapeHTML(w.level || "-")}</td>
                    <td>${escapeHTML(w.date || "-")}</td>
                    <td>${escapeHTML(w.status || "مطلوب")}</td>
                </tr>
            `).join("");

        return;
    }

    container.innerHTML =
        wanted.map(w => `
            <div class="wanted-card">
                <strong>${escapeHTML(w.name)}</strong>
                <span>${escapeHTML(w.reason || "-")}</span>
                <small>
                    درجة الخطورة:
                    ${escapeHTML(w.level || "-")}
                </small>
            </div>
        `).join("");
}

/* =========================
   المذكرات
========================= */

function renderWarrants() {
    const db = loadDatabase();

    const container =
        $("warrants-list") ||
        $("warrants-table-body");

    if (!container) return;

    const warrants =
        db.warrants || [];

    if (!warrants.length) {
        container.innerHTML =
            `<div class="empty">لا توجد مذكرات</div>`;
        return;
    }

    if (container.tagName === "TBODY") {
        container.innerHTML =
            warrants.map(w => `
                <tr>
                    <td>${escapeHTML(w.id)}</td>
                    <td>${escapeHTML(w.subject || "-")}</td>
                    <td>${escapeHTML(w.type || "-")}</td>
                    <td>${escapeHTML(w.issuedBy || "-")}</td>
                    <td>${escapeHTML(w.date || "-")}</td>
                    <td>${escapeHTML(w.status || "-")}</td>
                </tr>
            `).join("");

        return;
    }

    container.innerHTML =
        warrants.map(w => `
            <div class="panel-item">
                <strong>${escapeHTML(w.subject || "-")}</strong>
                <span>${escapeHTML(w.type || "-")}</span>
            </div>
        `).join("");
}

/* =========================
   المخالفات
========================= */

function renderTickets() {
    const db = loadDatabase();

    const container =
        $("tickets-table-body") ||
        $("tickets-list");

    if (!container) return;

    const tickets =
        db.tickets || [];

    if (!tickets.length) {
        container.innerHTML =
            `<div class="empty">لا توجد مخالفات</div>`;
        return;
    }

    if (container.tagName === "TBODY") {
        container.innerHTML =
            tickets.map(t => `
                <tr>
                    <td>${escapeHTML(t.id)}</td>
                    <td>${escapeHTML(t.citizen || "-")}</td>
                    <td>${escapeHTML(t.violation || "-")}</td>
                    <td>${escapeHTML(t.amount || "0")} DH</td>
                    <td>${escapeHTML(t.officer || "-")}</td>
                    <td>${escapeHTML(t.date || "-")}</td>
                    <td>${escapeHTML(t.status || "-")}</td>
                </tr>
            `).join("");

        return;
    }

    container.innerHTML =
        tickets.map(t => `
            <div class="panel-item">
                <strong>${escapeHTML(t.violation || "-")}</strong>
                <span>${escapeHTML(t.amount || "0")} DH</span>
            </div>
        `).join("");
}

/* =========================
   السجلات الجنائية
========================= */

function renderRecords() {
    const db = loadDatabase();

    const container =
        $("records-table-body") ||
        $("records-list");

    if (!container) return;

    const records =
        db.records || [];

    if (!records.length) {
        container.innerHTML =
            `<div class="empty">لا توجد سجلات</div>`;
        return;
    }

    if (container.tagName === "TBODY") {
        container.innerHTML =
            records.map(r => `
                <tr>
                    <td>${escapeHTML(r.id)}</td>
                    <td>${escapeHTML(r.citizen || "-")}</td>
                    <td>${escapeHTML(r.type || "-")}</td>
                    <td>${escapeHTML(r.description || "-")}</td>
                    <td>${escapeHTML(r.date || "-")}</td>
                    <td>${escapeHTML(r.officer || "-")}</td>
                </tr>
            `).join("");

        return;
    }

    container.innerHTML =
        records.map(r => `
            <div class="panel-item">
                <strong>${escapeHTML(r.citizen || "-")}</strong>
                <span>${escapeHTML(r.type || "-")}</span>
            </div>
        `).join("");
}

/* =========================
   العمليات
========================= */

function renderOperations() {
    const db = loadDatabase();

    const container =
        $("operations-list") ||
        $("operations-table-body");

    if (!container) return;

    const operations =
        db.operations || [];

    if (!operations.length) {
        container.innerHTML =
            `<div class="empty">لا توجد عمليات</div>`;
        return;
    }

    if (container.tagName === "TBODY") {
        container.innerHTML =
            operations.map(o => `
                <tr>
                    <td>${escapeHTML(o.id)}</td>
                    <td>${escapeHTML(o.name || "-")}</td>
                    <td>${escapeHTML(o.commander || "-")}</td>
                    <td>${escapeHTML(o.location || "-")}</td>
                    <td>${escapeHTML(o.status || "-")}</td>
                    <td>${escapeHTML(o.date || "-")}</td>
                </tr>
            `).join("");

        return;
    }

    container.innerHTML =
        operations.map(o => `
            <div class="operation-card">
                <strong>${escapeHTML(o.name || "-")}</strong>
                <span>${escapeHTML(o.location || "-")}</span>
                <small>
                    ${escapeHTML(o.status || "-")}
                </small>
            </div>
        `).join("");
}

function createOperation() {
    if (!hasPermission("operations")) {
        showMessage(
            "لا توجد لديك صلاحية إنشاء عملية",
            "danger"
        );
        return;
    }

    const name =
        prompt("اسم العملية:");

    if (!name) return;

    const location =
        prompt("موقع العملية:") || "غير محدد";

    const db = loadDatabase();

    const operation = {
        id: generateId("OP"),
        name,
        location,
        commander: currentUser.name,
        status: "نشطة",
        date: now()
    };

    db.operations.push(operation);

    saveDatabase(db);

    addActivity(
        "عملية جديدة",
        `تم إنشاء العملية ${name}`
    );

    renderOperations();

    showMessage(
        "تم إنشاء العملية بنجاح"
    );
}

/* =========================
   الإشعارات
========================= */

function renderNotifications() {
    const db = loadDatabase();

    const container =
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
                <div class="notification-item">
                    <strong>${escapeHTML(n.title || "إشعار")}</strong>
                    <p>${escapeHTML(n.message || "")}</p>
                    <small>${escapeHTML(n.date || "")}</small>
                </div>
            `)
            .join("");
}

function toggleNotifications() {
    const db = loadDatabase();

    db.settings.notifications =
        db.settings.notifications === false
            ? true
            : false;

    saveDatabase(db);

    showMessage(
        db.settings.notifications
            ? "تم تفعيل الإشعارات"
            : "تم تعطيل الإشعارات"
    );
}

/* =========================
   قاعدة البيانات
========================= */

function renderDatabase() {
    const db = loadDatabase();

    const mapping = {
        "db-citizens-count":
            db.citizens?.length || 0,

        "db-officers-count":
            db.officers?.length || 0,

        "db-vehicles-count":
            db.vehicles?.length || 0,

        "db-reports-count":
            db.reports?.length || 0,

        "db-calls-count":
            db.calls?.length || 0,

        "db-records-count":
            db.records?.length || 0
    };

    Object.entries(mapping).forEach(
        ([id, value]) => setText(id, value)
    );
}

function exportDatabase() {
    if (!hasPermission("database")) {
        showMessage(
            "لا توجد لديك صلاحية تصدير قاعدة البيانات",
            "danger"
        );
        return;
    }

    const db = loadDatabase();

    const data =
        JSON.stringify(db, null, 2);

    const blob =
        new Blob(
            [data],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `RESPECT_CFW_RPD_DATABASE_${Date.now()}.json`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

    addActivity(
        "تصدير قاعدة البيانات",
        `${currentUser.name} قام بتصدير قاعدة البيانات`
    );

    showMessage(
        "تم تصدير قاعدة البيانات"
    );
}

function resetDatabase() {
    if (!hasPermission("database")) {
        showMessage(
            "لا توجد لديك صلاحية",
            "danger"
        );
        return;
    }

    const confirmation =
        prompt(
            "تحذير: سيتم حذف البيانات المحلية.\nاكتب RESET للتأكيد:"
        );

    if (confirmation !== "RESET") {
        showMessage(
            "تم إلغاء العملية",
            "warning"
        );
        return;
    }

    const newDb =
        createDefaultDatabase();

    saveDatabase(newDb);

    showMessage(
        "تمت إعادة قاعدة البيانات إلى الوضع الافتراضي"
    );

    renderAll();
}

/* =========================
   المستخدمون
========================= */

function renderUsers() {
    const db = loadDatabase();

    const container =
        $("users-table-body") ||
        $("users-list");

    if (!container) return;

    const users =
        db.users || [];

    if (!users.length) {
        container.innerHTML =
            `<div class="empty">لا يوجد مستخدمون</div>`;
        return;
    }

    if (container.tagName === "TBODY") {
        container.innerHTML =
            users.map(u => `
                <tr>
                    <td>${escapeHTML(u.username)}</td>
                    <td>${escapeHTML(u.name)}</td>
                    <td>${escapeHTML(getRankName(u.rank))}</td>
                    <td>${escapeHTML(u.badge || "-")}</td>
                    <td>${escapeHTML(u.department || "-")}</td>
                    <td>
                        <span class="badge">
                            ${escapeHTML(u.status || "فعال")}
                        </span>
                    </td>
                </tr>
            `).join("");

        return;
    }

    container.innerHTML =
        users.map(u => `
            <div class="user-card">
                <strong>${escapeHTML(u.name)}</strong>
                <span>${escapeHTML(u.username)}</span>
                <small>${escapeHTML(getRankName(u.rank))}</small>
            </div>
        `).join("");
}

function openUserModal() {
    const modal =
        document.createElement("div");

    modal.className = "modal";
    modal.id = "dynamic-user-modal";

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>إضافة مستخدم</h2>
                <button onclick="closeModal('dynamic-user-modal')">
                    ×
                </button>
            </div>

            <div class="form-grid">

                <input
                    id="new-user-username"
                    placeholder="اسم المستخدم"
                >

                <input
                    id="new-user-name"
                    placeholder="الاسم الكامل"
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
                    placeholder="الرتبة 0 - 100"
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

    document.body.appendChild(modal);

    modal.style.display = "flex";
}

function addUser() {
    if (!currentUser || currentUser.rank < 85) {
        showMessage(
            "هذه العملية مخصصة للرتب العليا",
            "danger"
        );
        return;
    }

    const username =
        $("new-user-username")?.value.trim();

    const name =
        $("new-user-name")?.value.trim();

    const password =
        $("new-user-password")?.value;

    const rank =
        Number(
            $("new-user-rank")?.value || 0
        );

    const department =
        $("new-user-department")?.value.trim();

    if (!username || !name || !password) {
        showMessage(
            "يرجى ملء البيانات الأساسية",
            "warning"
        );
        return;
    }

    if (rank < 0 || rank > 100) {
        showMessage(
            "الرتبة يجب أن تكون بين 0 و100",
            "warning"
        );
        return;
    }

    const db = loadDatabase();

    if (
        db.users.some(
            u => u.username === username
        )
    ) {
        showMessage(
            "اسم المستخدم موجود مسبقاً",
            "danger"
        );
        return;
    }

    const user = {
        id: generateId("USR"),
        username,
        password,
        name,
        rank,
        badge: generateId("RPD"),
        department:
            department || "غير محدد",
        status: "فعال",
        createdAt: now()
    };

    db.users.push(user);

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

    for (let level = 0; level <= 100; level++) {
        const rank =
            getRankByLevel(level);

        const isCurrent =
            currentUser &&
            Number(currentUser.rank) === level;

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
                    ${escapeHTML(rank.name)}
                </div>

                <div class="rank-permissions">
                    ${escapeHTML(
                        rank.permissions?.join(" • ") ||
                        "صلاحيات أساسية"
                    )}
                </div>

            </div>
        `;
    }

    container.innerHTML = html;
}

/* =========================
   الإعدادات
========================= */

function renderSettings() {
    const db = loadDatabase();

    const notifications =
        $("notifications-toggle");

    if (notifications) {
        notifications.checked =
            db.settings.notifications !== false;
    }
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
            document.createElement("style");

        style.id =
            "rpd-light-style";

        document.head.appendChild(style);
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
    const modal = $(id);

    if (!modal) return;

    modal.style.display = "none";

    if (id === "dynamic-user-modal") {
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function clearForm(modalId) {
    const modal = $(modalId);

    if (!modal) return;

    modal.querySelectorAll(
        "input, textarea, select"
    ).forEach(el => {
        if (el.type !== "button") {
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
        const db = loadDatabase();

        if (!db.activities) {
            db.activities = [];
        }

        db.activities.push({
            id: generateId("ACT"),
            title,
            description,
            date: now(),
            user:
                currentUser?.name ||
                "النظام"
        });

        if (db.activities.length > 100) {
            db.activities =
                db.activities.slice(-100);
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

function setText(id, value) {
    const el = $(id);

    if (el) {
        el.textContent = value;
    }
}

/* =========================
   تحديث كل شيء
========================= */

function renderAll() {
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
        currentPage || "dashboard"
    );
}

/* =========================
   الاختصارات
========================= */

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape"
        ) {
            document
                .querySelectorAll(".modal")
                .forEach(modal => {
                    modal.style.display =
                        "none";
                });
        }

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
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

        const session =
            getSession();

        if (session) {
            currentUser = session;

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
                        event.key === "Enter"
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
                        event.key === "Enter"
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
