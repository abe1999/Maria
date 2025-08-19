// Arquivo: src/pages/horarios.js
import "../styles/base/reset.css";
import "../styles/base/variables.css";
import "../styles/base/typography.css";
import "../styles/components/header.css";
import "../styles/components/footer.css";
import "../styles/pages/horarios.css";

import { renderHeader } from "../components/Header.js";
import { renderFooter } from "../components/Footer.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
