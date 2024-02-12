export type KeyObject = {
  /** k property of JSON Web Key to be stored in URL hash */
  k: string;
  /** CryptoKey object to encrypt/decrypt */
  cryptoKey: CryptoKey;
};

export async function generateKey(k?: string): Promise<KeyObject> {
  let cryptoKey: CryptoKey;

  if (!k || k.length === 0) {
    cryptoKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 128 },
      true,
      ["encrypt", "decrypt"]
    );

    k = (await window.crypto.subtle.exportKey("jwk", cryptoKey)).k;
    if (!k) {
      throw new Error("Key not generated");
    }
  } else {
    cryptoKey = await window.crypto.subtle.importKey(
      "jwk",
      {
        k,
        alg: "A128GCM",
        ext: true,
        key_ops: ["encrypt", "decrypt"],
        kty: "oct",
      },
      { name: "AES-GCM", length: 128 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  return { k, cryptoKey };
}

export async function decryptTweet(
  encryptedTweet: string,
  cryptoKey: CryptoKey
) {
  const buffer = Uint8Array.from(atob(encryptedTweet), (c) => c.charCodeAt(0));

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(12) },
    cryptoKey,
    buffer
  );
  return new window.TextDecoder().decode(new Uint8Array(decrypted));
}

export async function encryptTweet(tweet: string, cryptoKey: CryptoKey) {
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: new Uint8Array(12) },
    cryptoKey,
    new TextEncoder().encode(JSON.stringify(tweet))
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
