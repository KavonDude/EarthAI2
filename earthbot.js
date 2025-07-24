const chatLog = document.getElementById("chat-log");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const speedOfText = 0.01; // in miliseconds
let texting = false;
const starterQuestions = [
  "How big is my carbon footprint?",
  "What are some good renewable energy sources?",
  "Is climate change reversible?",
  "How can i help the planet?",
  "What causes global warming?",
  "What is the greenhouse effect?",
  "How does plastic affect the ocean?",
  "Why are forests being cut down?",
  "What is deforestation?",
  "How does eating meat affect the environment?",
  "How bad are fossil fuels?",
  "Can electric cars really help?",
  "What is sustainable living?",
  "What are carbon offsets?",
  "How much water do i waste daily?",
  "Is recycling even effective?",
  "What are microplastics?",
  "How does climate change affect animals?",
  "Why is biodiversity important?",
  "What is the Paris Agreement?",
  "What can i do to help?",
  "How do trees help us?",
  "How much energy does the average home use?",
  "What are some ways to save water?",
  "Whats the difference between climate and weather?",
  "Are paper straws actually helpful?",
  "Does walking contribute to your carbon footprint?",
  "How can i make my diet more eco-friendly?",
  "How can cities become more sustainable?",
  "How does composting help the earth?",
  "Is the earth running out of natural resources?",
  "How does climate change affect wildlife?",
  "What countries are leading in clean energy?",
  "How can i reduce food waste?",
  "What are the best apps for tracking eco habits?",
  "How do carbon footprints differ across countries?",
  "Are electric planes the future of travel?",
  "Can planting native species improve my local ecosystem?",
  "How do climate policies impact global economies?",
  "What role does fashion play in environmental damage?",
  "Should we be worried about fast furniture?",
  "Is the circular economy the solution?",
  "How does urban heat affect vulnerable communities?",
  "Do e-waste recycling programs really work?",
  "Can algae be used as biofuel?",
  "What are climate refugees?",
  "How does greenwashing mislead consumers?",
  "Are rooftop gardens worth it?",
  "Can we rebuild coral reefs artificially?",
  "What is the carbon cost of streaming movies?",
  "Is nuclear energy truly clean?",
  "How does air pollution affect mental health?",
  "Should companies be taxed for pollution?",
  "What’s the environmental impact of cryptocurrency?",
  "Can technology solve climate change?",
  "How do solar panels get recycled?",
  "Are biodegradable products actually biodegradable?",
  "How does regenerative agriculture work?",
  "What’s the connection between climate and public health?",
  "Can carbon capture really clean the air?",
  "What’s the deal with eco-anxiety?",
  "Are electric bikes better than public transit?",
  "How does noise pollution affect wildlife?",
  "Why is soil health crucial to climate resilience?",
  "Is vertical farming a sustainable alternative?",
  "What are the most energy-efficient home upgrades?",
  "Can AI help us fight climate change?",
  "How do local actions ripple into global impact?"
];
//declare prompt up here for simplicity
const prompt = "You are Earth, personified. You speak like a fun teenager, not a science teacher. Keep responses short (1–2 sentences max). When asked about climate or environmental issues, explain clearly, honestly, and in plain, but interesting, language. Don’t lecture. Add a helpful suggestion or call to action when relevant. If a question is unclear, ask for clarification. Stay fun, friendly, and informative"

//get a question thats not used
function getNewQuestion(excludeList) {
  const filtered = starterQuestions.filter(q => !excludeList.includes(q));
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function fitTextToButton(button, maxFontSize = 16, minFontSize = 10) {
  let fontSize = maxFontSize;
  button.style.fontSize = fontSize + "px";
  button.style.whiteSpace = "nowrap"; // keep text on one line

  const containerWidth = button.offsetWidth;

  while (button.scrollWidth > containerWidth && fontSize > minFontSize) {
    fontSize -= 1;
    button.style.fontSize = fontSize + "px";
  }
}

//create button
function createQuestionButton(container, currentQuestions) {
  const qText = getNewQuestion(currentQuestions);
  const button = document.createElement("button");
  button.textContent = qText;
  button.classList.add("question-button");
  fitTextToButton(button); // shrink font to fit after it's in the DOM
  button.onclick = () => {
    if (texting == false){
      document.getElementById("user-input").value = qText;
      document.getElementById("send-btn").click();
      container.removeChild(button); //remove button

    //create new button
      const currentTexts = Array.from(container.children).map(c => c.textContent);
      const newButton = createQuestionButton(container, currentTexts);
      container.appendChild(newButton);
    }
  };
  return button;
}

//inital buttons
function setupStarterQuestions() {
  const container = document.getElementById("starter-questions");
  container.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const button = createQuestionButton(container, []);
    container.appendChild(button);
  }
}
if(document.getElementById("starter-questions").innerHTML === ""){
  setupStarterQuestions();
}



// this is where ai is declared kinda
const messages = [
  {
    role: "system",
    content:
      prompt,
  },
];

//enter mechanic
sendBtn.addEventListener("click", ()=>{
  if (!texting){
    sendMessage();
    texting = true;
  }
})
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !texting){
    sendMessage();
    texting= true;
  }
});

//function to send a message as the "user"
//also create the bubble text thing
function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("bubble", sender);
  // msg.textContent = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;

  let i = 0;
  const speed = speedOfText; // milliseconds per character

  function typeLetter() {
    if (i < text.length) {
      msg.textContent += text.charAt(i);
      i++;
      setTimeout(typeLetter, speed);
     
    }
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  typeLetter();

  if (sender == "earth"){
    msg.style.background="#e5e5ea"
  }
  if (sender == "user"){
    msg.style.background = "#0084ff"
  }
}

//send message to the ai
async function sendMessage() {
  const input = userInput.value.trim();
  console.log(input);
  if (!input) return; // if undefined kill program

  appendMessage(input, "user"); 
  messages.push({ role: "user", content: input });

  messages.push({
    role: "system",
    content:
      "REMEMBER ONLY SHORT ANSWERS! ABOUT 2-3 SENTANCES",
  });
  userInput.value = "";

  setTimeout(()=>{
    appendMessage("...", "earth");
  },2000);

  //THE BEST TRY CATCH IN THE WORLD
  try {
    const response = await fetch("https://yourdomain.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: messages,
        temperature: 0.7
      }),
    });
    const data = await response.json();
    console.log(data.choices?.[0]?.message?.content)
    console.log("tokens: ", data.usage?.completion_tokens, " prompt tokens: ", data.usage?.prompt_tokens, " Total Tokens: ", data.usage?.total_tokens)
    const reply = data.choices?.[0]?.message?.content || "somehting went wrong";
    messages.push({ role: "assistant", content: reply });

    // remove typing...o
    setTimeout(()=>{
      // chatLog.removeChild(chatLog.lastChild);
      // appendMessage(reply, "earth");
      // chatLog.lastChild.textContent = reply;
      let i = 0;
      const speed = speedOfText; // milliseconds per character
      chatLog.lastChild.textContent = "";

      function typeLetter() {
       if (i < reply.length) {
          chatLog.lastChild.textContent += reply.charAt(i);
          i++;
          setTimeout(typeLetter, speed);
          if(chatLog.scrollHeight - chatLog.scrollTop - chatLog.clientHeight < 50){
            chatLog.scrollTop = chatLog.scrollHeight;
          }
         
        }
        else if (chatLog.lastChild.classList == "bubble earth"){
            texting = false;
        }
       
      }

      typeLetter();
    },2000);

  } catch (err) {
    chatLog.removeChild(chatLog.lastChild);
    appendMessage("death", "earth");
    console.error(err);
  }
}