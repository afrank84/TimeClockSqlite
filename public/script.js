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
        data.entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.innerText = `${entry.time} - ${entry.action}`;
            entriesDiv.appendChild(entryDiv);
        });
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
