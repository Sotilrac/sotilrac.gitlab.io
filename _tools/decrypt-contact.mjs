#!/usr/bin/env node
// Decrypt a contact value produced by encrypt-contact.mjs.
//
// usage:
//   node _tools/decrypt-contact.mjs --key '<password>' --text '<base64>'
//
// Useful for verifying that a stored _data/resume.yml value matches a
// given password without firing up the browser.

import { webcrypto } from "node:crypto";

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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.key || !args.text) {
    console.error(
      "usage: node _tools/decrypt-contact.mjs --key '<password>' --text '<base64>'",
    );
    process.exit(args.help ? 0 : 1);
  }

  const data = Uint8Array.from(Buffer.from(args.text, "base64"));
  if (data.length < 28) {
    console.error("payload too short");
    process.exit(1);
  }
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const ct = data.slice(28);

  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(args.key),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const aesKey = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 200000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const pt = await webcrypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ct,
  );
  process.stdout.write(new TextDecoder().decode(pt) + "\n");
}

main().catch((e) => {
  console.error("decrypt failed:", e.message || e);
  process.exit(2);
});
