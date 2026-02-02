import { createApp } from "@backstage/frontend-defaults";
// eslint-disable-next-line @backstage/no-undeclared-imports
import { createRoot } from "react-dom/client";
import catalogPlugin from "@backstage/plugin-catalog/alpha";

import plugin from "../src/alpha";

// eslint-disable-next-line @backstage/no-ui-css-imports-in-non-frontend
import "@backstage/ui/css/styles.css";

const app = createApp({
  features: [plugin, catalogPlugin],
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(app.createRoot());
