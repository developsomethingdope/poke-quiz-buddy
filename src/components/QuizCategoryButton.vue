<template>
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
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'QuizCategoryButton',
  setup()
  {
    const categoryUrl = 'https://opentdb.com/api_category.php';
    const stringSeperator = ':::';
    const store = useStore();

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
    const doSetIsShowMessage = (isShowMessage) => store.dispatch('doSetIsShowMessage', isShowMessage);

    //// FUNCTIONS

    const init = () =>
    {
      if (categorySelected.value)
      {
        categoryButtonText.value = 'Category Selected: ' + categorySelected.value;
      }
      if (categoryArray.value.length < 1)
      {
        getCategoryData();
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

    watch(isShowCategorySelection, () =>
    {
      if (!isShowCategorySelection.value && categorySelected.value)
      {
        categoryButtonText.value = 'Category Selected: ' + categorySelected.value;
      }
    });

    //// EVENT HANDLER

    const categoryButtonClickHandler = () =>
    {
      doSetIsShowQuizCategorySelection(true);
      categoryButtonText.value = categoryButtonTextInstruction;
      doSetIsShowMessage(false);
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

    //// START

    init();

    return { categoryArray, categorySelected, categoryButtonText, categoryButtonClickHandler, isShowCategorySelection, categorySelectClickHandler, isCategoryAscendOrder, ascendOrderClickHandler, descendOrderClickHandler };
  }
}
</script>
