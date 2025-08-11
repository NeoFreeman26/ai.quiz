let allQuestions = [];
let questions = [];
let currentIndex = 0;
let questionCount = 10;

// 載入 JSON 題庫
fetch("quiz.json")
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    if (!Array.isArray(data) || data.length === 0) {
      document.getElementById("question").textContent = "❌ 題庫載入失敗或為空。";
      return;
    }
    allQuestions = data;
    document.getElementById("start-btn").disabled = false;
  })
  .catch(err => {
    document.getElementById("question").textContent = "❌ 題庫載入錯誤：" + err.message;
  });

function shuffle(array) {
  const newArray = [...array]; 
  return newArray.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  const selectedCount = document.getElementById("question-count").value;
  questionCount = parseInt(selectedCount, 10);
  questions = shuffle(allQuestions).slice(0, questionCount).map(item => {
    const options = [item.選項A, item.選項B, item.選項C, item.選項D];
    const answerMap = {'A': 0, 'B': 1, 'C': 2, 'D': 3};
    return {
      question: item.題號與題目,
      options: options,
      answer: answerMap[item.答案],
      explanation: ""
    };
  });
  currentIndex = 0;
  document.getElementById("quiz-settings").style.display = "none";
  document.getElementById("quiz-box").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentIndex];
  if (!q || !q.question) {
    document.getElementById("question").textContent = `⚠️ 題目資料錯誤（第 ${currentIndex + 1} 題）`;
    return;
  }

  document.getElementById("question").textContent = `第 ${currentIndex + 1} 題：${q.question}`;
  const choicesEl = document.getElementById("choices");
  choicesEl.innerHTML = "";
  document.getElementById("explanation").textContent = "";

  q.options.forEach((opt, i) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.onclick = () => showExplanation(li, i);
    choicesEl.appendChild(li);
  });

  document.getElementById("next-btn").style.display = "none";
}

function showExplanation(selectedElement, selectedIndex) {
  const q = questions[currentIndex];
  const correctIndex = q.answer;
  
  const allChoices = document.querySelectorAll("#choices li");
  allChoices.forEach(li => {
    li.style.pointerEvents = "none"; // 禁用所有選項
  });

  let explanationText = "";
  if (selectedIndex === correctIndex) {
    selectedElement.style.background = "#4caf50";
    explanationText = "✅ 正確！";
  } else {
    selectedElement.style.background = "#f44336";
    allChoices[correctIndex].style.background = "#4caf50";
    explanationText = `❌ 錯誤，正確答案是「${q.options[correctIndex]}」。`;
  }

  document.getElementById("explanation").textContent = explanationText;
  document.getElementById("next-btn").style.display = "inline-block";
}

document.getElementById("start-btn").onclick = startQuiz;

document.getElementById("next-btn").onclick = () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    document.getElementById("question").textContent = "🎉 測驗結束！你已完成所有題目。";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("explanation").textContent = "";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "inline-block";
  }
};

document.getElementById("restart-btn").onclick = () => {
  document.getElementById("quiz-settings").style.display = "block";
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("restart-btn").style.display = "none";
};

// 初始化，隱藏測驗區塊
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("start-btn").disabled = true;
    document.getElementById("quiz-box").style.display = "none";
});