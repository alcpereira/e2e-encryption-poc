import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Ugly but working proof of concept for E2E encryption</h1>
      <Link to="/tweet/">
        With (E2E encrypted) data persistance on the backend
      </Link>
      <br />
      <Link to="/client/">
        With data living only in the URL - Nothing is sent to the server
      </Link>
    </div>
  );
}
