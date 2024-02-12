import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { addTweet } from "../utils/db";
import {
  encryptTweet,
  generateKey,
  type KeyObject,
} from "../utils/encryptUtils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const encryptedData = formData.get("encrypted-data");

  if (!encryptedData) {
    throw new Error("Oh no! Something went wrong!");
  }

  const newId = addTweet(encryptedData.toString());
  console.log(newId);

  return json({ ok: newId });
};

export default function NewTweet() {
  const actionData = useActionData<typeof action>();

  const [key, setKey] = useState<KeyObject>({} as KeyObject);
  const [encryptedTweet, setEncryptedTweet] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    generateKey(hash).then((key) => {
      setKey(key);
    });
  }, []);

  const handleTweetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Should debounce this function?
    const tweet = event.target.value;
    encryptTweet(tweet, key.cryptoKey).then((tweet) =>
      setEncryptedTweet(tweet)
    );
  };

  const formatUrl = (id: number, key: string) => {
    return `/tweet/${id}#${key}`;
  };

  return (
    <div>
      <h1>Send a secret message</h1>
      <Form method="POST">
        <label>
          Tweet:
          <input type="text" onChange={handleTweetChange} />
        </label>
        <input type="hidden" name="encrypted-data" value={encryptedTweet} />
        <button type="submit">Submit</button>
      </Form>
      {actionData && (
        <p>
          Your secret message link is{" "}
          <Link to={formatUrl(actionData.ok, key.k)}>here</Link>
        </p>
      )}
    </div>
  );
}
