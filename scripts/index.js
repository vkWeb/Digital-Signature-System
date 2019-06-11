// Initialize maximum hash value
let MAX_HASHVALUE = 100;

// Generates hash value
function hashTheMessage(message) {
  let hashValue = 0;

  // Iterate over message adding
  // each character's ASCII value
  for (
    let index = 0, messageLength = message.length;
    index < messageLength;
    index++
  ) {
    hashValue += message.charCodeAt(index);
  }

  // return the hash value but in bounds of MAX_HASHVALUE
  return hashValue % MAX_HASHVALUE;
}

console.log(hashTheMessage("Buy 100 shares of AAPL"));
