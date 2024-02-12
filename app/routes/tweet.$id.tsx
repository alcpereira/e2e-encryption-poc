import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { readTweet } from "../utils/db";
import { generateKey, decryptTweet } from "../utils/encryptUtils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return json(readTweet(Number(params.id)));
};

export const action = async () => {
  // TODO: Make the threads part here!
};

export default function Index() {
  const encryptedTweets = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [decryptedTweet, setDecryptedTweet] = useState<string>(
    "Decrypting tweet..."
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1);

    if (hash) {
      generateKey(hash)
        .then((key) => {
          decryptTweet(encryptedTweets.tweet, key.cryptoKey)
            .then((tweet) => {
              setDecryptedTweet(tweet);
            })
            .catch(() => {
              navigate("/tweet/bad");
            });
        })
        .catch(() => {
          navigate("/tweet/bad");
        });
    } else {
      navigate("/tweet/bad");
    }
  }, [encryptedTweets, navigate]);

  return (
    <div>
      <h1>Here is your secret message</h1>
      <p>{decryptedTweet}</p>
    </div>
  );
}
