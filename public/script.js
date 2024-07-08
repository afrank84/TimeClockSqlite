document.getElementById('clock-in').addEventListener('click', clockIn);
document.getElementById('clock-out').addEventListener('click', clockOut);

function clockIn() {
    const timestamp = new Date().toISOString();
    fetch('/clockin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ time: timestamp })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').innerText = 'Clocked in at ' + data.time;
    })
    .catch(error => console.error('Error:', error));
}

function clockOut() {
    const timestamp = new Date().toISOString();
    fetch('/clockout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ time: timestamp })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').innerText = 'Clocked out at ' + data.time;
    })
    .catch(error => console.error('Error:', error));
}
