let app = 
{
    //**ATTRIBUTS**/
    //ciblage de la balise ayant la classe spécifique: <div id="game_container" class=""></div>
    gameContainer : document.querySelector("#game_container"),
    arrayResultTrue : [],
    arrayResultFalse : [],
    buttonPlay : document.querySelector('#button_play'),
    eventPlay : document.querySelector('#event_play'),
    nextBtn : document.querySelector('#next_btn'),
    resultBtn : document.querySelector('#result_btn'),
    buttonRetry : document.querySelector('#button_retry'),
    
    //**INTITIALISATION**/
    
    init : function () {
        console.log('BIENVENUE!');
        app.buttonPlay.addEventListener('click', app.play);
        //event + appel d'une nouvelle question
        app.nextBtn.addEventListener('click', function(){app.nextQuestion()});
        //event + appel du résultat
        app.resultBtn.addEventListener('click', function(){app.getResult()});
        //app.buttonRetry.addEventListener('click', app.retry);
    },

    //**METHODES**/
    
    shuffle : function (array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        //Tableau non vide
        while (0 !== currentIndex) {
            //Récup un élément
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            //Mélange
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    play : function() {
        app.buttonPlay.classList.add('display_none');
        app.eventPlay.classList.remove('display_none');
        app.buttonRetry.classList.remove('display_none');
        app.createGame(0);
    },
    
    createGame : function (i) {
        // i = randomQuestionId
        let question = copyQuizz[i].question;
        app.createGameTemplate(question, i);
        
        let answersLength = copyQuizz[i].answers.length;
        for(let answerNumber = 0; answerNumber < answersLength; answerNumber++) {
            //answer = element[i].answers[index].value
            app.createAnswerTemplate(copyQuizz[i].answers[answerNumber].value, answerNumber);
        }
    },

    createGameTemplate : function (question, i) {
        //récupération du template pour la div
        let gameTemplate = document.querySelector("#game_template");
        //ajout via clonage du contenu du template
        let cloneTemplateGame = document.importNode(gameTemplate.content, true);
        //insertion dans <div id="game_container" class=""></div>
        app.gameContainer.appendChild(cloneTemplateGame);
        //ciblage de la nouvelle balise ayant pour classe: game_question
        let gameQuestion = document.querySelector('#game_question');
        //ajout de la question (innerHTML fonctionne aussi)
        gameQuestion.innerText = question;
        //numéro de clé
        gameQuestion.value = i;
    },

    //answer = réponse
    //numberOption = numéro de l'option pour avoir une class unique
    createAnswerTemplate : function (answer, answerNumber) {
        //<div id="answer_container"></div>
        let answerContainer = document.querySelector('#answer_container');
        //récupération du template pour les réponses
        let answerTemplate = document.querySelector("#answer_template");
        //ajout via clonage du contenu du template
        let cloneTemplateAnswer = document.importNode(answerTemplate.content, true);
        //insertion dans <div id="answer_container"></div>
        answerContainer.appendChild(cloneTemplateAnswer);
        //ciblage de la nouvelle balise: <div class="answer_item"></div>
        let answerItem = document.querySelector('.answer_item');
        //ajout de la réponse suivi d'un numéro unique
        answerItem.classList.add('answer_item_'+ answerNumber);
        //retrait de l'ancienne classe afin de ne pas la cibler à nouveau dans la prochaine boucle
        answerItem.classList.remove('answer_item');
        //ciblage de la nouvelle classe toujours dans la même div
        let answerItemValue = document.querySelector('.answer_item_'+ answerNumber);
        //ajout de la réponse (innerHTML fonctionne aussi)
        answerItemValue.innerText = answer;
        //ajout d'un numéro unique ayant pour valeur l'id de la réponse
        answerItemValue.value = answerNumber;
        //ajout d'un event sur chaque réponse
        answerItemValue.addEventListener('click', app.checkAnswer);
    },

    checkAnswer : function (event) {
        //réponse transmises
        let answerId = event.target.value;
        let gameQuestion = document.querySelector('#game_question');
        //comparaison de la réponse transmises (valeur en chiffre) à la clé du tableau puis "correct"
        if (copyQuizz[gameQuestion.value].answers[answerId].correct) {
            app.arrayResultTrue.push('1');
            event.target.classList.add('border_true');
            event.target.classList.remove('border_init');
            //effacer tous les event quand résultat est correct
            app.removeAllAnswersListeners();
            //effacer la question du tableau
            app.removeQuestion(gameQuestion.value);
            if(copyQuizz.length !== 0) {
                //affichage du boutton "suivant"
                app.nextBtn.classList.remove('display_none');
            } else {
                //affichage du boutton "resultats"
                app.resultBtn.classList.remove('display_none');
            }
        } else {
            app.arrayResultFalse.push('1');
            event.target.classList.add('border_false');
            event.target.classList.remove('border_init');
            event.target.removeEventListener('click', app.checkAnswer);
        }
    },

    removeAllAnswersListeners : function () {
        let listAnswerSelector = document.querySelectorAll('.event_remove');
        listAnswerSelector.forEach(element => 
            element.removeEventListener('click', app.checkAnswer)
        );
    },

    removeQuestion : function (randomQuestionId) {
        copyQuizz.splice(randomQuestionId, 1);
    },

    nextQuestion : function () {
        app.nextBtn.classList.add('display_none');
        app.gameContainer.innerText = ""
        app.createGame(0);
    },

    createResultTemplate : function () {
        let resultTemplate = document.querySelector("#result_template");
        let cloneTemplateResult = document.importNode(resultTemplate.content, true);
        app.gameContainer.appendChild(cloneTemplateResult);
},
    
    getResult : function () {
        app.resultBtn.classList.add('display_none');
        app.gameContainer.innerText = "";
        app.createResultTemplate();
        let showCorrects = document.querySelector("#show_corrects");
        let showErrors = document.querySelector("#show_errors");
        showCorrects.innerText = app.arrayResultTrue.length;
        showErrors.innerText = app.arrayResultFalse.length;
        //console.log('FINI!');
    },

    //retry : function () {
    //    app.gameContainer.innerText = "";
    //    console.log("Recommencer");
    //},
};

//équivalent: copyQuizz : [...quizz];
let copyQuizz = app.shuffle([].concat(quizz));

app.init();