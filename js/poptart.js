// What Flavor Poptart Are You? -- a decision tree quiz.
//
// The quiz is a tree of questions. Every answer points to the next question
// (by its id) or to a flavor result (by its flavor key). Every path from the
// start to a flavor is 5 or 6 questions long.
//
// Rough shape:
//   start: puddle -> fruity side (strawberry / blueberry / cherry)
//          leaves -> cozy side   (s'mores / brown sugar cinnamon / chocolate)
//   Each side leans toward a flavor, asks a couple of "are you sure?"
//   questions, and goes to a tie-breaker if the answers disagree.

var flavors = {
  strawberry: {
    name: 'Strawberry',
    image: 'images/strawberry.jpg',
    description: 'You are sweet, sunny, and you give the BEST hugs. Everybody wants to sit next to you at the picnic!'
  },
  blueberry: {
    name: 'Blueberry',
    image: 'images/blueberry.jpg',
    description: 'You are calm and cool like the ocean. You notice things nobody else notices, like snails and cloud shapes.'
  },
  cherry: {
    name: 'Cherry',
    image: 'images/cherry.jpg',
    description: 'You are FAST and LOUD and full of zoom! When you walk into a room, everybody knows it.'
  },
  smores: {
    name: "S'mores",
    image: 'images/smores.jpg',
    description: 'You are an adventurer! You love campfires, being outside, and getting a little bit sticky.'
  },
  chocolate: {
    name: 'Chocolate Fudge',
    image: 'images/chocolate.jpg',
    description: 'You are a little bit sneaky and a LOT of fun. You would eat dessert first every single day if they let you!'
  },
  brownSugar: {
    name: 'Brown Sugar Cinnamon',
    image: 'images/brownsugar.jpg',
    description: 'You are cozy like a warm blanket. You love fuzzy socks, cookies in the oven, and crunchy leaves.'
  }
};

var questions = {
  // ---- the first question picks a side ----
  start: {
    text: 'Would you rather jump in a big puddle or a big pile of leaves?',
    answers: [
      { text: 'Puddle!', emoji: '💦', next: 'fruitColor' },
      { text: 'Leaves!', emoji: '🍂', next: 'cozyAnimal' }
    ]
  },

  // ---- fruity side: strawberry, blueberry, cherry ----
  fruitColor: {
    text: 'What is the best color in the whole world?',
    answers: [
      { text: 'Pink', emoji: '🩷', next: 'strawberry1' },
      { text: 'Blue', emoji: '💙', next: 'blueberry1' },
      { text: 'Red', emoji: '❤️', next: 'cherry1' }
    ]
  },
  strawberry1: {
    text: 'Would you rather have a picnic or go swimming?',
    answers: [
      { text: 'Picnic', emoji: '🧺', next: 'strawberry2' },
      { text: 'Swimming', emoji: '🏊', next: 'blueberry2' }
    ]
  },
  blueberry1: {
    text: 'Would you rather live under the ocean or in a flower garden?',
    answers: [
      { text: 'Under the ocean', emoji: '🌊', next: 'blueberry2' },
      { text: 'Flower garden', emoji: '🌷', next: 'strawberry2' }
    ]
  },
  cherry1: {
    text: 'Would you rather ride a roller coaster or a merry-go-round?',
    answers: [
      { text: 'Roller coaster', emoji: '🎢', next: 'cherry2' },
      { text: 'Merry-go-round', emoji: '🎠', next: 'strawberry2' }
    ]
  },
  strawberry2: {
    text: 'How many hugs do you give in one day?',
    answers: [
      { text: 'A MILLION', emoji: '🤗', next: 'strawberry3' },
      { text: 'Like, two', emoji: '✌️', next: 'cherry2' }
    ]
  },
  blueberry2: {
    text: 'Are rainy days good or bad?',
    answers: [
      { text: 'Good! Puddles!', emoji: '🌧️', next: 'blueberry3' },
      { text: 'Bad. I want sunshine', emoji: '☀️', next: 'strawberry3' }
    ]
  },
  cherry2: {
    text: 'Can you run faster than a cheetah?',
    answers: [
      { text: 'Obviously', emoji: '🐆', next: 'cherry3' },
      { text: 'No, I like to walk', emoji: '🚶', next: 'blueberry3' }
    ]
  },
  strawberry3: {
    text: 'Would you rather wear a tutu or a superhero cape?',
    answers: [
      { text: 'Tutu', emoji: '🩰', next: 'strawberry' },
      { text: 'Cape', emoji: '🦸', next: 'fruitTieBreaker' }
    ]
  },
  blueberry3: {
    text: 'At bedtime are you sleepy or WIDE awake?',
    answers: [
      { text: 'Sleepy', emoji: '😴', next: 'blueberry' },
      { text: 'WIDE awake', emoji: '👀', next: 'fruitTieBreaker' }
    ]
  },
  cherry3: {
    text: 'How loud can you yell?',
    answers: [
      { text: 'SUPER LOUD', emoji: '📣', next: 'cherry' },
      { text: 'Shhh, I whisper', emoji: '🤫', next: 'fruitTieBreaker' }
    ]
  },
  fruitTieBreaker: {
    text: 'Okay, last one. If you were a berry, which berry would you be?',
    answers: [
      { text: 'Strawberry', emoji: '🍓', next: 'strawberry' },
      { text: 'Blueberry', emoji: '🫐', next: 'blueberry' },
      { text: 'Cherry', emoji: '🍒', next: 'cherry' }
    ]
  },

  // ---- cozy side: s'mores, brown sugar cinnamon, chocolate ----
  cozyAnimal: {
    text: 'Pick a forest friend!',
    answers: [
      { text: 'Bear', emoji: '🐻', next: 'smores1' },
      { text: 'Squirrel', emoji: '🐿️', next: 'brownSugar1' },
      { text: 'Raccoon', emoji: '🦝', next: 'chocolate1' }
    ]
  },
  chocolate1: {
    text: 'Should you eat dessert first or dinner first?',
    answers: [
      { text: 'Dessert first!', emoji: '🍰', next: 'chocolate2' },
      { text: 'Dinner first', emoji: '🥦', next: 'cozyMiddle' }
    ]
  },
  chocolate2: {
    text: 'You found a treasure chest! What is inside?',
    answers: [
      { text: 'Candy', emoji: '🍬', next: 'chocolate3' },
      { text: 'Gold coins', emoji: '🪙', next: 'smores2' }
    ]
  },
  chocolate3: {
    text: 'Would you rather swim in a pool of chocolate pudding or a pool of jello?',
    answers: [
      { text: 'Chocolate pudding', emoji: '🍫', next: 'chocolate' },
      { text: 'Jello', emoji: '🟩', next: 'cozyTieBreaker' }
    ]
  },
  smores1: {
    text: 'Do you love campfires?',
    answers: [
      { text: 'Yes!', emoji: '🔥', next: 'smores2' },
      { text: 'No, too smoky', emoji: '😷', next: 'cozyMiddle' }
    ]
  },
  brownSugar1: {
    text: 'Do you like it when the house smells like cookies?',
    answers: [
      { text: 'YES', emoji: '🍪', next: 'brownSugar2' },
      { text: 'Meh', emoji: '🤷', next: 'cozyMiddle' }
    ]
  },
  cozyMiddle: {
    text: 'Is it better to be sticky or crunchy?',
    answers: [
      { text: 'Sticky', emoji: '🍯', next: 'smores2' },
      { text: 'Crunchy', emoji: '🥨', next: 'brownSugar2' }
    ]
  },
  smores2: {
    text: 'Would you rather sleep in a tent or in a blanket fort?',
    answers: [
      { text: 'Tent', emoji: '🏕️', next: 'smores3' },
      { text: 'Blanket fort', emoji: '🛋️', next: 'cozyTieBreaker' }
    ]
  },
  brownSugar2: {
    text: 'Fuzzy socks or bare feet?',
    answers: [
      { text: 'Fuzzy socks', emoji: '🧦', next: 'brownSugar3' },
      { text: 'Bare feet', emoji: '🦶', next: 'cozyTieBreaker' }
    ]
  },
  smores3: {
    text: 'Would you eat a marshmallow as big as your head?',
    answers: [
      { text: 'YES PLEASE', emoji: '🤤', next: 'smores' },
      { text: 'That is too big', emoji: '😳', next: 'cozyTieBreaker' }
    ]
  },
  brownSugar3: {
    text: 'Should a dinosaur wear a scarf when it is cold outside?',
    answers: [
      { text: 'Of course!', emoji: '🦕', next: 'brownSugar' },
      { text: 'Dinosaurs do not get cold', emoji: '🙄', next: 'cozyTieBreaker' }
    ]
  },
  cozyTieBreaker: {
    text: 'Okay, last one. Chocolate, marshmallows, or cinnamon?',
    answers: [
      { text: 'Chocolate', emoji: '🍫', next: 'chocolate' },
      { text: 'Marshmallows', emoji: '☁️', next: 'smores' },
      { text: 'Cinnamon', emoji: '🌀', next: 'brownSugar' }
    ]
  }
};

var popTartQuiz = {
  // logic related to the quiz itself
  quizStarted: false,
  currentQuestionId: null,
  questionNumber: 0,

  start: function() {
    popTartQuiz.quizStarted = true;
    popTartQuiz.questionNumber = 0;
    popTartQuiz.goTo('start');
  },

  // move to a question id or a flavor key
  goTo: function(id) {
    if (flavors[id]) {
      popTartQuiz.quizStarted = false;
      view.renderResult(flavors[id]);
      return;
    }
    popTartQuiz.currentQuestionId = id;
    popTartQuiz.questionNumber++;
    view.renderQuestion(questions[id], popTartQuiz.questionNumber);
  },

  answer: function(answerIndex) {
    var question = questions[popTartQuiz.currentQuestionId];
    popTartQuiz.goTo(question.answers[answerIndex].next);
  }
};

var handlers = {
  // the connection between stuff happening on the page and the logic and view
  startQuiz: function() {
    view.hideWelcome();
    popTartQuiz.start();
  },
  chooseAnswer: function(answerIndex) {
    popTartQuiz.answer(answerIndex);
  },
  restartQuiz: function() {
    popTartQuiz.start();
  }
};

var view = {
  // adding and removing elements on the page
  container: function() {
    return document.querySelector('.quizContainer');
  },

  hideWelcome: function() {
    document.querySelector('.welcome').hidden = true;
  },

  renderQuestion: function(question, number) {
    var container = view.container();
    container.innerHTML = '';

    var counter = document.createElement('p');
    counter.className = 'questionNumber';
    counter.textContent = 'Question ' + number;
    container.appendChild(counter);

    var heading = document.createElement('h2');
    heading.textContent = question.text;
    container.appendChild(heading);

    var answerList = document.createElement('div');
    answerList.className = 'answers';
    question.answers.forEach(function(answer, index) {
      var button = document.createElement('button');
      button.className = 'answer';
      button.onclick = function() { handlers.chooseAnswer(index); };

      var emoji = document.createElement('span');
      emoji.className = 'emoji';
      emoji.textContent = answer.emoji;
      button.appendChild(emoji);
      button.appendChild(document.createTextNode(answer.text));

      answerList.appendChild(button);
    });
    container.appendChild(answerList);
  },

  renderResult: function(flavor) {
    var container = view.container();
    container.innerHTML = '';

    var intro = document.createElement('p');
    intro.className = 'questionNumber';
    intro.textContent = 'You are a...';
    container.appendChild(intro);

    var heading = document.createElement('h2');
    heading.className = 'resultName';
    heading.textContent = flavor.name + ' Poptart!';
    container.appendChild(heading);

    var image = document.createElement('img');
    image.className = 'resultImage';
    image.src = flavor.image;
    image.alt = flavor.name + ' Poptart';
    container.appendChild(image);

    var description = document.createElement('p');
    description.className = 'resultDescription';
    description.textContent = flavor.description;
    container.appendChild(description);

    var again = document.createElement('button');
    again.className = 'start';
    again.textContent = 'Play Again';
    again.onclick = handlers.restartQuiz;
    container.appendChild(again);
  }
};
