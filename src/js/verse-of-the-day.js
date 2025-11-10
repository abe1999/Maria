// Local: /src/js/components/verse-of-the-day.js - VERSÃO FINAL

// Seu token pessoal, que você já conseguiu
const MEU_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJNb24gTm92IDEwIDIwMjUgMTc6MDc6MTYgR01UKzAwMDAuYWJlcHJvMTBAaG90bWFpbC5jb20iLCJpYXQiOjE3NjI3OTQ0MzZ9.gqKS9xBWqo8Tdvp7ziwUBIx_WdYcKo8W6RIgfmyfUA4";

export async function loadVerseOfDay() {
  const verseContainer = document.getElementById("verse-container");
  if (!verseContainer) return;

  try {
    // 1. O "Pedido" para a API CORRETA (abibliadigital)
    const response = await fetch(
      "https://www.abibliadigital.com.br/api/verses/nvi/random",
      {
        method: "GET",
        headers: {
          // 2. A "Chave" (Token) que o servidor deles exige
          Authorization: `Bearer ${MEU_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Erro na resposta da API:", response);
      throw new Error("Falha ao buscar o versículo. Verifique seu Token.");
    }

    // 3. O "Prato" (A resposta em JSON)
    const data = await response.json();

    // 4. Pegando os dados do prato
    const verseText = data.text;
    const verseReference = `${data.book.name} ${data.chapter}:${data.number}`; // Ex: "João 3:16"

    // 5. Colocando na "mesa" (no HTML)
    verseContainer.innerHTML = `
            <blockquote>${verseText}</blockquote>
            <cite>${verseReference}</cite>
        `;
  } catch (error) {
    console.error("Erro ao carregar versículo do dia:", error);
    verseContainer.innerHTML = `<p style="color: red;">Não foi possível carregar o versículo. Tente novamente mais tarde.</p>`;
  }
}
