import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Tweet persistance in a JSON database but fully encrypted</h1>
      <p>No tweet response yet implemented 😅</p>
      <Link to="/tweet/new">Create a new tweet</Link>
      <br />
      <Link to="/tweet/2#QWQeqrHeDlv5b1GZbGNkfA">Simple example</Link>
      <br />
      <Link to="/tweet/2#wrongKey">With wrong key</Link>
      <br />
      <Link to="/">Go back</Link>
    </div>
  );
}
