import { Link } from "@remix-run/react";

export default function PasBien() {
  return (
    <div>
      <h1>What are you trying to do?</h1>
      <Link to="/tweet">Go back to the main page</Link>
    </div>
  );
}
