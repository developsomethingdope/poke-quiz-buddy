import { useStore } from "vuex";

const getQuizQuestions = () =>
{
  //console.log('getQuizQuestsions: ');
  const partialTriviaUrl = 'https://opentdb.com/api.php?';
  //const monsterTypesUrl = 'https://app.pokemon-api.xyz/types/all'; //// old api
  const monsterTypesUrl = 'https://pokeapi.co/api/v2/type/';
  const store = useStore();
  const doSetQuestionsArray = (questionsArray) => store.dispatch('doSetQuestionsArray', questionsArray);
  const doSetIncompleteIdObjectsArray = (incompleteArray) => store.dispatch('doSetIncompleteIdObjectsArray', incompleteArray);

  //// GENERAL FUNCTIONS
  
  const addIncorrectAnswersToAnswersArray = (idAnswerCount, incorrectArray, answersArray) =>
  {
    let newIdCount = idAnswerCount;
    var newAnswersArray = answersArray;
    for (const incorrectItem of incorrectArray)
    {
      newIdCount = addIdAnswerCount(0.1, newIdCount);
      newAnswersArray = addToAnswersArray(newIdCount, incorrectItem, false, newAnswersArray);
    }
    return newAnswersArray;
  }

  const addIdAnswerCount = (answerAmount, answerCount) =>
  {
    answerCount += answerAmount;
    answerCount = parseFloat(answerCount.toFixed(1));
    return answerCount;
  }

  const addToAnswersArray = (answerId, answerText, isAnswerCorrect, answersArray) =>
  {
    const answerItem =
    {
      id: answerId,
      answer: answerText,
      isCorrect: isAnswerCorrect,
      isSelected: false
    }
    answersArray.push(answerItem);
    return answersArray;
  }

  const getIncompleteIdObjectsArray = (questionsArray) =>
  {
    const newIncompleteArray = [];
    let orderIdCount = 0;
    for (const currentQuestionItem of questionsArray)
    {
      orderIdCount++;
      const idObject =
      {
        orderId: orderIdCount,
        questionId: currentQuestionItem.id
      }
      newIncompleteArray.push(idObject);
    }
    doSetIncompleteIdObjectsArray(newIncompleteArray);
  }

  //// MONSTER FUNCTIONS
  
  const getMonsterQuestions = async (numQuestions) =>
  {
    try
    {
      var newQuestionsArray = [];
      const response = await fetch(monsterTypesUrl);
      const dataJson = await response.json();
      var dataTypesArray = [];
      for (const dataItem of dataJson.results)
      {
        const typeId = extractIdFromUrl(dataItem.url);
        if (typeId < 10000)
        {
          dataTypesArray.push(dataItem.name);
        }
      }
      newQuestionsArray = parseMonsterTypesData(dataTypesArray, numQuestions);
      newQuestionsArray.sort(() => Math.random() - 0.5);
      doSetQuestionsArray(newQuestionsArray);
      getIncompleteIdObjectsArray(newQuestionsArray);
    }
    catch(error)
    {
      console.log('getQuizQuestsions: ', error);
    }
    return newQuestionsArray;
  }
  
  const extractIdFromUrl = (url) =>
  {
    const urlArray = url.split("/");
    const id = parseInt(urlArray[urlArray.length - 2]);
    return id;
  }

  const parseMonsterTypesData = (dataArray, numQuestions) =>
  {
    var newQuestionsArray = [];
    var newRandomMonstersArray = [...store.state.monsterStore.randomMonstersArray];
    const newNumQuestions = parseInt(numQuestions);
    if (newNumQuestions < newRandomMonstersArray.length)
    {
      newRandomMonstersArray = smallerRandomArray(newRandomMonstersArray, newNumQuestions);
    }
    for (const monsterItem of newRandomMonstersArray)
    {
      var newAnswersArray = [];
      let idAnswerCount = monsterItem.id;
      var correctTypeArray = monsterItem.type.split(', ');
      var incorrectTypeArray = dataArray;
      for (const correctItem of correctTypeArray)
      {
        incorrectTypeArray = incorrectTypeArray.filter((incorrectItem) => incorrectItem !== correctItem);
      }
      if (correctTypeArray.length > 1)
      {
        correctTypeArray = smallerRandomArray(correctTypeArray, 1);
      }
      incorrectTypeArray = smallerRandomArray(incorrectTypeArray, 3);
      idAnswerCount = addIdAnswerCount(0.1, idAnswerCount);
      newAnswersArray = addToAnswersArray(idAnswerCount, correctTypeArray[0], true, newAnswersArray);
      newAnswersArray = addIncorrectAnswersToAnswersArray(idAnswerCount, incorrectTypeArray, newAnswersArray);
      newAnswersArray.sort(() => Math.random() - 0.5);

      const categoryQuestion = 'What is monster type of ' + monsterItem.name + '?';

      const questionItem =
      {
        id: monsterItem.id,
        category: categoryQuestion,
        type: 'multiple',
        question: monsterItem.image,
        answers: newAnswersArray,
        isAnswerSelected: false
      }
      newQuestionsArray.push(questionItem);
    }
    return newQuestionsArray;
  }

  const smallerRandomArray = (bigArray, newArraySize) =>
  {
    const numToShuffleArray = 2;
    for (let i = 0; i < numToShuffleArray; i++)
    {
      bigArray.sort(() => Math.random() - 0.5);
    }
    const smallArray = bigArray.slice(0, newArraySize);
    return smallArray;
  }

  //// TRIVIA FUNCTIONS
  
  const getTriviaQuestions = async (numQuestions, categoryArray) =>
  {
    try
    {
      let triviaUrl = partialTriviaUrl + 'amount=' + numQuestions;
      if (categoryArray[0] !== 'Any Category (exclude Random)')
      {
        triviaUrl += '&category=' + categoryArray[1];
      }
      //triviaUrl += '&type=boolean'; //// test only
      var newQuestionsArray = [];
      const response = await fetch(triviaUrl);
      const dataJson = await response.json();
      if (dataJson.response_code === 0)
      {
        newQuestionsArray = parseTriviaData(dataJson.results);
        doSetQuestionsArray(newQuestionsArray);
        getIncompleteIdObjectsArray(newQuestionsArray);
      }
    }
    catch(error)
    {
      console.log('getQuizQuestsions: ', error);
    }
    return newQuestionsArray;
  }
  
  const parseTriviaData = (dataArray) =>
  {
    const newQuestionsArray = [];
    let idQuestionCount = 0;
    for (const dataItem of dataArray)
    {
      idQuestionCount++;
      var newAnswersArray = [];
      let idAnswerCount = idQuestionCount;
      if (dataItem.type === 'boolean')
      {
        if (dataItem.correct_answer.toLowerCase() === 'true')
        {
          idAnswerCount = addIdAnswerCount(0.1, idAnswerCount);
          newAnswersArray = addToAnswersArray(idAnswerCount, dataItem.correct_answer, true, newAnswersArray);
          newAnswersArray = addIncorrectAnswersToAnswersArray(idAnswerCount, dataItem.incorrect_answers, newAnswersArray);
        }
        else
        {
          newAnswersArray = addIncorrectAnswersToAnswersArray(idAnswerCount, dataItem.incorrect_answers, newAnswersArray);
          idAnswerCount = addIdAnswerCount(dataItem.incorrect_answers.length * 0.1 + 0.1, idAnswerCount);
          newAnswersArray = addToAnswersArray(idAnswerCount, dataItem.correct_answer, true, newAnswersArray);
        }
      }
      else
      {
        idAnswerCount = addIdAnswerCount(0.1, idAnswerCount);
        newAnswersArray = addToAnswersArray(idAnswerCount, dataItem.correct_answer, true, newAnswersArray);
        newAnswersArray = addIncorrectAnswersToAnswersArray(idAnswerCount, dataItem.incorrect_answers, newAnswersArray);
        newAnswersArray.sort(() => Math.random() - 0.5);
      }

      const questionItem =
      {
        id: idQuestionCount,
        category: dataItem.category,
        type: dataItem.type,
        question: dataItem.question,
        answers: newAnswersArray,
        isAnswerSelected: false
      }
      newQuestionsArray.push(questionItem);
    }
    return newQuestionsArray;
  }
  
  //// EXPORT FUNCTIONS

  const getQuestions = (numQuestions, categoryArray) =>
  {
    if (categoryArray[0] === 'Random Monsters')
    {
      getMonsterQuestions(numQuestions);
    }
    else
    {
      getTriviaQuestions(numQuestions, categoryArray);
    }
  }

  const resetQuestions = (questionArray) =>
  {
    const newQuestionsArray = [...questionArray];
    for (const questionItem of newQuestionsArray)
    {
      questionItem.isAnswerSelected = false;
      for (const answerItem of questionItem.answers)
      {
        if (answerItem.isSelected)
        {
          answerItem.isSelected = false;
          break;
        }
      }
      if (questionItem.type !== 'boolean')
      {
        questionItem.answers.sort(() => Math.random() - 0.5);
      }
    }
    newQuestionsArray.sort(() => Math.random() - 0.5);
    doSetQuestionsArray(newQuestionsArray);
    getIncompleteIdObjectsArray(newQuestionsArray);
  }

  return { getQuestions, resetQuestions };
}

export default getQuizQuestions;
