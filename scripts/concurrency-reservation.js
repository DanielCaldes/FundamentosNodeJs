import fetch from 'node-fetch';
import { PORT } from '../src/config.js';
const url = `http://localhost:${PORT}/api/reservations`;

const body = {
  roomId: 1,
  username: "Daniel",
  peopleCount: 5,
  startDate: "2025-07-14T10:00:00Z",
  endDate: "2025-07-14T12:00:00Z"
};

const headers = {
  'Content-Type': 'application/json'
};

async function makeConcurrentRequests() {
  console.log('Enviando dos peticiones concurrentes...');

  const requests = [
    fetch(url, { method: 'POST', headers, body: JSON.stringify(body) }),
    fetch(url, { method: 'POST', headers, body: JSON.stringify(body) }),
  ];

  const responses = await Promise.all(requests);

  for (const res of responses) {
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(data);
  }
}

makeConcurrentRequests().catch(err => {
  console.error('Error en la petición:', err);
});
