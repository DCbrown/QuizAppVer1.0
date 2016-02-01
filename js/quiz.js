(function(){

	var app = angular.module('vgQuiz',[]);
	
	app.controller('QuizController', ['$scope','$http','$sce',function($scope,$http,$sce){
		
		//Declaring variables
		$scope.Math = window.Math;
		$scope.score = 0;
		$scope.activeQuestion = -1;
		$scope.activeQuestionAnswered = 0;		
		$scope.percentage = 0;
		
		//Retrieve list of options, questions and answers from JSON Data
		$http.get('quiz_data.json').then(function(quizData){
			$scope.myQuestions = quizData.data;
			$scope.totalQuestions = $scope.myQuestions.length;
		});
		
		// check the answer that user clicks to see if it's correct or incorrect
		$scope.selectAnswer = function(qIndex,aIndex){
			
			var questionState = $scope.myQuestions[qIndex].questionState;

			if(questionState != 'answered'){	
				$scope.myQuestions[qIndex].selectedAnswer = aIndex;
				var correctAnswer = $scope.myQuestions[qIndex].correct;
		
				$scope.myQuestions[qIndex].correctAnswer = correctAnswer;
				
				if( aIndex === correctAnswer ){
					$scope.myQuestions[qIndex].correctness = 'correct';
					$scope.score += 1;
				}else{
					$scope.myQuestions[qIndex].correctness = 'incorrect';
				}
				
				$scope.myQuestions[qIndex].questionState = 'answered';		
		
			}
			//calculate the percentage of the test score			
			$scope.percentage = Math.floor(($scope.score / $scope.totalQuestions)*100);
			
		}
		//Keep track of the progress bar when selecting an incorrect answer	
		$scope.isSelected = function(qIndex,aIndex){
			return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
		}
		/* Keep track of the progress bar when selecting an correct answer and 
		adds check mark from the CSS class */
		$scope.isCorrect = function(qIndex,aIndex){
			return $scope.myQuestions[qIndex].correctAnswer === aIndex;
		}
		//Contiune to the next question after selecting an answer
		$scope.selectContinue = function(){
			return  $scope.activeQuestion += 1;
		}
		//Email and twitter share links by percentages 
		$scope.createShareLinks = function(percentage){
			
			var url = 'http://bit.ly/1nXasIP';

			var emailLink = '<a class="btn email" href="mailto:?subject=Try to beat my quiz score!&amp;body=I scored a '+percentage+'% on this quiz about Classic Video Games. Try to beat my score at '+url+'">Email a friend</a>';

			var twitterLink = '<a target="blank" class="btn twitter" href="http://twitter.com/share?text=I scored a '+percentage+'%25 on this quiz about Classic Video Games. Try to beat my score at&amp;hashtags=VideoGameQuiz&amp;url='+url+'">Tweet your score</a>';
			
			var newMarkup = emailLink + twitterLink;

			return $sce.trustAsHtml(newMarkup);			

		}
		
	}]);

})();