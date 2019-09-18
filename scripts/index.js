"use strict";

const signBtn = document.querySelector("#sign-btn");
const transmitBtn = document.querySelector("#transmit-btn");
const verifyBtn = document.querySelector("#verify-btn");
const messageBox = document.querySelector("#message-to-be-sent");
const receivedMessageBox = document.querySelector("#received-message");
const generatedSignature = document.querySelector("#generated-signature");
const receivedSignature = document.querySelector("#received-signature");
const verificationStatus = document.querySelector("#verification-status");

const firstPrime = 3;
const secondPrime = 19;
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

  console.log("Private key can't be generated.");
  return 0;
}

function generatePublicKey(privateKey) {
  publicKey = 1;
  while (privateKey) {
    if ((publicKey * privateKey) % phiOfN === 1 && privateKey !== publicKey) {
      return;
    }
    ++publicKey;
  }

  console.log("Public key can't be generated.");
  publicKey = 0;
}

function generateSignature(hashValue, privateKey) {
  return Number(BigInt(BigInt(hashValue) ** BigInt(privateKey)) % BigInt(N));
}

function decryptSignature(digitalSignature) {
  return Number(BigInt(BigInt(digitalSignature) ** BigInt(publicKey)) % BigInt(N));
}

messageBox.addEventListener("input", function () {
  generatedSignature.innerHTML = "none";
  transmitBtn.disabled = true;
});

signBtn.addEventListener("click", function () {
  const hashValue = hashTheMessage(messageBox.value);
  const privateKey = generatePrivateKey();
  generatePublicKey(privateKey);

  generatedSignature.innerHTML = generateSignature(
    hashValue,
    privateKey
  ).toString();

  transmitBtn.disabled = false;
});

transmitBtn.addEventListener("click", function () {
  receivedMessageBox.value = messageBox.value;
  receivedSignature.innerHTML = generatedSignature.textContent;
  verificationStatus.innerHTML = "";
  verifyBtn.disabled = false;
});

verifyBtn.addEventListener("click", function () {
  const hashValue = hashTheMessage(receivedMessageBox.value);
  const decryptedSignature = decryptSignature(
    parseInt(receivedSignature.textContent)
  );

  console.log("hashValue =", hashValue, "decryptedSignature =", decryptedSignature);
  if (hashValue === decryptedSignature) {
    verificationStatus.innerHTML = "Success! Data is verified.";
  } else {
    verificationStatus.innerHTML =
      "Failure! There's something wrong with the received data or signature.";
  }
});
