import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/", // Seu repositório
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        comunidades: resolve(__dirname, "pages/comunidades.html"),
        pastorais: resolve(__dirname, "pages/pastorais.html"),
        horarios: resolve(__dirname, "pages/horarios.html"),
        eventos: resolve(__dirname, "pages/eventos.html"),
        proximos_eventos: resolve(__dirname, "pages/proximos-eventos.html"),
        acampamento: resolve(__dirname, "pages/acampamento.html"),
        "evento-detalhe": resolve(__dirname, "pages/evento-detalhe.html"),
        "pastoral-detalhe": resolve(__dirname, "pages/pastoral-detalhe.html"),
        "comunidade-detalhe": resolve(
          __dirname,
          "pages/comunidade-detalhe.html"
        ),
      },
    },
  },
});
