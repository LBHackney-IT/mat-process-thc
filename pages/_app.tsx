import { ComponentRegister } from "lbh-frontend-react/helpers/ComponentRegister";
import App from "next/app";
import Link from "next/link";

import "normalize.css";

ComponentRegister.init({
  components: {
    Link: props => <Link {...props} />
  }
});

export default App;
