<template>
  <div>
    <div class="page-top">
      <div class="links">
        <NavLinks link_type="NO_QUIZ_LINK" />
      </div>
      <div class="title">generate questions</div>
    </div>
    <div class="page-bottom section-quiz">
      <QuizAmountButton />
      <QuizCategoryButton />
      <div class="quiz-create-area">
        <div v-if="isEnableCreateQuizButton" class="button button-quiz-create" @click="createButtonClickHandler">Create new quiz</div>
        <div v-else class="button button-quiz-create-disabled">Create new quiz</div>
        <div v-if="isShowMessage" class="message-quiz-create">{{ createQuizMessage }}</div>
      </div>
      <div v-if="isShowQuestions" class="quiz-questions-area">
        <Loading v-if="questionsArray.length < 1" />
        <div v-else class="questions-section">
          <div v-if="incompleteIdObjectsArray.length > 0" class="section-status status-incomplete">
            <div class="status-text" v-html="statusText"></div>
          </div>
          <div v-else class="section-status status-complete">
            <div class="status-text" v-html="statusText"></div>
            <div class="button button-reset-quiz" @click="resetButtonClickHandler">Reset current quiz</div>
          </div>
          <div class="section-questions-list">
            <QuestionItem v-for="(question, index) in questionsArray" :key="index" :item_prop="question" :index_prop="index" />
          </div>
          <BackToTop />
        </div>
      </div>
    </div> <!-- end page-bottom -->
  </div>
</template>

<script>
import NavLinks from '../components/NavLinks';
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import getQuizQuestions from '../shared/getQuizQuestions';
import Loading from '../components/Loading';
import QuestionItem from '../components/QuestionItem';
import BackToTop from '../components/BackToTop';
import QuizAmountButton from '../components/QuizAmountButton';
import QuizCategoryButton from '../components/QuizCategoryButton';

export default {
  name: 'FavoritePage',
  components: 
  {
    NavLinks,
    Loading,
    QuestionItem,
    BackToTop,
    QuizAmountButton,
    QuizCategoryButton
  },
  setup()
  {
    //console.log('quiz: ');
    const store = useStore();

    const numQuestions = computed(() => store.state.quizStore.numOfQuestions);
    const doSetIsShowQuizAmountSelection = (isShowQuizAmountSelection) => store.dispatch('doSetIsShowQuizAmountSelection', isShowQuizAmountSelection);

    const categoryArray = computed(() => store.state.quizStore.categoryArray);
    const categorySelected = computed(() => store.state.quizStore.categorySelected);
    const doSetIsShowQuizCategorySelection = (isShowQuizCategorySelection) => store.dispatch('doSetIsShowQuizCategorySelection', isShowQuizCategorySelection);

    const createQuizMessage = ref('');
    const isShowMessage = computed(() => store.state.quizStore.isShowMessage);
    const doSetIsShowMessage = (newIsShowMessage) => store.dispatch('doSetIsShowMessage', newIsShowMessage);
    const isEnableCreateQuizButton = ref(true);
    
    const { getQuestions, resetQuestions } = getQuizQuestions();
    const questionsArray = computed(() => store.state.quizStore.questionsArray);
    const doSetQuestionsArray = (questionsArray) => store.dispatch('doSetQuestionsArray', questionsArray);
    
    const isShowQuestions = ref(false);
    const incompleteIdObjectsArray = computed(() => store.state.quizStore.incompleteIdObjectsArray);
    const doSetNumOfCorrect = (numCorrect) => store.dispatch('doSetNumOfCorrect', numCorrect);
    
    const statusText = computed(() =>
    {
      let newStatusText = '';
      if (incompleteIdObjectsArray.value.length > 0)
      {
        const numOfComplete = questionsArray.value.length - incompleteIdObjectsArray.value.length;
        newStatusText = numOfComplete + '/' + questionsArray.value.length + ' complete';
        let needToAnswerText = '<br /> please answer: ';
        for (let i = 0; i < incompleteIdObjectsArray.value.length; i++)
        {
          if (i === 0)
          {
            needToAnswerText += '<span>q' + incompleteIdObjectsArray.value[i].orderId + '</span>';
          }
          else
          {
            needToAnswerText += ', <span>q' + incompleteIdObjectsArray.value[i].orderId + '</span>';
          }
        }
        newStatusText += needToAnswerText;
      }
      else
      {
        const numOfCorrect = store.state.quizStore.numOfCorrect;
        const score = Math.floor(numOfCorrect / questionsArray.value.length * 100);
        newStatusText = 'quiz complete <br />final score: ' + '<span>' + score + '%</span>';
      }
      return newStatusText;
    });

    //// FUNCTIONS

    const init = () =>
    {
      doSetIsShowMessage(false);
      if (questionsArray.value.length > 0)
      {
        isShowQuestions.value = true;
      }
    }

    watch(questionsArray, () =>
    {
      //console.log('quiz: watch: ', questionsArray.value);
      if (questionsArray.value.length > 0)
      {
        isEnableCreateQuizButton.value = true;
      }
    });

    //// EVENT HANDLER

    const createButtonClickHandler = () =>
    {
      doSetIsShowQuizAmountSelection(false);
      doSetIsShowQuizCategorySelection(false);
      //// validation
      const numRandom = store.state.monsterStore.numOfRandomMonsters;
      const randomMonstersArray = store.state.monsterStore.randomMonstersArray;
      if (!numQuestions.value)
      {
        createQuizMessage.value = 'Please select number of questions';
      }
      else if (!categorySelected.value)
      {
        createQuizMessage.value = 'Please select a category';
      }
      else if (categorySelected.value === 'Random Monsters' && parseInt(numQuestions.value) > numRandom)
      {
        createQuizMessage.value = 'No more than ' + numRandom.toString() + ' questions for Random Monsters Category';
      }
      else if (categorySelected.value === 'Random Monsters' && randomMonstersArray.length < 1)
      {
        createQuizMessage.value = 'No Random Monsters found.  Please click on Home and wait until they show up.  Then come back and try again.';
      }
      else
      {
        createQuizMessage.value = '';
      }
      
      if (createQuizMessage.value)
      {
        //// show errors
        doSetIsShowMessage(true);
      }
      else
      {
        //// show questions
        doSetIsShowMessage(false);
        var selectedCategoryArray = null;
        for (const categoryItemArray of categoryArray.value)
        {
          if (categoryItemArray[0] === categorySelected.value)
          {
            selectedCategoryArray = categoryItemArray;
            break;
          }
        }
        if (questionsArray.value.length > 0)
        {
          doSetQuestionsArray([]);
        }
        getQuestions(numQuestions.value, selectedCategoryArray);
        doSetNumOfCorrect(0);
        if (!isShowQuestions.value)
        {
          isShowQuestions.value = true;
        }
        isEnableCreateQuizButton.value = false;
      }
    }

    const resetButtonClickHandler = () =>
    {
      resetQuestions(questionsArray.value);
      doSetNumOfCorrect(0);
    }

    //// START

    init();
    
    return { createButtonClickHandler, createQuizMessage, isShowMessage, questionsArray, isEnableCreateQuizButton, isShowQuestions, incompleteIdObjectsArray, statusText, resetButtonClickHandler };
  }
}
</script>
