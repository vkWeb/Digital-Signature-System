"use strict";

const signBtn = document.querySelector("#sign-btn");
const transmitBtn = document.querySelector("#transmit-btn");
const verifyBtn = document.querySelector("#verify-btn");
const messageBox = document.querySelector("#message-to-be-sent");
const receivedMessageBox = document.querySelector("#received-message");
const generatedSignature = document.querySelector("#generated-signature");
const receivedSignature = document.querySelector("#received-signature");
const verificationStatus = document.querySelector("#verification-status");

const firstPrime = 7;
const secondPrime = 2;
const N = firstPrime * secondPrime;
const phiOfN = (firstPrime - 1) * (secondPrime - 1);
let publicKey = 0;

function hashTheMessage(message) {
  let hashValue = 0;
  for (let i = 0, msgLength = message.length; i < msgLength; ++i) {
    hashValue += message.charCodeAt(i);
  }
  return hashValue % N === 0 ? 1 : hashValue % N;
}

function isCoPrime(smallerNum, largerNum) {
  for (let i = 2; i <= smallerNum; ++i) {
    if (smallerNum % i === 0 && largerNum % i === 0) {
      return false;
    }
  }
  return true;
}

function generatePrivateKey() {
  for (let i = 2; i < phiOfN; ++i) {
    if (isCoPrime(i, N) && isCoPrime(i, phiOfN)) {
      return i;
    }
  }

  console.log("\nPrivate key can't be generated.");
  return 0;
}

function generatePublicKey(privateKey) {
  if (!privateKey) {
    console.log("\nPublic key can't be generated.");
  } else {
    publicKey = 1;
    while (privateKey) {
      if ((publicKey * privateKey) % phiOfN === 1 && privateKey !== publicKey) {
        return;
      }
      publicKey += 1;
    }
  }
}

function generateSignature(hashValue, privateKey) {
  return Math.pow(hashValue, privateKey) % N;
}

function decryptSignature(digitalSignature) {
  return Math.pow(digitalSignature, publicKey) % N;
}

signBtn.addEventListener("click", function() {
  let hashValue = hashTheMessage(messageBox.value);
  let privateKey = generatePrivateKey();
  generatePublicKey(privateKey);

  generatedSignature.innerHTML = generateSignature(
    hashValue,
    privateKey
  ).toString();

  transmitBtn.disabled = false;
});

messageBox.addEventListener("input", function() {
  generatedSignature.innerHTML = "none";
  transmitBtn.disabled = true;
});

transmitBtn.addEventListener("click", function() {
  receivedMessageBox.value = messageBox.value;
  receivedSignature.innerHTML = generatedSignature.textContent;
  verificationStatus.innerHTML = "";
  verifyBtn.disabled = false;
});

verifyBtn.addEventListener("click", function() {
  let hashValue = hashTheMessage(receivedMessageBox.value);
  let decryptedSignature = decryptSignature(
    parseInt(receivedSignature.textContent)
  );

  if (hashValue === decryptedSignature) {
    verificationStatus.innerHTML = "Success! Signature is verified.";
  } else {
    verificationStatus.innerHTML =
      "Failure! There's something wrong with the signature.";
  }
});
