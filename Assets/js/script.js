// element variables
const rootEl = $('#root');
const conEl= $('.container');
const timerEl = $('#timer');
const answersEl = $('.answer');
const startEl = $('#startQuiz');
const quizMainEl = $('#quizMain');
const introEl = $('#intro');
const scoreEl = $('#score');
const submitEl = $('#submit');
const inputEl = $('#input');
const scoreboardEl = $('#scoreboard');
const hiHoldEl = $('#hiHolder');
const resetEl = $('#reset'); 
const clearEl = $('#clear');

// questions as an array of objects
const questions =[
    {
        text: 'Commonly used data types DO NOT include:',
        number:1,
        Answers: [
            'booleans',
            'alerts',
            'strings',
            'numbers',
        ],
    },
    {
        text: 'The condition in an if / else statement is enclosed within _____.',
        number:2,
        Answers: 
        [
            "parentheses",
            "brackets",
            "asterisks",
            "backslashes",
        ]
    },
    {
        text: 'Arrays in JavaScript can be used to store:',
        number:3,
        Answers: 
        [
            "numbers",
            "objects" ,
            "other arrays" ,
            "All the above" ,
        ],
    },
    {
        text: 'String values must be enclosed within _____ when being assigned to variables.',
        number:4,
        Answers: 
        [
            "commas",
            "curly brackets",
            "quotes",
            "parenthesis" ,
        ],
    },
    {
        text: 'A very useful tool used during development and debugging for printing content to the debugger is:',
        number:5,
        Answers: 
        [
            "talking to a rubber duck", 
            "console.log", 
            "System.out.println",
            "smashing your keyboard" ,
        ],
    },
 ]

//other variables
let quesCount = 0;
let secondsLeft = 10;
let score = 0;
let solution = "21432";


function questionChange(){
    if(quesCount === questions.length) //if at the end of quiz, sets score, ends quiz,
        {
            score = secondsLeft;
            timerEl.hide(); // using jquery to hide various elements 
            quizFinish();
            console.log(score);
        }
    else
        {//otherwise, displays next question and its answers, iterate to next question
            quizMainEl.children("h3").text(`Question number ${questions[quesCount].number}`  );
            quizMainEl.children("h5").text(questions[quesCount].text);
            for (var i = 0; i < 4 ; i++){
                quizMainEl.children("div").children().eq(i).text(questions[quesCount].Answers[i]);
            }
            quesCount++;
        }
   
}

startEl.on('click', function(event) { //resets and starts the timer, hides the start button, shows the questions and changes the questions to the first question
    secondsLeft = 60;
    quesCount=0;
    startTimer();
    quizMainEl.show();
    introEl.hide();
    questionChange();
});

answersEl.on('click',  function(event) { //grabs the value of the clicked button and checks if it is the correct answer then changes the question
   
    let chosenAnswer = $(event.target).attr('data-answerOption');
    
    localStorage.setItem(`Answer ${quesCount}`, chosenAnswer);
    if (solution.charAt(quesCount-1) !== chosenAnswer ){
        secondsLeft -= 10;
    }
    questionChange();
    
});

function  startTimer() { //timer function
    timerEl.text("");
    timerEl.show();
    
    var timerInterval = setInterval(function() {
      
      secondsLeft--;
      timerEl.text(secondsLeft);
  
      if(secondsLeft === 0 || secondsLeft < 0)  { // added negative check to incase the timer is low and the answer is wrong
        // Stops execution of action at set interval
        clearInterval(timerInterval);
        quizFinish()
      }
      if (quesCount > questions.length ){ //ends time if all questions are answered
        clearInterval(timerInterval); 
      }
    
    }, 1000);
  }

  function quizFinish() {//show the quiz finish screen and hides the questions
    console.log(scoreEl.children('form').children().eq(1));
        scoreEl.children().children('form').children().eq(1).text(`Your final score is ${score}`);
        scoreEl.show();
		quizMainEl.hide();
		secondsLeft = 1;
    
	}


function handleSubmit(event) {//handle submit and save score to local storage with user initials
    event.preventDefault();
    addUserHigh();
    inputEl.val("");
    scoreEl.hide();
    scoreboardEl.show();
};

function addUserHigh() {//base code from stackoverflow
        // Parse any JSON previously stored in allEntries
        var existingScores = JSON.parse(localStorage.getItem("allScores"));
        if(existingScores == null) {
            existingScores = []
        };

        if(inputEl.val()!=="")
        {
            var newScore = 
            {
            "name": inputEl.val(),
            "score": score
            };
            if(newScore.name !== "")
            {
                existingScores.push(newScore);
            }
        }

        localStorage.setItem("newScore", JSON.stringify(newScore)); // save newest score to local storage
        
        // Save back to local storage

        

        hiHoldEl.empty(); //clears the high score before remaking the list, messy but works
        
        for (var i = 0; i < existingScores.length; i++) { 
            // for each score in the array makes a p tag and sets the text to the name and score of the current element then appends to highscore list
            var pEl = $('<p>');
            pEl.text(`${existingScores[i].name}: ${existingScores[i].score}`);
            hiHoldEl.append(pEl);
           
        }
        localStorage.setItem("allScores", JSON.stringify(existingScores)); //resave high scores to local storage
    };

    rootEl.children().children().children().eq(0).on('click', function(){ //scoreboard shower in header
        addUserHigh();
        quesCount = questions.length + 1; // ends timer when high score is clicked while the quiz is running
        timerEl.hide();
        scoreboardEl.show();
        quizMainEl.hide();
        scoreEl.hide();
        startEl.hide();
        introEl.hide();
        
    });

    resetEl.on('click', function(){ //resets the quiz
        introEl.show();
        scoreboardEl.hide();
        startEl.show();
    });

    clearEl.on('click', function(){ // clears local storage and the highscore list
        hiHoldEl.empty();
        localStorage.removeItem("allScores");
        addUserHigh();
    });

    submitEl.on("click", handleSubmit);
  