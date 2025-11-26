const BASE_URL = 'http://localhost:3000/api';

async function test() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';

  console.log('1. Testing Signup...');
  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log('Signup Status:', signupRes.status);
  const signupData = await signupRes.json();
  console.log('Signup Body:', signupData);

  if (signupRes.status !== 200) {
    console.error('Signup failed, aborting.');
    return;
  }

  // Note: We can't easily test confirmation without accessing the DB or email to get the token.
  // For this test, we'll try to login (which should fail if not verified)
  // Or we can manually verify in DB if we had access.
  // Since this is a black-box API test, we'll stop here for the "happy path" of signup.
  
  // However, to test Saved Posts, we need a token.
  // I'll try to login. It should fail with "Please verify your email first".
  
  console.log('\n2. Testing Login (Unverified)...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log('Login Status:', loginRes.status);
  const loginData = await loginRes.json();
  console.log('Login Body:', loginData);

  // If we could verify, we would proceed.
  console.log('\nTo fully test, you need to verify the user in the database or via the email link.');
  console.log('Then run a separate test for Login (Verified) and Saved Posts.');
}

test();
