"use strict";

// Note: Fix the hard coded values
// Initialize maximum hash value
let MAX_HASHVALUE = 14;

// Generate the hash value
function hashTheMessage(message) {
  let hashValue = 0;
  for (let i = 0, msgLength = message.length; i < msgLength; i++) {
    hashValue += message.charCodeAt(i);
  }
  return hashValue % MAX_HASHVALUE;
}

// Find whether the numbers are co-prime
function isCoPrime(smallerNum, largerNum) {
  for (let i = 2; i <= smallerNum; ++i) {
    if (smallerNum % i === 0 && largerNum % i === 0) {
      return false;
    }
  }
  return true;
}

// Generate private key
function generatePrivateKey(N, phiOfN) {
  for (let i = 2; i < phiOfN; ++i) {
    if (isCoPrime(i, N) && isCoPrime(i, phiOfN)) {
      return i;
    }
  }

  console.log("\nPrivate key can't be generated. Returning 0...");
  return 0;
}

// Generate public key
function generatePublicKey(privateKey, phiOfN) {
  let publicKey = 1;
  while (true) {
    if ((publicKey * privateKey) % phiOfN === 1 && privateKey !== publicKey) {
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

  let keyPairs = {
    privateKey: [privateKey, N],
    publicKey: [publicKey, N]
  };

  return keyPairs;
}

let hashValue = hashTheMessage("Hello world");
console.log("Hash value of message is ", hashValue);

let keyPairs = generateKeyPairsRSA(2, 7);
console.log(
  "Private key = ",
  keyPairs.privateKey[0],
  " Public key = ",
  keyPairs.publicKey[0],
  " N = ",
  keyPairs.publicKey[1]
);

function generateSignature() {
  let digitalSignature =
    Math.pow(hashValue, keyPairs.privateKey[0]) % keyPairs.privateKey[1];
  return digitalSignature;
}

function decryptSignature(digitalSignature) {
  let decryptedSignature =
    Math.pow(digitalSignature, keyPairs.publicKey[0]) % keyPairs.publicKey[1];
  return decryptedSignature;
}

let digitalSignature = generateSignature();
console.log("Signature generated is = ", digitalSignature);

let decryptedSignature = decryptSignature(digitalSignature);
console.log("Decrypted signature = ", decryptedSignature);

if (hashValue === decryptedSignature) {
  console.log("Signature Verified! :tada:");
} else {
  console.log("Ooops, something is wrong.");
}
