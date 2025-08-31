// testApi.js
const fetch = require("node-fetch");

const API_URL = "http://localhost:5000/api";

async function testEndpoint(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    console.log(`\n[${endpoint}] status: - testApi.js:9`, res.status);
    console.log(`[${endpoint}] contenttype: - testApi.js:10`, res.headers.get("content-type"));

    const text = await res.text(); // ابتدا متن خام بگیریم
    console.log(`[${endpoint}] response snippet: - testApi.js:13`, text.slice(0, 200));
  } catch (err) {
    console.error(`[${endpoint}] error: - testApi.js:15`, err.message);
  }
}

async function runTests() {
  await testEndpoint("/products");
  await testEndpoint("/categories");
  await testEndpoint("/accounts");
  await testEndpoint("/orders");
  await testEndpoint("/comments");
}

runTests();
