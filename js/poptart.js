var popTartQuiz = {
  // logic related to the quiz itself
  quizStarted: false,
  chocolatePoints: 0,
  cherryPoints: 0,
  strawberryPoints: 0,
  smoresPoints: 0,
  brownSugarCinnamonPoints: 0,
  blueBerryPoints: 0,
  popTartQuiz: function() {

  },

};

var handlers = {
  // the connection between stuff happening on the page and the logic and view
  toggleQuizStatus: function() {
    quizStarted = !quizStarted
  },
  startQuiz: function() {
    view.removeButton();
    view.firstQuestion();
    popTartQuiz.runQuiz();
  }
};

var view = {
  // adding and removing elements on the page
  removeButton: function() {
    // remove the button that says start quiz
  },
  firstQuestion: function() {
    // show first question

  },

};
