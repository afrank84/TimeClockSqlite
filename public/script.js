document.getElementById('clock-in').addEventListener('click', clockIn);
document.getElementById('clock-out').addEventListener('click', clockOut);
document.getElementById('search-btn').addEventListener('click', searchEntries);
document.getElementById('prev-page').addEventListener('click', prevPage);
document.getElementById('next-page').addEventListener('click', nextPage);

let currentPage = 1;
const pageSize = 20;

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
        fetchEntries();
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
        fetchEntries();
    })
    .catch(error => console.error('Error:', error));
}

function fetchEntries(searchTerm = '') {
    fetch(`/entries?page=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
        const entriesDiv = document.getElementById('entries');
        entriesDiv.innerHTML = '';
        if (data.entries.length > 0) {
            const table = document.createElement('table');
            table.className = 'table table-striped';
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            const headerRow = document.createElement('tr');
            const headers = ['Time', 'Action'];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.scope = 'col';
                th.innerText = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            data.entries.forEach(entry => {
                const row = document.createElement('tr');
                const timeCell = document.createElement('td');
                timeCell.innerText = entry.time;
                const actionCell = document.createElement('td');
                actionCell.innerText = entry.action;
                row.appendChild(timeCell);
                row.appendChild(actionCell);
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            entriesDiv.appendChild(table);
        } else {
            entriesDiv.innerText = 'No entries found';
        }
    })
    .catch(error => console.error('Error:', error));
}

function searchEntries() {
    const searchTerm = document.getElementById('search').value;
    currentPage = 1;
    fetchEntries(searchTerm);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchEntries(document.getElementById('search').value);
    }
}

function nextPage() {
    currentPage++;
    fetchEntries(document.getElementById('search').value);
}

// Initial fetch
fetchEntries();
