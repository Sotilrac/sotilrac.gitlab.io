#!/usr/bin/env node
// Decrypt a contact value produced by encrypt-contact.mjs.
//
// usage:
//   node _tools/decrypt-contact.mjs --key '<password>' --text '<base64>'
//
// Useful for verifying that a stored _data/resume.yml value matches a
// given password without firing up the browser.

import { webcrypto } from "node:crypto";

import cryptoParams from "./contact-crypto.mjs";
import { parseArgs } from "./lib.mjs";

const HEADER = cryptoParams.saltBytes + cryptoParams.ivBytes;

async function main() {
  const args = parseArgs(process.argv.slice(2), ["key", "text"]);
  if (args.help || !args.key || !args.text) {
    console.error(
      "usage: node _tools/decrypt-contact.mjs --key '<password>' --text '<base64>'",
    );
    process.exit(args.help ? 0 : 1);
  }

  const data = Uint8Array.from(Buffer.from(args.text, "base64"));
  if (data.length < HEADER) {
    console.error("payload too short");
    process.exit(1);
  }
  const salt = data.slice(0, cryptoParams.saltBytes);
  const iv = data.slice(cryptoParams.saltBytes, HEADER);
  const ct = data.slice(HEADER);

  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(args.key),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const aesKey = await webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: cryptoParams.iterations,
      hash: cryptoParams.hash,
    },
    baseKey,
    { name: "AES-GCM", length: cryptoParams.keyBits },
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
