
var game = {
	questions:[],
	questionIndex:0,
	correctAnswers:0,
	incorectAnswers:0,

	remainingQuestionTime:0,
	remainingQuestionTimeCountdownEnabled:false,

	remainingAnswerStatusTime:0,
	answer:{},
	
	start:function(gameQuestions){
		this.questions = gameQuestions;
		this.startQuiz();
		
	},
	startQuiz:function(gameQuestions){
		this.questionIndex = 0;
		this.remainingQuestionTime = 30;
		this.remainingAnswerStatusTime = 3;
		this.remainingQuestionTimeCountdownEnabled = true;
		this.timer = setInterval(function() {
			game.onTick();
		}, 1000)
		this.render();
	},
	stop:function() {
		clearInterval(this.timer)
	},
	nextQuestion:function() {
		this.questionIndex++;
		this.remainingQuestionTimeCountdownEnabled = true;
		this.remainingQuestionTime = 30;
		this.remainingAnswerStatusTime = 3;
		this.answer = {};
		if(this.questionIndex >= this.questions.length) {
			this.stop();
		}
		this.render();
	},

	onTick:function() {//once game started this method is called every 1 sec by timer
		
		if(this.remainingQuestionTimeCountdownEnabled) {
			if(this.remainingQuestionTime > 0) {
				this.remainingQuestionTime--;
				//render current question
				game.render();
			} else {
				this.remainingQuestionTimeCountdownEnabled = false;
				//select with non existing position (which is wrong answer)
				game.selectAnswer(-1);
			}
		} else { //count from 3 to 0 sec // show answer status for 3 sec
			if(this.remainingAnswerStatusTime > 0) {
				this.remainingAnswerStatusTime--;
			} else {
				this.nextQuestion();
			}
		}

	},


	renderQuestion:function() {
		this.renderremainingQuestionTime();
		var stage = $('#stage');
		var questionElement = $('<h2>');
		questionElement.html(this.questions[this.questionIndex].text);
		stage.append(questionElement);
		var list = $('<ul>');
		for(var i=0;i<this.questions[this.questionIndex].answers.length;i++){
			
			var answer = this.questions[this.questionIndex].answers[i];
			var item = $('<li>');
			item.html(answer.text);
			item.addClass("option");
			item.attr("data-index", i);
			list.append(item);	
		
			item.click(function() {
				var clickedElement = $(this);
				var selectedIndex = clickedElement.attr("data-index"); 
				game.selectAnswer(selectedIndex);
			});

		}
		stage.append(list);
	},

	renderremainingQuestionTime:function() {
		var stage = $('#stage');
		var remainingTimeElement = $('<div>');
		remainingTimeElement.html("Time Remaining: " + this.remainingQuestionTime + " Seconds");
		stage.append(remainingTimeElement);
	
	},

	renderAnswer:function() {
		var stage = $('#stage');
		stage.empty();
		this.renderremainingQuestionTime();
		var status = $('<h2>');
		status.html(this.answer.status);
		stage.append(status);
		if(this.answer.correct != "") {
			var correctAnswerElement = $('<div>');
			correctAnswerElement.html(this.answer.correct);
			stage.append(correctAnswerElement);
		}
		var movie = $('<video>');
		movie.attr('type', 'video/mp4')
		movie.attr('src', this.answer.videoUrl);
		movie.attr('autoplay', true);
		stage.append(movie);
	},

	renderSumary:function() {
		var stage = $('#stage');
		stage.empty();
		var correctElement = $('<div>');
		correctElement.html('Correct answers: ' + this.correctAnswers);
		stage.append(correctElement);

		var incorrectElement = $('<div>');
		incorrectElement.html('Incorrect answers: ' + this.incorectAnswers);
		stage.append(incorrectElement);


		var startOverButton = $('<button>');
		startOverButton.text('Start Over');
		startOverButton.addClass('large-button');
		startOverButton.click(function() {
			game.startQuiz();
		});
		stage.append(startOverButton);
	},

	render:function(){
		var stage = $('#stage');
		stage.empty();
		var hasMoreQuestions = this.questionIndex < this.questions.length
		if(hasMoreQuestions) {
			this.renderQuestion();
		} else {
			this.renderSumary();
			//add button start over
		}
	},
	getCorrectAnswer:function() {
		for(var i = 0; i< this.questions[this.questionIndex].answers.length;i++) {
			if(this.questions[this.questionIndex].answers[i].valid) {
				return this.questions[this.questionIndex].answers[i]
			}
		}
	},
	

	

	selectAnswer:function(answerIndex){
		var answer = this.questions[this.questionIndex].answers[answerIndex];
		var correctAnswer = this.getCorrectAnswer()
		if(answer && answer.valid) {
			this.answer.status = 'Correct!';
			this.correctAnswers++;
		} else {
			this.incorectAnswers++;
			if(this.remainingQuestionTime > 0) {
				this.answer.status = 'Nope!';
			} else {
				this.answer.status = 'Time out!';
			}
			this.answer.correct = 'The correct answer was:' + correctAnswer.text;			
		}
		this.answer.videoUrl = 	correctAnswer.videoUrl;
		this.remainingQuestionTimeCountdownEnabled = false;
		this.renderAnswer();
	

		//set timeser 3 sec
		
		//wait for next question of start over option x sec.
		
		 

	}

}


var questions = [
	{
		text:"What was the first full length CGI movie?",
		answers:[
			{text:"A Bug's Life",valid:false},
			{text:"Monsters Inc",valid:false},
			{text:"Toy Story",valid:true, videoUrl:'https://media0.giphy.com/media/3o7abpf0Zo3unxLl84/200.mp4'},
			{text:"The Lion King",valid:false},
		]
	},
	{

		text:"Which of these is NOT a name of one of the Spice Girls?",
		answers:[
			{text:"Sporty Spice",valid:false},
			{text:"Fred Spice",valid:true,videoUrl:'http://media0.giphy.com/media/lgwMQ5ELztonC/200.mp4'},
			{text:"Scary Spice ",valid:false},
			{text:"Posh Spice",valid:false},
		]
	},
    {
		text:"Which NBA team won the most titles in the 90s?",
		answers:[
			{text:"New York Knickes",valid:false},
			{text:"Portland Traiblazers",valid:false},
			{text:"Log Angeles Lakers",valid:false},
			{text:"Chicago Bulls",valid:true,videoUrl:'http://media0.giphy.com/media/l0IyeX9RueLhBjuOk/200.mp4'},
		]
	},
	{
		text:"Which group released the hit song. 'Smells Like Teen Spirit' ?",
		answers:[
			{text:"Nirvana", valid:true,videoUrl:'https://media3.giphy.com/media/6drDpi4a74mvm/200.mp4'},
			{text:"Backstreet Boys", valid:false},
			{text:"The Offspring", valid:false},
			{text:"No Boubt", valid:false},
		]
	}
];

$(document).ready(function() {

	$('#startButton').click(function() {
			game.start(questions);
	});


})

