// Arquivo: src/pages/horarios.js
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/pages/horarios.css";

import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
