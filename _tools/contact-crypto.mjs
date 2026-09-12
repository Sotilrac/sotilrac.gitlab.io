// Crypto parameters shared by encrypt-contact.mjs, decrypt-contact.mjs and the
// browser decryptor in _includes/footer.njk (via _data/contactCrypto.mjs).
// Changing any of these invalidates every payload already in _data/resume.yml.

export default {
  iterations: 200000,
  hash: "SHA-256",
  saltBytes: 16,
  ivBytes: 12,
  keyBits: 256,
};
