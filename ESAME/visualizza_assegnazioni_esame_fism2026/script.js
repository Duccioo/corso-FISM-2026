const embeddedData = {
    generatedAt: "2026-06-10T07:19:13.603Z",
    totalAssignments: 16,
    assignments: [
        {
            student: "Bitossi Jacopo",
            taskId: 33,
            taskTitle: "Galleria cani",
            taskType: "API remote",
            assignedAt: "2026-06-10T07:13:20.607Z"
        },
        {
            student: "Bonanomi Gianmarco",
            taskId: 7,
            taskTitle: "Associazione culturale",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:15:47.893Z"
        },
        {
            student: "Brogini Michelangelo",
            taskId: 17,
            taskTitle: "Dashboard ambientale statica",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:16:15.657Z"
        },
        {
            student: "Chiaravallotti Daniela",
            taskId: 12,
            taskTitle: "Agenzia viaggi fittizia",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:16:31.573Z"
        },
        {
            student: "De Ria Jacopo",
            taskId: 22,
            taskTitle: "Planner viaggio meteo",
            taskType: "API remote",
            assignedAt: "2026-06-10T07:16:46.256Z"
        },
        {
            student: "Fanelli Simone",
            taskId: 20,
            taskTitle: "Manuale sicurezza informatica base",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:17:00.723Z"
        },
        {
            student: "Lucar Castro Grecia Zofai",
            taskId: 26,
            taskTitle: "Team Pokemon",
            taskType: "API remote",
            assignedAt: "2026-06-10T07:17:12.326Z"
        },
        {
            student: "Nesti Jacopo",
            taskId: 9,
            taskTitle: "Guida ai comandi del terminale",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:17:25.641Z"
        },
        {
            student: "Noschese Pierluigi",
            taskId: 4,
            taskTitle: "Menu di un ristorante",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:17:33.692Z"
        },
        {
            student: "Sassi Francesca",
            taskId: 21,
            taskTitle: "Meteo Città Europee",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:17:48.141Z"
        },
        {
            student: "Signoroni Alessandro",
            taskId: 25,
            taskTitle: "Pokedex Base",
            taskType: "API remote",
            assignedAt: "2026-06-10T07:17:58.275Z"
        },
        {
            student: "Tancredi Matteo",
            taskId: 32,
            taskTitle: "Catalogo anime",
            taskType: "API remote",
            assignedAt: "2026-06-10T07:18:07.291Z"
        },
        {
            student: "Tkachenko Vladyslav",
            taskId: 23,
            taskTitle: "Atlante paesi",
            taskType: "API remote",
            assignedAt: "2026-06-10T07:18:19.140Z"
        },
        {
            student: "Cavini Stefano",
            taskId: 3,
            taskTitle: "Collezione videogiochi",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:18:40.026Z"
        },
        {
            student: "Contolini Davide",
            taskId: 26,
            taskTitle: "Terremoti Recenti",
            taskType: "API remote",
            assignedAt: "2026-06-10T07:18:48.724Z"
        },
        {
            student: "Kharyk Orest",
            taskId: 11,
            taskTitle: "Mini corso HTML e CSS",
            taskType: "Locale",
            assignedAt: "2026-06-10T07:18:59.141Z"
        }
    ]
};

let data = embeddedData;
let assignments = [];
let delivered = {};
const deliveredStorageKey = "fism2026-consegne";
const searchInput = document.getElementById("searchInput");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const assignmentsBody = document.getElementById("assignmentsBody");
const emptyState = document.getElementById("emptyState");
const copyButton = document.getElementById("copyButton");
const totalCount = document.getElementById("totalCount");
const localCount = document.getElementById("localCount");
const apiCount = document.getElementById("apiCount");
const deliveredCount = document.getElementById("deliveredCount");
const sourceInfo = document.getElementById("sourceInfo");
const visibleInfo = document.getElementById("visibleInfo");

let activeFilter = "all";

async function init() {
    data = await loadAssignmentsData();
    assignments = data.assignments.slice().sort((a, b) => a.student.localeCompare(b.student, "it"));
    delivered = loadDelivered();
    totalCount.textContent = assignments.length;
    localCount.textContent = assignments.filter(item => item.taskType === "Locale").length;
    apiCount.textContent = assignments.filter(item => item.taskType === "API remote").length;
    sourceInfo.textContent = `Generato dal JSON: ${formatDateTime(data.generatedAt)}`;
    render();
}

async function loadAssignmentsData() {
    try {
        const response = await fetch("../../assegnazioni-esame-fism2026.json", { cache: "no-store" });
        if (!response.ok) {
            throw new Error("JSON non disponibile");
        }
        return await response.json();
    } catch {
        return embeddedData;
    }
}

function render() {
    const query = normalize(searchInput.value);
    const visible = assignments.filter(assignment => {
        const matchesFilter = activeFilter === "all" || assignment.taskType === activeFilter;
        const haystack = normalize(`${assignment.student} ${assignment.taskTitle} ${getDisplayTaskId(assignment)} ${assignment.taskType}`);
        return matchesFilter && haystack.includes(query);
    });

    assignmentsBody.innerHTML = visible.map((assignment, index) => `
        <tr class="${isDelivered(assignment) ? "delivered" : ""}">
            <td class="number">${index + 1}</td>
            <td class="student">${escapeHtml(assignment.student)}</td>
            <td class="task"><span class="task-id">${String(getDisplayTaskId(assignment)).padStart(2, "0")}</span>${escapeHtml(assignment.taskTitle)}</td>
            <td>${renderBadge(assignment.taskType)}</td>
            <td class="time">${formatTime(assignment.assignedAt)}</td>
            <td class="delivery-cell">
                <input class="delivery-check" type="checkbox" data-delivery-key="${escapeHtml(getAssignmentKey(assignment))}" aria-label="Segna consegna di ${escapeHtml(assignment.student)}" ${isDelivered(assignment) ? "checked" : ""}>
            </td>
        </tr>
    `).join("");

    emptyState.hidden = visible.length > 0;
    updateDeliveredCount();
    visibleInfo.textContent = `${visible.length} visibili su ${assignments.length} | ${getDeliveredTotal()} consegnati`;
}

function loadDelivered() {
    try {
        const parsed = JSON.parse(localStorage.getItem(deliveredStorageKey));
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

function saveDelivered() {
    localStorage.setItem(deliveredStorageKey, JSON.stringify(delivered));
}

function getAssignmentKey(assignment) {
    return `${assignment.student}|${assignment.taskId}|${assignment.taskTitle}`;
}

function getDisplayTaskId(assignment) {
    return assignment.taskType === "API remote" ? assignment.taskId - 20 : assignment.taskId;
}

function isDelivered(assignment) {
    return Boolean(delivered[getAssignmentKey(assignment)]);
}

function getDeliveredTotal() {
    return assignments.filter(isDelivered).length;
}

function updateDeliveredCount() {
    deliveredCount.textContent = getDeliveredTotal();
}

function renderBadge(taskType) {
    const className = taskType === "Locale" ? "local" : "api";
    const label = taskType === "Locale" ? "Locale" : "API remote";
    return `<span class="badge ${className}">${label}</span>`;
}

function copyVisibleAssignments() {
    const rows = Array.from(assignmentsBody.querySelectorAll("tr")).map(row => {
        const cells = Array.from(row.cells).map(cell => cell.textContent.trim().replace(/\s+/g, " "));
        const status = row.querySelector(".delivery-check")?.checked ? "Consegnato" : "Manca";
        return `${cells[1]} - ${cells[2]} - ${cells[3]} - ${status}`;
    });

    navigator.clipboard.writeText(rows.join("\n")).then(() => {
        copyButton.textContent = "Copiato";
        window.setTimeout(() => {
            copyButton.textContent = "Copia elenco";
        }, 1300);
    }).catch(() => {
        copyButton.textContent = "Non copiato";
        window.setTimeout(() => {
            copyButton.textContent = "Copia elenco";
        }, 1300);
    });
}

function normalize(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        "\"": "&quot;"
    }[char]));
}

function formatTime(value) {
    return new Intl.DateTimeFormat("it-IT", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

function formatDateTime(value) {
    return new Intl.DateTimeFormat("it-IT", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date(value));
}

searchInput.addEventListener("input", render);
copyButton.addEventListener("click", copyVisibleAssignments);
assignmentsBody.addEventListener("change", event => {
    if (!event.target.classList.contains("delivery-check")) {
        return;
    }

    const key = event.target.dataset.deliveryKey;
    delivered[key] = event.target.checked;
    if (!event.target.checked) {
        delete delivered[key];
    }
    saveDelivered();
    event.target.closest("tr").classList.toggle("delivered", event.target.checked);
    updateDeliveredCount();
    visibleInfo.textContent = `${assignmentsBody.querySelectorAll("tr").length} visibili su ${assignments.length} | ${getDeliveredTotal()} consegnati`;
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach(item => item.classList.toggle("active", item === button));
        render();
    });
});

init();
