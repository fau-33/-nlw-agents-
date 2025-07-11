const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const aiResponse = document.getElementById("aiResponse");
const form = document.getElementById("form");

// AIzaSyDY4D9Ut3fb7cMkaIlY8HYNnnfuM3Xh5sI
const perguntaAi = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash";
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const pergunta = `
    olha, tenho esse jogo: ${game} e queria saber ${question}
  `;
  const contents = [
    {
      parts: [
        {
          text: pergunta,
        },
      ],
    },
  ];
  // Chamada API
  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
    }),
  });

  const data = await response.json();

  return data.candidates[0].contents.parts[0].text;
};

const enviarFormulario = async (e) => {
  e.preventDefault();
  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apiKey == "" || game == "" || question == "") {
    alert("Preencha todos os campos para enviar a sua pergunta.");
    return;
  }

  askButton.disabled = true;
  askButton.textContent = "Perguntando...";
  askButton.classList.add("loading");

  try {
    // pergunta para IA
    const text = await perguntaAi(question, game, apiKey);
    aiResponse.querySelector(".response-content").innerHTML = text;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Perguntar";
    askButton.classList.remove("loading");
  }
};

form.addEventListener("submit", enviarFormulario);
