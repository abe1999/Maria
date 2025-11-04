import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),

        // Páginas Públicas
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
        "acampamento-inscricoes": resolve(
          __dirname,
          "src/pages/acampamento-inscricoes.html"
        ),
        //...
        acampamento: resolve(__dirname, "src/pages/acampamento.html"),
        // ADICIONE A NOVA PÁGINA AQUI
        "acampamento-sobre": resolve(
          __dirname,
          "src/pages/acampamento-sobre.html"
        ),
        "acampamento-galeria": resolve(
          __dirname,
          "src/pages/acampamento-galeria.html"
        ),

        //...

        // Páginas do Admin
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
        editorAcampamento: resolve(
          __dirname,
          "src/admin/acampamento/editor-acampamento.html"
        ),
        // ## CORREÇÃO AQUI: A linha abaixo foi movida para dentro do objeto 'input' ##
        gerenciarAcampamentos: resolve(
          __dirname,
          "src/admin/acampamento/gerenciar-acampamentos.html"
        ),
        relatorioInscricoes: resolve(
          __dirname,
          "src/admin/relatorio-inscricoes.html"
        ),
      },
    },
  },
});
