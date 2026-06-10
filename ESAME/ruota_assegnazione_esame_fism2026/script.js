const tasks = [
    { id: 1, type: "Locale", title: "Biblioteca personale" },
    { id: 2, type: "Locale", title: "Catalogo film consigliati" },
    { id: 3, type: "Locale", title: "Collezione videogiochi" },
    { id: 4, type: "Locale", title: "Menu di un ristorante" },
    { id: 5, type: "Locale", title: "Sito di una palestra" },
    { id: 6, type: "Locale", title: "Museo immaginario" },
    { id: 7, type: "Locale", title: "Associazione culturale" },
    { id: 8, type: "Locale", title: "Portfolio fotografo" },
    { id: 9, type: "Locale", title: "Guida ai comandi del terminale" },
    { id: 10, type: "Locale", title: "Guida pratica a Git" },
    { id: 11, type: "Locale", title: "Mini corso HTML e CSS" },
    { id: 12, type: "Locale", title: "Agenzia viaggi fittizia" },
    { id: 13, type: "Locale", title: "Eventi in città" },
    { id: 14, type: "Locale", title: "Ricettario locale" },
    { id: 15, type: "Locale", title: "Catalogo musicale" },
    { id: 16, type: "Locale", title: "Sito di una startup fittizia" },
    { id: 17, type: "Locale", title: "Dashboard ambientale statica" },
    { id: 18, type: "Locale", title: "Portfolio personale e CV web" },
    { id: 19, type: "Locale", title: "Festival musicale" },
    { id: 20, type: "Locale", title: "Manuale sicurezza informatica base" },
    { id: 21, type: "API remote", title: "Meteo città europee" },
    { id: 22, type: "API remote", title: "Planner viaggio meteo" },
    { id: 23, type: "API remote", title: "Atlante paesi" },
    { id: 24, type: "API remote", title: "Confronto nazioni" },
    { id: 25, type: "API remote", title: "Pokedex base" },
    { id: 26, type: "API remote", title: "Team Pokemon" },
    { id: 27, type: "API remote", title: "Blog demo" },
    { id: 28, type: "API remote", title: "Mini social board" },
    { id: 29, type: "API remote", title: "Mini ecommerce" },
    { id: 30, type: "API remote", title: "Ricettario globale" },
    { id: 31, type: "API remote", title: "Biblioteca online" },
    { id: 32, type: "API remote", title: "Catalogo anime" },
    { id: 33, type: "API remote", title: "Galleria cani" },
    { id: 34, type: "API remote", title: "Rick and Morty" },
    { id: 35, type: "API remote", title: "Calendario festività" },
    { id: 36, type: "API remote", title: "Terremoti recenti" },
    { id: 37, type: "API remote", title: "Vocabolario creativo" },
    { id: 38, type: "API remote", title: "Media finder" },
    { id: 39, type: "API remote", title: "Rubrica persone" },
    { id: 40, type: "API remote", title: "Notizie spazio" }
];

const colors = ["#f97316", "#22c55e", "#3b82f6", "#eab308", "#ec4899", "#14b8a6", "#8b5cf6", "#ef4444"];
const storageKey = "fism2026-assegnazioni-esame";
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const studentName = document.getElementById("studentName");
const studentList = document.getElementById("studentList");
const spinButton = document.getElementById("spinButton");
const loadStudentsButton = document.getElementById("loadStudentsButton");
const nextStudentButton = document.getElementById("nextStudentButton");
const saveFileButton = document.getElementById("saveFileButton");
const downloadButton = document.getElementById("downloadButton");
const importFile = document.getElementById("importFile");
const resetButton = document.getElementById("resetButton");
const result = document.getElementById("result");
const assignmentsTable = document.getElementById("assignmentsTable");
const studentQueue = document.getElementById("studentQueue");
const assignedCount = document.getElementById("assignedCount");
const remainingCount = document.getElementById("remainingCount");
let assignments = [];
let queue = [];
let rotation = 0;
let spinning = false;

function availableTasks() {
    const used = new Set(assignments.map(assignment => assignment.taskId));
    return tasks.filter(task => !used.has(task.id));
}

function drawWheel() {
    const entries = availableTasks();
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;
    ctx.clearRect(0, 0, size, size);

    if (entries.length === 0) {
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#111827";
        ctx.fill();
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 34px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tutti assegnati", center, center);
        return;
    }

    const slice = (Math.PI * 2) / entries.length;
    entries.forEach((task, index) => {
        const start = index * slice - Math.PI / 2;
        const end = start + slice;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(start + slice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = entries.length > 24 ? "bold 15px sans-serif" : "bold 18px sans-serif";
        ctx.fillText(String(task.id).padStart(2, "0"), radius - 22, 6);
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.88)";
    ctx.lineWidth = 10;
    ctx.stroke();
}

function render() {
    const remaining = availableTasks().length;
    assignedCount.textContent = assignments.length;
    remainingCount.textContent = remaining;
    spinButton.disabled = spinning || remaining === 0;
    assignmentsTable.innerHTML = assignments.map(assignment => `
        <tr>
            <td>${escapeHtml(assignment.student)}</td>
            <td>${String(assignment.taskId).padStart(2, "0")} - ${escapeHtml(assignment.taskTitle)}</td>
            <td>${escapeHtml(assignment.taskType)}</td>
        </tr>
    `).join("");
    studentQueue.innerHTML = queue.map(student => `<li>${escapeHtml(student)}</li>`).join("");
    drawWheel();
    saveAssignments();
}

function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        "\"": "&quot;"
    }[char]));
}

function saveAssignments() {
    localStorage.setItem(storageKey, JSON.stringify(assignments));
}

function loadAssignments() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        assignments = Array.isArray(parsed) ? parsed.filter(item => item.student && item.taskId) : [];
    } catch {
        assignments = [];
    }
}

function pickNextStudent() {
    if (studentName.value.trim()) {
        return studentName.value.trim();
    }

    const next = queue.shift();
    studentName.value = next || "";
    render();
    return next || "";
}

function spin() {
    if (spinning) {
        return;
    }

    const student = pickNextStudent();
    if (!student) {
        result.classList.remove("winner");
        result.innerHTML = `<span class="small">Manca lo studente</span><strong>Inserisci un nome o carica la lista</strong>`;
        return;
    }

    if (assignments.some(assignment => assignment.student.toLowerCase() === student.toLowerCase())) {
        result.classList.remove("winner");
        result.innerHTML = `<span class="small">Studente già assegnato</span><strong>${escapeHtml(student)} ha già un compito</strong>`;
        return;
    }

    const entries = availableTasks();
    if (entries.length === 0) {
        result.classList.remove("winner");
        result.innerHTML = `<span class="small">Estrazione conclusa</span><strong>Tutti i 40 compiti sono stati assegnati</strong>`;
        return;
    }

    spinning = true;
    render();
    result.classList.remove("winner");
    result.innerHTML = `<span class="small">La ruota gira per</span><strong>${escapeHtml(student)}</strong>`;

    const winnerIndex = Math.floor(Math.random() * entries.length);
    const winner = entries[winnerIndex];
    const slice = 360 / entries.length;
    const winnerCenter = winnerIndex * slice + slice / 2;
    const targetAngle = 360 - winnerCenter;
    const rounds = 6 + Math.floor(Math.random() * 4);
    const finalRotation = rotation + rounds * 360 + normalizeAngle(targetAngle - rotation);
    rotation = finalRotation;
    canvas.style.transform = `rotate(${finalRotation}deg)`;

    window.setTimeout(() => {
        assignments.push({
            student,
            taskId: winner.id,
            taskTitle: winner.title,
            taskType: winner.type,
            assignedAt: new Date().toISOString()
        });
        studentName.value = "";
        spinning = false;
        result.classList.add("winner");
        result.innerHTML = `<span class="small">Compito assegnato a ${escapeHtml(student)}</span><strong>${String(winner.id).padStart(2, "0")} - ${escapeHtml(winner.title)} (${escapeHtml(winner.type)})</strong>`;
        render();
    }, 5700);
}

function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

function loadQueue() {
    queue = studentList.value.split("\n").map(row => row.trim()).filter(Boolean);
    if (!studentName.value.trim() && queue.length > 0) {
        studentName.value = queue.shift();
    }
    render();
}

function nextStudent() {
    if (queue.length === 0) {
        studentName.value = "";
        render();
        return;
    }
    studentName.value = queue.shift();
    render();
}

function buildAssignmentsPayload() {
    return {
        generatedAt: new Date().toISOString(),
        totalAssignments: assignments.length,
        assignments
    };
}

async function saveAssignmentsToFile() {
    const content = JSON.stringify(buildAssignmentsPayload(), null, 2);
    if (!window.showSaveFilePicker) {
        downloadAssignments();
        return;
    }

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: "assegnazioni-esame-fism2026.json",
            types: [{
                description: "File JSON",
                accept: { "application/json": [".json"] }
            }]
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        result.classList.remove("winner");
        result.innerHTML = `<span class="small">File salvato</span><strong>Le assegnazioni sono state scritte nel JSON scelto</strong>`;
    } catch (error) {
        if (error.name !== "AbortError") {
            downloadAssignments();
        }
    }
}

function downloadAssignments() {
    const blob = new Blob([JSON.stringify(buildAssignmentsPayload(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assegnazioni-esame-fism2026.json";
    link.click();
    URL.revokeObjectURL(url);
}

function importAssignments(file) {
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        try {
            const parsed = JSON.parse(String(reader.result));
            const imported = Array.isArray(parsed) ? parsed : parsed.assignments;
            if (!Array.isArray(imported)) {
                throw new Error("Formato non valido");
            }
            assignments = imported.filter(item => item.student && item.taskId).map(item => ({
                student: String(item.student),
                taskId: Number(item.taskId),
                taskTitle: String(item.taskTitle || tasks.find(task => task.id === Number(item.taskId))?.title || "Compito"),
                taskType: String(item.taskType || tasks.find(task => task.id === Number(item.taskId))?.type || ""),
                assignedAt: item.assignedAt || new Date().toISOString()
            }));
            render();
        } catch {
            result.classList.remove("winner");
            result.innerHTML = `<span class="small">Import non riuscito</span><strong>Il file JSON non è valido</strong>`;
        }
    });
    reader.readAsText(file);
}

function resetAll() {
    if (!confirm("Vuoi cancellare tutte le assegnazioni salvate?")) {
        return;
    }
    assignments = [];
    queue = [];
    studentName.value = "";
    studentList.value = "";
    rotation = 0;
    canvas.style.transform = "rotate(0deg)";
    result.classList.remove("winner");
    result.innerHTML = `<span class="small">Reset completato</span><strong>Pronto per una nuova estrazione</strong>`;
    render();
}

spinButton.addEventListener("click", spin);
loadStudentsButton.addEventListener("click", loadQueue);
nextStudentButton.addEventListener("click", nextStudent);
saveFileButton.addEventListener("click", saveAssignmentsToFile);
downloadButton.addEventListener("click", downloadAssignments);
importFile.addEventListener("change", event => importAssignments(event.target.files[0]));
resetButton.addEventListener("click", resetAll);
studentName.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        spin();
    }
});

loadAssignments();
render();
