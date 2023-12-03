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
  const yesButton = card.querySelector('.button-yes');
  const noButton = card.querySelector('.button-no');
  
  // Remove any existing event listeners (if applicable) and add new ones
  yesButton.onclick = () => yesVoteHandler(question);
  noButton.onclick = () => noVoteHandler(question);
}

function yesVoteHandler(question) {
  console.log('Yes button clicked');
  incrementVote(question.id, 'yes_votes');
 // showSuccessCard();
}

function noVoteHandler(question) {
  console.log('No button clicked');
  incrementVote(question.id, 'no_votes');
      //showSuccessCard();
}

function fetchQuestionsAndDisplay(category, displayFunction, apiUrl) {
    fetch(`${xanoApiBaseUrl}/${apiUrl}`)
      .then(response => response.json())
      .then(questions => {
        if (questions.length === 0) {
          throw new Error(`No questions available for ${category}`);
        }
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        displayFunction(randomQuestion);
      })
      .catch(error => console.error(`Error fetching ${category} questions:`, error));
  }

 function displayQuestionVote(question, questionSelector, buttonYesSelector, buttonNoSelector, incrementVoteFunction) {
    const currentQuestion = document.querySelector(questionSelector);
    currentQuestion.textContent = question.question;
  
    const yesButton = document.querySelector(buttonYesSelector);
    const noButton = document.querySelector(buttonNoSelector);
  
    yesButton.onclick = () => incrementVoteFunction(question.id, 'yes_votes');
    noButton.onclick = () => incrementVoteFunction(question.id, 'no_votes');
  }

  function incrementVote(questionId, voteType, apiUrl, successCardSelector) {
    let successCard = document.querySelector(successCardSelector);
    fetch(`${xanoApiBaseUrl}/${apiUrl}/${questionId}`)
      .then(response => response.json())
      .then(questionData => {
        const updatedQuestionData = { ...questionData, [voteType]: questionData[voteType] + 1 };
  
        fetch(`${xanoApiBaseUrl}/${apiUrl}/${questionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedQuestionData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => successCard.style.display = "block")
        .catch(error => console.error('Error updating vote:', error));
      })
      .catch(error => console.error('Error fetching current vote count:', error));
  }

function fetchRandomQuestionAndDisplay(category) {
    fetch(`${xanoApiBaseUrl}/${category}`)
      .then(response => response.json())
      .then(data => {
        const randomQuestion = data[Math.floor(Math.random() * data.length)];
        displayQuestionWithOptions(randomQuestion, category);
      })
      .catch(error => console.error(`Error fetching questions for ${category}:`, error));
}

function displayQuestionWithOptions(questionData, category) {
    const titleElement = document.querySelector(`#${category}-question`);
    titleElement.textContent = questionData.question; 
    
    const optionsContainer = document.querySelector(`.form_left-checkbox-${category}`);
    optionsContainer.innerHTML = '';
  
    const successMessage = document.querySelector('.success-message-grid');
    successMessage.innerHTML = '';

    let totalVotes = 0;
    let optionsCount = 0;
    while (questionData[`option_${optionsCount + 1}`] !== null && questionData[`option_${optionsCount + 1}`] !== undefined) {
        totalVotes += questionData[`option_${optionsCount + 1}_votes`] || 0;
        optionsCount++;
    }

    for (let i = 1; i <= optionsCount; i++) {
        const optionKey = `option_${i}`;
        const optionText = questionData[optionKey];
        if (optionText === null || optionText === undefined) {
            continue;
        }
        
        const optionVotes = questionData[`option_${i}_votes`] || 0;
        const percentage = totalVotes > 0 ? (optionVotes / totalVotes * 100).toFixed(1) : "0.00";
        
        console.log(`${optionText} - ${percentage}%`);
        const percentageLabel = document.createElement('div');
        percentageLabel.className = 'percentage-label';
        percentageLabel.textContent = `${percentage}%`;

        const itemName = document.createElement('div');
        itemName.className = `${category}-name`;
        itemName.textContent = optionText;

        const itemContainer = document.createElement('div');
        itemContainer.appendChild(itemName);
        itemContainer.appendChild(percentageLabel);

        successMessage.appendChild(itemContainer);

        const itemDiv = document.createElement('div');
        itemDiv.className = `${category}_answer`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'option';
        checkbox.className = `checkbox_button_${category}`;
        checkbox.value = `option_${i}`;
        checkbox.id = `option_${i}`;

        const label = document.createElement('label');
        label.htmlFor = `option_${i}`;
        label.className = `${category}-label`;
        label.textContent = optionText;

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(label);

        optionsContainer.appendChild(itemDiv);
    }

    const submitButton = document.getElementById(`${category}-submit`);
    submitButton.onclick = async function() {
        const selectedCheckboxes = document.querySelectorAll(`input[name="option"]:checked`);
        const selectedOptions = Array.from(selectedCheckboxes).map(cb => cb.value.split('_')[1]);
        if (selectedOptions.length === 0) {
          console.error('No options selected');
          return;
        }
        
        for (const optionNumber of selectedOptions) {
          await incrementOptionVote(questionData.id, optionNumber, category);
        }
    };
}

async function incrementOptionVote(questionId, optionNumber, category) {
  try {
    const response = await fetch(`${xanoApiBaseUrl}/${category}/${questionId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const questionData = await response.json();
    const voteType = `option_${optionNumber}_votes`;
    const updatedQuestionData = {
      ...questionData,
      [voteType]: (questionData[voteType] || 0) + 1
    };

    const updateResponse = await fetch(`${xanoApiBaseUrl}/${category}/${questionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedQuestionData)
    });

    if (!updateResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const updatedQuestion = await updateResponse.json();
    console.log('Vote updated', updatedQuestion);
  } catch (error) {
    console.error('Error updating vote:', error);
  }
}


function generateReferenceCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('wf-form-reference-code').addEventListener('submit', function(event) {
        event.preventDefault();

        var referenceCode = generateReferenceCode(Math.floor(Math.random() * (8 - 6 + 1) + 6));
        var email = document.getElementById('email-reference-code').value;
        var apiReferenceCode = `${xanoApiBaseUrl}/referencecode`;

        // Send the email and the generated reference code to Xano
        fetch(apiReferenceCode, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, code: referenceCode }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            document.getElementById('uk-reference').innerText = referenceCode;
            return response.json();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
});
document.addEventListener('DOMContentLoaded', (event) => {
  getQuestionsAndDisplayPercentages();
  chooseRandomFunction('sports');
  chooseRandomFunction('entertainment');
});

function chooseRandomFunction(category) {
  var randomNumber = Math.floor(Math.random() * 2);
  var categorySettings = getCategorySettings(category);

  if (randomNumber === 0) {
      fetchRandomQuestionAndDisplay(category);
      document.querySelector(categorySettings.formSelector).style.display = "none";
  } else {
      fetchQuestionsAndDisplay(
        category, 
        (question) => displayQuestionVote(
          question, 
          categorySettings.questionSelector, 
          categorySettings.yesButtonSelector, 
          categorySettings.noButtonSelector, 
          (id, voteType) => incrementVote(id, voteType, categorySettings.apiEndpoint, categorySettings.successCardSelector)
        ), 
        categorySettings.apiEndpoint
      );
      document.querySelector(categorySettings.widgetSelector).style.display = "none";
  }
}

function getCategorySettings(category) {
  const settings = {
    'sports': {
      formSelector: '.card-form-sports',
      questionSelector: '.question-sports',
      yesButtonSelector: '#button-yes-sports',
      noButtonSelector: '#button-no-sports',
      apiEndpoint: 'sports_q2',
      successCardSelector: '.success-message-card-flip_sports',
      widgetSelector: '#wf-form-sports-widget'
    },
    'entertainment': {
      formSelector: '.card-form-entertainment',
      questionSelector: '.question_entertainment',
      yesButtonSelector: '.button-yes_entertainment',
      noButtonSelector: '.button-no_entertainment',
      apiEndpoint: 'entertainment_q2',
      successCardSelector: '.success-message-card-flip_entertainment',
      widgetSelector: '#card-form-options'
    }
  };
  return settings[category];
}
