// Web3Forms access key for the footer contact form. The key maps to the
// recipient address on web3forms.com, which is why neither is in the repo:
// CI reads it from the WEB3FORMS_KEY variable, `make dev` from .env.
export default { key: process.env.WEB3FORMS_KEY ?? "" };
