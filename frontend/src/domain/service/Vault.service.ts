import { str2ab } from "@/lib/utils";

const encryptAlgorithm = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  extractable: true,
  hash: {
    name: "SHA-256",
  },
};
export class VaultService {
  static async importPrivateKey(key: string) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = key.substring(
      pemHeader.length,
      key.length - pemFooter.length - 1
    );

    const binaryDerString = window.atob(pemContents);

    const binaryDer = str2ab(binaryDerString);

    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      encryptAlgorithm,
      true,
      ["decrypt"]
    );

    return privateKey;
  }

  static async importSignedPrivateKey(key: string) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = key.substring(
      pemHeader.length,
      key.length - pemFooter.length - 1
    );

    const binaryDerString = window.atob(pemContents);

    const binaryDer = str2ab(binaryDerString);

    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      { name: "RSA-PSS", hash: { name: "SHA-256" } },
      true,
      ["sign"]
    );

    return privateKey;
  }

  static async importPublicKey(pem: string) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
      pemHeader.length,
      pem.length - pemFooter.length - 1
    );

    const binaryDerString = window.atob(pemContents);

    const binaryDer = str2ab(binaryDerString);
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      encryptAlgorithm,
      true,
      ["encrypt"]
    );

    return publicKey;
  }
  static async importVerifiedPublicKey(pem: string) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
      pemHeader.length,
      pem.length - pemFooter.length - 1
    );

    const binaryDerString = window.atob(pemContents);

    const binaryDer = str2ab(binaryDerString);
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      { name: "RSA-PSS", hash: { name: "SHA-256" } },
      true,
      ["verify"]
    );

    return publicKey;
  }
}
