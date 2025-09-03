import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Não definimos mais 'root'. O Vite usará a raiz do projeto como padrão.
  base: "/",
  build: {
    // A pasta 'dist' será criada na raiz, o que é o padrão.
    outDir: "dist",
    rollupOptions: {
      input: {
        // O 'main' aponta para o index.html na raiz.
        main: resolve(__dirname, "index.html"),

        // As outras páginas apontam para seus respectivos arquivos dentro de 'src'.
        comunidades: resolve(__dirname, "src/pages/comunidades.html"),
        pastorais: resolve(__dirname, "src/pages/pastorais.html"),
        horarios: resolve(__dirname, "src/pages/horarios.html"),
        eventos: resolve(__dirname, "src/pages/eventos.html"),
        proximos_eventos: resolve(__dirname, "src/pages/proximos-eventos.html"),
        acampamento: resolve(__dirname, "src/pages/acampamento.html"),
        "voce-sabia": resolve(__dirname, "src/pages/voce-sabia.html"),
        "voce-sabia-detalhe": resolve(
          __dirname,
          "src/pages/voce-sabia-detalhe.html"
        ),
        "evento-detalhe": resolve(__dirname, "src/pages/evento-detalhe.html"),
        "pastoral-detalhe": resolve(
          __dirname,
          "src/pages/pastoral-detalhe.html"
        ),
        "comunidade-detalhe": resolve(
          __dirname,
          "src/pages/comunidade-detalhe.html"
        ),

        login: resolve(__dirname, "src/admin/login.html"),
        dashboard: resolve(__dirname, "src/admin/dashboard.html"),
        editor: resolve(__dirname, "src/admin/editor.html"),
        gerenciarDestaques: resolve(
          __dirname,
          "src/admin/gerenciar-destaques.html"
        ),
        editorDestaque: resolve(__dirname, "src/admin/editor-destaque.html"),
        editorVoceSabia: resolve(__dirname, "src/admin/editor-voce-sabia.html"),
        gerenciarVoceSabia: resolve(
          __dirname,
          "src/admin/gerenciar-voce-sabia.html"
        ),
      },
    },
  },
});
