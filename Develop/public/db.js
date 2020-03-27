const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = ({target})=>{
    let db = target.result;
    db.createObjectStore('offline', {autoIncrement: true})
}

request.onsuccess = ({target}) =>{
    console.log('loaded!')
    db = target.result
    if(navigator.onLine){
        console.log('online again!')
        uploadOfflineTrans()
    }
}


function saveRecord(record){
    console.log('your record', record)
    const transaction = db.transaction(['offline'], 'readwrite');
    const store = transaction.objectStore('offline');
    store.add(record)
}

function uploadOfflineTrans(){
    const transaction = db.transaction(['offline'], 'readwrite');
    const store = transaction.objectStore('offline');
    const getAll = store.getAll();

    getAll.onsuccess = function(){
        if(getAll.length){
            console.log(getAll.length)
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }).then(response=>{
                return response.json()
            }).then(()=>{
                const transaction = db.transaction(['offline'], 'readwrite');
    const store = transaction.objectStore('offline');
    store.clear()
            }).catch(err=>console.log(err))
        }
    }
}