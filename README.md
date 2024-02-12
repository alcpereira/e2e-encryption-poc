# E2E Encryption POC

## How to run

```
npm install
npm run dev
```

It should open on [http://localhost:3000](http://localhost:3000)

## With server

A simple JSON database stores the tweets encrypted on the client. For now only a single tweet can be shared (no threads yet 😢), as I misread the requirements and pivoted to client-only solution below.

## With client only

The data is encrypted and lives in the URI. I used [lz-string](https://github.com/pieroxy/lz-string/) to compress it.

## Key learnings
- E2E Encryption isn't that complicated using Web Crypto API
- [Remix](https://www.remix.run/) is cool
- I need to learn more about Array Buffers
- I really need to work on my `await` syntax skills to avoid callback hells, for example in `useEffect`

## To go further
- Implement Tweet responses on Server POC
- A bit of styling
- Resolve the issue with parsing (some `"` are added 🤔)
- More features (username for example)