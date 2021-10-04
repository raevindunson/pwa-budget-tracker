// ADDED WITH HELP FROM GW CODING BOOTCAMP MODULE 18 - PIZZA HUNT

let db;
const request = indexedDB.open('pwa-budget-tracker', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('new_deposit', { autoIncrement: true });
};

// online functionality
request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    addDeposit();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

// Add records and save money transactions
function saveRecord(record) {
  const transaction = db.transaction(['new_deposit'], 'readwrite');

  const moneyObjectStore = transaction.objectStore('new_deposit');

  moneyObjectStore.add(record);
}

// transactions to add deposit successfully and store
function addDeposit() {
  const transaction = db.transaction(['new_deposit'], 'readwrite');

  const moneyObjectStore = transaction.objectStore('new_deposit');

  const getAll = moneyObjectStore.getAll();

  // Send money to deposits on success through api
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/deposits', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(['new_deposit'], 'readwrite');
          const moneyObjectStore = transaction.objectStore('new_deposit');
          moneyObjectStore.clear();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}

// offline to online functionality
window.addEventListener('online', addDeposit);

// COMPLETED BY USING INFO AND HELP FROM MODULE 18: PIZZA HUNT