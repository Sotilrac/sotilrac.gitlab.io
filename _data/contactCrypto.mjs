// Exposes the contact-decryption parameters to _includes/footer.njk so the
// template and _tools/encrypt-contact.mjs can never drift apart.
export { default } from "../_tools/contact-crypto.mjs";
