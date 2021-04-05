<template>
  <div>
    <div class="page-top">
      <div class="links">
        <NavLinks link_type="NO_QUIZ_LINK" />
      </div>
      <div class="title">generate questions</div>
    </div>
    <div class="page-bottom section-quiz">
      <div class="quiz-amount-area">
        <div class="button button-quiz-amount" @click="amountButtonClickHandler">{{ amountButtonText }}</div>
        <div v-show="isShowAmountSelection" class="selection-quiz-amount">
          <div 
          v-for="(amountItem, index) in quizAmountArray" 
          :key="index" 
          class="button-selection-amount" 
          @click="amountSelectClickHandler(amountItem)" 
          :class="numQuestions === amountItem ? 'button-selection-selected' : 'button-selection-unselected'"
          >{{ amountItem }}</div>
        </div>
      </div>
      <div class="quiz-category-area">
        <div v-if="categoryArray.length < 1" class="button button-quiz-category-disabled">{{ categoryButtonText }}</div>
        <div v-else class="button button-quiz-category" @click="categoryButtonClickHandler">{{ categoryButtonText }}</div>
        <div v-show="isShowCategorySelection" class="selection-quiz-category">
          <div class="order-selection-category">
            <span v-if="isCategoryAscendOrder" @click="descendOrderClickHandler">Change to descending order</span>
            <span v-else @click="ascendOrderClickHandler">Change to ascending order</span>
          </div>
          <div 
          v-for="(categoryItemArray, index) in categoryArray" 
          :key="index" 
          class="button-selection-category" 
          @click="categorySelectClickHandler(categoryItemArray[0])" 
          :class="categorySelected === categoryItemArray[0] ? 'button-selection-selected' : 'button-selection-unselected'"
          >{{ categoryItemArray[0] }}</div>
        </div>
      </div>
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
import NavLinks from "../components/NavLinks";
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import getQuizQuestions from "../shared/getQuizQuestions";
import Loading from "../components/Loading";
import QuestionItem from "../components/QuestionItem";
import BackToTop from "../components/BackToTop";

export default {
  name: 'FavoritePage',
  components: 
  {
    NavLinks,
    Loading,
    QuestionItem,
    BackToTop
  },
  setup()
  {
    //console.log('quiz: ');
    const categoryUrl = 'https://opentdb.com/api_category.php';
    const quizAmountArray = ref(['2', '4', '6', '8', '10']);
    const stringSeperator = ':::';
    const store = useStore();

    const amountButtonTextInstruction = 'Select number of questions';
    const amountButtonText = ref(amountButtonTextInstruction);
    const numQuestions = computed(() => store.state.quizStore.numOfQuestions);
    const doSetNumOfQuestions = (numOfQuestions) => store.dispatch('doSetNumOfQuestions', numOfQuestions);
    const isShowAmountSelection = computed(() => store.state.generalStore.isShowQuizAmountSelection);
    const doSetIsShowQuizAmountSelection = (isShowQuizAmountSelection) => store.dispatch('doSetIsShowQuizAmountSelection', isShowQuizAmountSelection);
    
    const categoryButtonTextInstruction = 'Select category';
    const categoryButtonText = ref(categoryButtonTextInstruction);
    const categoryArray = computed(() => store.state.quizStore.categoryArray);
    const doSetCategoryArray = (newCategoryArray) => store.dispatch('doSetCategoryArray', newCategoryArray);
    const categorySelected = computed(() => store.state.quizStore.categorySelected);
    const doSetCategorySelected = (newCategorySelected) => store.dispatch('doSetCategorySelected', newCategorySelected);
    const isShowCategorySelection = computed(() => store.state.generalStore.isShowQuizCategorySelection);
    const doSetIsShowQuizCategorySelection = (isShowQuizCategorySelection) => store.dispatch('doSetIsShowQuizCategorySelection', isShowQuizCategorySelection);
    const isCategoryAscendOrder = computed(() => store.state.generalStore.isQuizCategoryAscendOrder);
    const doSetIsQuizCategoryAscendOrder = (isQuizCategoryAscendOrder) => store.dispatch('doSetIsQuizCategoryAscendOrder', isQuizCategoryAscendOrder);

    const createQuizMessage = ref('');
    const isShowMessage = ref(false);
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
      if (numQuestions.value)
      {
        amountButtonText.value = 'Number Selected: ' + numQuestions.value + ' questions';
      }
      if (categorySelected.value)
      {
        categoryButtonText.value = 'Category Selected: ' + categorySelected.value;
      }
      if (categoryArray.value.length < 1)
      {
        getCategoryData();
      }
      if (questionsArray.value.length > 0)
      {
        isShowQuestions.value = true;
      }
    }

    const getCategoryData = async () =>
    {
      try
      {
        var newCategoryArray = [];
        const response = await fetch(categoryUrl);
        const dataJson = await response.json();
        newCategoryArray = dataJson.trivia_categories;
        newCategoryArray = addMonstersToCategory(newCategoryArray);
        doSetCategoryArray(newCategoryArray);
      }
      catch(error)
      {
        console.log('quiz page: ', error);
      }
    }

    const addMonstersToCategory = (categoryArrayLocal) =>
    {
      const monsterCategoriesArray =
      [
        ['Random Monsters', '1001'],
        ['Any Category (exclude Random)', '1003']
      ];
      const newCategoryArray = categoryArrayLocal.map((categoryItem) => [categoryItem.name, categoryItem.id.toString()]);
      for (let i = monsterCategoriesArray.length - 1; i > -1; i--)
      {
        newCategoryArray.unshift(monsterCategoriesArray[i]);
      }
      return newCategoryArray;
    }

    const changeOrderCategoryArray = (isDescendingOrder) =>
    {
      var newCategoryArray = sortAscendCategoryArray(categoryArray.value);
      if (isDescendingOrder)
      {
        newCategoryArray.reverse();
      }
      newCategoryArray = newCategoryArray.map((categoryItemString) => categoryItemString.split(stringSeperator));
      doSetCategoryArray(newCategoryArray);
    }

    const sortAscendCategoryArray = (categoryArrayLocal) =>
    {
      const newCategoryArray = categoryArrayLocal.map((categoryItemArray) => categoryItemArray.join(stringSeperator));
      newCategoryArray.sort();
      return newCategoryArray;
    }

    watch(questionsArray, () =>
    {
      //console.log('quiz : watch: ', questionsArray.value);
      if (questionsArray.value.length > 0)
      {
        isEnableCreateQuizButton.value = true;
      }
    });

    //// EVENT HANDLER

    const amountButtonClickHandler = () =>
    {
      doSetIsShowQuizAmountSelection(true);
      amountButtonText.value = amountButtonTextInstruction;
      isShowMessage.value = false;
    }

    const amountSelectClickHandler = (amount) =>
    {
      doSetNumOfQuestions(amount);
      doSetIsShowQuizAmountSelection(false);
      amountButtonText.value = 'Number Selected: ' + amount + ' questions';
    }

    const categoryButtonClickHandler = () =>
    {
      doSetIsShowQuizCategorySelection(true);
      categoryButtonText.value = categoryButtonTextInstruction;
      isShowMessage.value = false;
    }

    const categorySelectClickHandler = (category) =>
    {
      doSetCategorySelected(category);
      doSetIsShowQuizCategorySelection(false);
      categoryButtonText.value = 'Category Selected: ' + category;
    }

    const ascendOrderClickHandler = () =>
    {
      changeOrderCategoryArray(false);
      doSetIsQuizCategoryAscendOrder(true);
    }

    const descendOrderClickHandler = () =>
    {
      changeOrderCategoryArray(true);
      doSetIsQuizCategoryAscendOrder(false);
    }

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
        isShowMessage.value = true;
      }
      else
      {
        //// show questions
        isShowMessage.value = false;
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

    return { quizAmountArray, numQuestions, amountButtonText, amountButtonClickHandler, isShowAmountSelection, amountSelectClickHandler, categoryArray, categorySelected, categoryButtonText, categoryButtonClickHandler, isShowCategorySelection, categorySelectClickHandler, isCategoryAscendOrder, ascendOrderClickHandler, descendOrderClickHandler, createButtonClickHandler, createQuizMessage, isShowMessage, questionsArray, isEnableCreateQuizButton, isShowQuestions, incompleteIdObjectsArray, statusText, resetButtonClickHandler };
  }
}
</script>
