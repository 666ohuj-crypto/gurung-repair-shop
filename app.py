from flask import Flask, render_template, request, redirect, url_for, flash, session
import uuid

app = Flask(__name__)
app.secret_key = 'gurung_mobile_solutions_secure_intake_key'

# Pre-populated localized shop ticket architecture
INITIAL_TICKETS = [
    {"id": str(uuid.uuid4()), "customer": "Rohan Thapa", "device": "Samsung Galaxy S23", "type": "Mobile", "issue": "Broken Screen Glass Repair", "status": "Pending"},
    {"id": str(uuid.uuid4()), "customer": "Priya Rai", "device": "Asus ROG Zephyrus", "type": "Laptop", "issue": "Overheating Clean & Thermal Paste", "status": "In Progress"},
    {"id": str(uuid.uuid4()), "customer": "Karma Sherpa", "device": "iPhone 14 Pro", "type": "Mobile", "issue": "Battery Replacement Health Fix", "status": "Completed"}
]

@app.route('/')
def dashboard():
    if 'tickets' not in session:
        session['tickets'] = INITIAL_TICKETS
    return render_template('index.html', tickets=session['tickets'])

@app.route('/create-ticket', methods=['POST'])
def create_ticket():
    customer = request.form.get('customer')
    device = request.form.get('device')
    device_type = request.form.get('type')
    issue = request.form.get('issue')
    
    if not customer or not device or not issue:
        flash("Please complete all tech diagnostic reporting entries.", "danger")
        return redirect(url_for('dashboard'))
        
    new_ticket = {
        "id": str(uuid.uuid4()),
        "customer": customer,
        "device": device,
        "type": device_type,
        "issue": issue,
        "status": "Pending"
    }
    
    tickets = session.get('tickets')
    tickets.append(new_ticket)
    session['tickets'] = tickets
    session.modified = True
    
    flash(f"Repair log created successfully for {device}!", "success")
    return redirect(url_for('dashboard'))

@app.route('/advance-status/<string:ticket_id>')
def advance_status(ticket_id):
    status_flow = {"Pending": "In Progress", "In Progress": "Completed", "Completed": "Pending"}
    
    for ticket in tickets:
        if ticket['id'] == ticket_id:
            ticket['status'] = status_flow[ticket['status']]
            break
            
    session['tickets'] = tickets
    session.modified = True
    return redirect(url_for('dashboard'))

@app.route('/delete-ticket/<string:ticket_id>')
def delete_ticket(ticket_id):
    tickets = session.get('tickets')
    tickets = [t for t in tickets if t['id'] != ticket_id]
    session['tickets'] = tickets
    session.modified = True
    flash("Ticket completely checked out and archived.", "warning")
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    app.run(debug=True)
