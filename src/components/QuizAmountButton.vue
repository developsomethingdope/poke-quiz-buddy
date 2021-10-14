<template>
  <div class="quiz-amount-area">
    <div class="button button-quiz-amount" @click="amountButtonClickHandler">{{ amountButtonText }}</div>
    <div v-show="isShowAmountSelection" class="selection-quiz-amount">
      <div 
      v-for="(amountItem, index) in quizAmountArray" 
      :key="index" 
      class="button-selection-amount" 
      @click="amountSelectClickHandler(amountItem)" 
      :class="numQuestions === amountItem ? 'button-selection-selected' : 'button-selection-unselected'" 
      :data-quiz-amount="amountItem"
      >{{ amountItem }}</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'QuizAmountButton',
  setup()
  {
    const quizAmountArray = ref(['2', '4', '6', '8', '10']);
    const store = useStore();

    const amountButtonTextInstruction = 'Select number of questions';
    const amountButtonText = ref(amountButtonTextInstruction);
    const numQuestions = computed(() => store.state.quizStore.numOfQuestions);
    const doSetNumOfQuestions = (numOfQuestions) => store.dispatch('doSetNumOfQuestions', numOfQuestions);
    const isShowAmountSelection = computed(() => store.state.generalStore.isShowQuizAmountSelection);
    const doSetIsShowQuizAmountSelection = (isShowQuizAmountSelection) => store.dispatch('doSetIsShowQuizAmountSelection', isShowQuizAmountSelection);
    const doSetIsShowMessage = (isShowMessage) => store.dispatch('doSetIsShowMessage', isShowMessage);

    //// FUNCTIONS

    const init = () =>
    {
      if (numQuestions.value)
      {
        amountButtonText.value = 'Number Selected: ' + numQuestions.value + ' questions';
      }
    }

    watch(isShowAmountSelection, () =>
    {
      if (!isShowAmountSelection.value && numQuestions.value)
      {
        amountButtonText.value = 'Number Selected: ' + numQuestions.value + ' questions';
      }
    });

    //// EVENT HANDLER

    const amountButtonClickHandler = () =>
    {
      doSetIsShowQuizAmountSelection(true);
      amountButtonText.value = amountButtonTextInstruction;
      doSetIsShowMessage(false);
    }

    const amountSelectClickHandler = (amount) =>
    {
      doSetNumOfQuestions(amount);
      doSetIsShowQuizAmountSelection(false);
      amountButtonText.value = 'Number Selected: ' + amount + ' questions';
    }

    //// START

    init();

    return { quizAmountArray, numQuestions, amountButtonText, amountButtonClickHandler, isShowAmountSelection, amountSelectClickHandler };
  }
}
</script>
