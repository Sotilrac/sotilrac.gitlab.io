#!/usr/bin/env node
// Encrypt a contact value for _data/resume.yml.
//
// Output is base64(salt[16] || iv[12] || ciphertext+tag), produced with
// AES-GCM using a 256-bit key derived from the password via PBKDF2-SHA256
// (200000 iterations). The browser-side decrypt lives in
// _includes/footer.njk and uses Web Crypto API.
//
// usage:
//   node _tools/encrypt-contact.mjs --key '<password>' --text '<plaintext>'
//
// Pipe stdin if the plaintext contains shell-unfriendly characters:
//   echo -n '+1 555 ...' | node _tools/encrypt-contact.mjs --key '<pw>'

import { webcrypto } from "node:crypto";

const ITERATIONS = 200000;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--key") out.key = argv[++i];
    else if (a === "--text") out.text = argv[++i];
    else if (a === "-h" || a === "--help") out.help = true;
  }
  return out;
}

async function readStdin() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data.replace(/\n$/, "");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.key) {
    console.error(
      "usage: node _tools/encrypt-contact.mjs --key '<password>' --text '<plaintext>'\n" +
        "       or pipe plaintext on stdin and omit --text",
    );
    process.exit(args.help ? 0 : 1);
  }
  const text = args.text != null ? args.text : await readStdin();
  if (!text) {
    console.error("error: empty plaintext");
    process.exit(1);
  }

  const enc = new TextEncoder();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));

  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    enc.encode(args.key),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const aesKey = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const ct = new Uint8Array(
    await webcrypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      enc.encode(text),
    ),
  );

  const out = new Uint8Array(salt.length + iv.length + ct.length);
  out.set(salt, 0);
  out.set(iv, salt.length);
  out.set(ct, salt.length + iv.length);
  process.stdout.write(Buffer.from(out).toString("base64") + "\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
