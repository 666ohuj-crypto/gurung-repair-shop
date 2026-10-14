// Pre-populated baseline data mirroring the initial Flask tickets
const INITIAL_TICKETS = [
    { id: "1", customer: "Rohan Thapa", device: "Samsung Galaxy S23", type: "Mobile", issue: "Broken Screen Glass Repair", status: "Pending" },
    { id: "2", customer: "Priya Rai", device: "Asus ROG Zephyrus", type: "Laptop", issue: "Overheating Clean & Thermal Paste", status: "In Progress" },
    { id: "3", customer: "Karma Sherpa", device: "iPhone 14 Pro", type: "Mobile", issue: "Battery Replacement Health Fix", status: "Completed" }
];

// Load tickets from browser Storage or use defaults if empty
let tickets = JSON.parse(localStorage.getItem('tickets'));
if (!tickets || tickets.length === 0) {
    tickets = INITIAL_TICKETS;
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

// Function to render alerts to screen (mirrors Flask Flash)
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Function to render the active data table
function renderTickets() {
    const tbody = document.getElementById('tickets-table-body');
    tbody.innerHTML = '';

    if (tickets.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No active repair logs found.</td></tr>`;
        return;
    }

    tickets.forEach(ticket => {
        // Dynamic badge color mapping based on status
        let badgeColor = "bg-warning text-dark";
        if (ticket.status === "In Progress") badgeColor = "bg-info text-dark";
        if (ticket.status === "Completed") badgeColor = "bg-success text-white";

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ticket.customer}</strong></td>
            <td>${ticket.device}</td>
            <td><span class="badge bg-secondary">${ticket.type}</span></td>
            <td>${ticket.issue}</td>
            <td><span class="badge ${badgeColor}">${ticket.status}</span></td>
            <td class="text-center">
                <button onclick="advanceStatus('${ticket.id}')" class="btn btn-sm btn-outline-primary me-1">⚡ Next Status</button>
                <button onclick="deleteTicket('${ticket.id}')" class="btn btn-sm btn-danger">🗑️ Archive</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle Form Submission (Create Ticket)
document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const customer = document.getElementById('customer').value.trim();
    const device = document.getElementById('device').value.trim();
    const type = document.getElementById('type').value;
    const issue = document.getElementById('issue').value.trim();

    if (!customer || !device || !issue) {
        showAlert("Please complete all tech diagnostic reporting entries.", "danger");
        return;
    }

    const newTicket = {
        id: Date.now().toString(), // Generates a clean browser-side unique ID
        customer: customer,
        device: device,
        type: type,
        issue: issue,
        status: "Pending"
    };

    tickets.push(newTicket);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    renderTickets();
    
    // Clear out form inputs
    document.getElementById('ticket-form').reset();
    showAlert(`Repair log created successfully for ${device}!`, "success");
});

// Cyclical status flow loop (Pending -> In Progress -> Completed -> Pending)
function advanceStatus(ticketId) {
    const statusFlow = { "Pending": "In Progress", "In Progress": "Completed", "Completed": "Pending" };
    
    tickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
            ticket.status = statusFlow[ticket.status];
        }
        return ticket;
    });

    localStorage.setItem('tickets', JSON.stringify(tickets));
    renderTickets();
}

// Remove ticket from list (Archive)
function deleteTicket(ticketId) {
    tickets = tickets.filter(ticket => ticket.id !== ticketId);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    renderTickets();
    showAlert("Ticket completely checked out and archived.", "warning");
}

// Optional helper to reload sample entries easily
function resetToDefaultData() {
    tickets = INITIAL_TICKETS;
    localStorage.setItem('tickets', JSON.stringify(tickets));
    renderTickets();
    showAlert("Dashboard reset to starting diagnostic files.", "info");
}

// Initial draw sequence on page boot
renderTickets();
