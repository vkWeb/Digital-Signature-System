"use strict";

// Initialize maximum hash value
let MAX_HASHVALUE = 100;

// Generates hash value
function hashTheMessage(message) {
  let hashValue = 0;

  // Iterate over message adding
  // each character's ASCII value
  for (let i = 0, msgLength = message.length; i < msgLength; i++) {
    hashValue += message.charCodeAt(i);
  }

  // return the hash value but in bounds of MAX_HASHVALUE
  return hashValue % MAX_HASHVALUE;
}

function isCoPrime(smallerNum, largerNum) {
  for (let i = 2; i <= smallerNum; ++i) {
    if (smallerNum % i == 0 && largerNum % i == 0) {
      return false;
    }
  }
  return true;
}

function generatePrivateKey(N, phiOfN) {
  for (let i = 2; i < phiOfN; ++i) {
    if (isCoPrime(i, N) && isCoPrime(i, phiOfN)) {
      return i;
    }
  }

  console.log("\nPrivate key can't be generated. Returning 0...");
  return 0;
}

function generatePublicKey(privateKey, phiOfN) {
  let publicKey = 1;
  while (true) {
    if ((publicKey * privateKey) % phiOfN == 1 && privateKey !== publicKey) {
      break;
    }
    ++publicKey;
  }

  return publicKey;
}

// Generate key pairs using RSA algorithm
function generateKeyPairsRSA(firstPrime, secondPrime) {
  let N = firstPrime * secondPrime;
  let phiOfN = (firstPrime - 1) * (secondPrime - 1);
  let privateKey = generatePrivateKey(N, phiOfN);
  let publicKey = generatePublicKey(privateKey, phiOfN);
}

generateKeyPairsRSA(2, 7);
