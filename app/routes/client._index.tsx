import { useEffect, useState } from "react";
import lz from "lz-string";
import {
  KeyObject,
  decryptTweet,
  encryptTweet,
  generateKey,
} from "~/utils/encryptUtils";
import { Link, useResolvedPath } from "@remix-run/react";

// Lame fix after several tries
const SEPARATOR = "---";

export default function Test() {
  const [url, setURL] = useState<string>("");
  const [decryptedTweets, setDecryptedTweets] = useState<string[]>([]);
  const [key, setKey] = useState<KeyObject>({} as KeyObject);
  const [tweetInput, setTweetInput] = useState<string>("");

  const resolvedPath = useResolvedPath(url);

  const onTweetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTweetInput(e.target.value);
  };

  const onAddTweet = () => {
    setDecryptedTweets([...decryptedTweets, tweetInput]);
    setTweetInput("");
  };

  const onSubmitTweet = () => {
    if (!key || !key.cryptoKey) {
      throw new Error("No crypto key found!");
    }

    const jsonString = decryptedTweets.join(SEPARATOR);
    encryptTweet(jsonString, key.cryptoKey).then((encryptedTweets) => {
      const data = lz.compressToEncodedURIComponent(encryptedTweets);
      setURL(`../client/#k=${key.k}&d=${data}`);
    });
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const searchParams = new URLSearchParams(hash);
    const k = searchParams.get("k");
    const data = searchParams.get("d");

    const setKeyAsync = async (k: string | null) => {
      const keyObj = await generateKey(k ?? "");
      setKey(keyObj);
      return keyObj;
    };

    setKeyAsync(k).then((keyObj) => {
      if (data !== null) {
        const decompressedData = lz.decompressFromBase64(data);
        decryptTweet(decompressedData, keyObj.cryptoKey).then((decrypted) => {
          const array = decrypted.slice(1, -1).split(SEPARATOR);
          console.log("wut", array, typeof array, decrypted);
          setDecryptedTweets(array);
        });
      } else {
        setDecryptedTweets([]);
      }
    });
  }, []);

  return (
    <div>
      <h1>Client only - Encrypted thread</h1>

      <label htmlFor="tweet">Add tweet</label>
      <input
        type="text"
        id="tweet"
        value={tweetInput}
        onChange={onTweetInputChange}
      />
      <br />
      <button onClick={onAddTweet}>Add Tweet</button>
      {decryptedTweets.map((tweet, i) => (
        <p key={i}>{tweet}</p>
      ))}
      <br />
      <button onClick={onSubmitTweet}>Save</button>
      {url.length > 0 && (
        <p>
          URL:{" "}
          <Link to={resolvedPath} reloadDocument>
            {url}
          </Link>
        </p>
      )}
    </div>
  );
}
