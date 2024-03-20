import SiteFooter from "./components/layout/site-footer";
import SiteHeader from "./components/layout/site-header";
import Translator from "./components/translator";

import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <Toaster />
      <main className="flex-1">
        <Translator />
      </main>
      <SiteFooter />
    </div>
  );
}
