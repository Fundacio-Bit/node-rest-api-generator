// This tool generates a Keccak256 hash from the password passed as parameter.
// Use: 'node generate_hashed_pwd <password_to_hash>'

const keccak256 = require('js-sha3').keccak256

if (process.argv.length < 3) {
  console.log('Error: Missing password parameter. Use: \'node generate_hashed_pwd.js <password_to_hash>\'')
} else {
  console.log('hashed password:', keccak256(process.argv[2]))
}
