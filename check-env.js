require('dotenv').config();

const url = process.env.DATABASE_URL;

if (!url) {
  console.log('DATABASE_URL is not set');
} else {
  try {
    const parsed = new URL(url);
    console.log('Protocol:', parsed.protocol);
    console.log('Host:', parsed.host);
    // Do not print password or full path
  } catch (e) {
    console.log('Invalid URL format');
  }
}
