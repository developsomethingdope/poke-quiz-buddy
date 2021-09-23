<template>
  <div class="section-item">
    <div v-if="item_prop.question.startsWith('http')" class="item-image">
      <div class="item-gradient"></div>
      <!-- 
      <img :src="item_prop.question" :alt="item_prop.id">
      <img :src="require('@/assets/placeholder.png')" alt="placeholder">
      -->
      <img :src="item_prop.question" :alt="item_prop.id">
    </div>
    <div v-else class="item-question-text" v-html="item_prop.question"></div>
    <div class="section-item-bottom">
      <div class="item-title">Q{{ index_prop + 1 }}) {{ item_prop.category }}</div>
      <div v-if="item_prop.isAnswerSelected" class="item-selection">
        <div 
        v-for="(answerItem, index) in item_prop.answers" 
        :key="index" 
        class="button-item-selection-disabled" 
        :class="
        {
          'button-selection-correct': answerItem.isCorrect,
          'button-selection-incorrect': !answerItem.isCorrect && answerItem.isSelected,
          'button-selection-unselected': !answerItem.isCorrect && !answerItem.isSelected
        }" 
        v-html="answerItem.answer"
        ></div>
      </div>
      <div v-else class="item-selection">
        <div 
        v-for="(answerItem, index) in item_prop.answers" 
        :key="index" 
        class="button-item-selection button-selection-unselected" 
        v-html="answerItem.answer" 
        @click="answerButtonClickHandler(answerItem.id)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'QuestionItem',
  props: ['item_prop', 'index_prop'],
  setup()
  {
    //console.log('question item: ');
    const store = useStore();
    const doSetQuestionsArray = (questionsArray) => store.dispatch('doSetQuestionsArray', questionsArray);
    const doSetIncompleteIdObjectsArray = (incompleteArray) => store.dispatch('doSetIncompleteIdObjectsArray', incompleteArray);
    const doSetNumOfCorrect = (numCorrect) => store.dispatch('doSetNumOfCorrect', numCorrect);
    
    //// EVENT HANDLER

    const answerButtonClickHandler = (answerId) =>
    {
      const newQuestionsArray = [...store.state.quizStore.questionsArray];
      for (const currentQuestionItem of newQuestionsArray)
      {
        if (currentQuestionItem.id === Math.floor(answerId))
        {
          for (const currentAnswerItem of currentQuestionItem.answers)
          {
            if (currentAnswerItem.id === answerId)
            {
              currentAnswerItem.isSelected = true;
              if (currentAnswerItem.isCorrect)
              {
                const numOfCorrect = store.state.quizStore.numOfCorrect;
                doSetNumOfCorrect(numOfCorrect + 1);
              }
              break;
            }
          }
          currentQuestionItem.isAnswerSelected = true;
          break;
        }
      }
      doSetQuestionsArray(newQuestionsArray);
      var newincompleteArray = [...store.state.quizStore.incompleteIdObjectsArray];
      newincompleteArray = newincompleteArray.filter((incompleteItem) => incompleteItem.questionId !== Math.floor(answerId));
      doSetIncompleteIdObjectsArray(newincompleteArray);
    }
    
    return { answerButtonClickHandler };
  }
}
</script>
