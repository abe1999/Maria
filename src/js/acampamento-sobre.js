// Local: /src/js/acampamento-sobre.js

// Importa os estilos globais
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/components/article.css";

// Importa o estilo específico desta página
import "/src/styles/pages/acampamento-sobre.css";

// Importa os componentes de Header e Footer
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";

// Monta a página
renderHeader();
renderFooter();
