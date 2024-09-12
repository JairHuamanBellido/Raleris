export class EncryptionService {
  static async encryptText(text: string, publicKey: CryptoKey) {
    try {
      const encodedMessage = new TextEncoder().encode(text);

      const bufferedMessage = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        publicKey,
        encodedMessage
      );

      const encrpytedText = Buffer.from(bufferedMessage).toString("binary");

      return encrpytedText;
    } catch (error) {
      throw new Error("INVALID PUBLIC KEY");
    }
  }

  static async decryptText(encryptedMessage: string, privateKey: CryptoKey) {
    try {
      const decryptedMessage = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        Buffer.from(encryptedMessage, "binary")
      );
      return new TextDecoder().decode(decryptedMessage);
    } catch (error) {
      throw new Error("INVALID PRIVATE KEY");
    }
  }

  static async signMessage(message: string, privateKey: CryptoKey) {
    try {
      const encoder = new TextEncoder();
      const encodedMessage = encoder.encode(message);

      return await window.crypto.subtle.sign(
        {
          name: "RSA-PSS",
          saltLength: 32,
        },
        privateKey,
        encodedMessage
      );
    } catch (error) {
      throw new Error("ERROR ON GENERATURE SIGNATURE!");
    }
  }

  static async verifySignature(
    message: string,
    publicKey: CryptoKey,
    signature: ArrayBuffer
  ) {
    try {
      const encoder = new TextEncoder();
      const encodedMessage = encoder.encode(message);

      return await crypto.subtle.verify(
        {
          name: "RSA-PSS",
          saltLength: 32,
        },
        publicKey,
        signature,
        encodedMessage
      );
    } catch (error) {
      throw new Error("ERROR ON VERIFY SIGNATURE! INVALID PUBLIC KEY");
    }
  }
}
