import App from "next/app";

import "normalize.css";

import Store from "../store/Store";

// The user's data does not exist on the server, so there's no need to attempt
// to access it if we're not on the client.
if (process.browser) {
  Store.init();
}

export default App;
