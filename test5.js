var typed = new Typed(".typing-text", {
  strings: [
        '<span class="dark-purple">NFL attendance</span>', 
        '<span class="orange">NBA draft</span>', 
        '<span class="blue">AI chip prices</span>',
        '<span class="red">TV show metrics</span>',
        '<span class="green">Weather patterns</span>',
        '<span class="black">What you know</span>'
    ],
    typeSpeed: 50,// typing speed
    backSpeed: 50, // erasing speed
    loop: false, // start back after ending typing
    showCursor: true,
      cursorChar: '|',

});

const xanoApiBaseUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:AdRE1MAv';
  const card = document.getElementById("card-form");
  const questionElement = document.querySelector('.question');
  const successMessageCardFlip = document.querySelector(".success-message-card-flip");
  const successMessageCard = document.querySelector(".success-card-content");
  const percentageResult = document.querySelector('.percentage-result');
  const successResult = document.querySelector('.success-result');

function incrementVote(questionId, voteType) {
    // Get the current vote counts
    fetch(`${xanoApiBaseUrl}/question/${questionId}`)
      .then(response => response.json())
      .then(questionData => {
        // Increment the appropriate counter based on the voteType
        const updatedQuestionData = {
          ...questionData,
          [voteType]: questionData[voteType] + 1
        };
  
        // Send the updated vote count back to the server
        fetch(`${xanoApiBaseUrl}/question/${questionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // Add any other headers like authorization if needed
          },
          body: JSON.stringify(updatedQuestionData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          // After updating, re-fetch and refresh the UI with the new data
                //getQuestionsAndDisplayPercentages();
           successMessageCardFlip.style.display = "block"; // Unhide the card
        })
        .catch(error => console.error('Error updating vote:', error));
      })
      .catch(error => console.error('Error fetching current vote count:', error));
  }

  function getQuestionsAndDisplayPercentages() {
    fetch(`${xanoApiBaseUrl}/question`)
      .then(response => response.json())
      .then(questions => {
        if (questions.length === 0) {
          throw new Error('No questions available');
        }
        // Select a random question
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        displayQuestion(randomQuestion);
      })
      .catch(error => console.error('Error:', error));
  }
  
function displayQuestion(question) {
  // Set the question text and calculate the yes percentage
  questionElement.textContent = question.question;
  const totalVotes = question.yes_votes + question.no_votes;
  const successResultText = question.result;
  const yesPercentage = totalVotes > 0 ? (question.yes_votes / totalVotes) * 100 : 0;
  percentageResult.textContent = `${yesPercentage.toFixed(1)}%`;
    successResult.textContent = successResultText;
  // Select the buttons
  const yesButton = document.querySelector('#button-yes-commercial');
  const noButton = document.querySelector('#button-no-commercial');
  
  // Remove any existing event listeners (if applicable) and add new ones
  yesButton.onclick = () => yesVoteHandler(question);
  noButton.onclick = () => noVoteHandler(question);
}
