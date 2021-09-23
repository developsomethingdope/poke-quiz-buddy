import { createApp } from 'vue';
import App from './App.vue';
import router from "./shared/router";
import { createStore } from 'vuex';

const local_storage_key = 'poke-quiz-buddy-app-id-array';
const localStorageIdsArray = JSON.parse(localStorage.getItem(local_storage_key)) || [];

const generalModule =
{
  state()
  {
    return {
      isFavoriteAbout: false,
      isLinkToDetail: false,
      isIdsArrayChanged: false,
      isShowQuizAmountSelection: false,
      isShowQuizCategorySelection: false,
      isQuizCategoryAscendOrder: false
    };
  },
  mutations:
  {
    setIsFavoriteAbout(state, payload)
    {
      state.isFavoriteAbout = payload;
    },
    setIsLinkToDetail(state, payload)
    {
      state.isLinkToDetail = payload;
    },
    setIsIdsArrayChanged(state, payload)
    {
      state.isIdsArrayChanged = payload;
    },
    setIsShowQuizAmountSelection(state, payload)
    {
      state.isShowQuizAmountSelection = payload;
    },
    setIsShowQuizCategorySelection(state, payload)
    {
      state.isShowQuizCategorySelection = payload;
    },
    setIsQuizCategoryAscendOrder(state, payload)
    {
      state.isQuizCategoryAscendOrder = payload;
    }
  },
  actions:
  {
    doSetIsFavoriteAbout(context, payload)
    {
      context.commit('setIsFavoriteAbout', payload);
    },
    doSetIsLinkToDetail(context, payload)
    {
      context.commit('setIsLinkToDetail', payload);
    },
    doSetIsIdsArrayChanged(context, payload)
    {
      context.commit('setIsIdsArrayChanged', payload);
    },
    doSetIsShowQuizAmountSelection(context, payload)
    {
      context.commit('setIsShowQuizAmountSelection', payload);
    },
    doSetIsShowQuizCategorySelection(context, payload)
    {
      context.commit('setIsShowQuizCategorySelection', payload);
    },
    doSetIsQuizCategoryAscendOrder(context, payload)
    {
      context.commit('setIsQuizCategoryAscendOrder', payload);
    }
  }
}

const monsterModule =
{
  state()
  {
    return {
      totalNumOfMonsters: 0,
      numOfRandomMonsters: 4,
      randomMonstersArray: [],
      favoriteIdsArray: localStorageIdsArray,
      favoriteMonstersArray: []
    };
  },
  mutations:
  {
    setTotalNumOfMonsters(state, payload)
    {
      state.totalNumOfMonsters = payload;
    },
    setRandomMonstersArray(state, payload)
    {
      state.randomMonstersArray = payload;
    },
    setFavoriteIdsArray(state, payload)
    {
      state.favoriteIdsArray = payload;
    },
    setFavoriteMonstersArray(state, payload)
    {
      state.favoriteMonstersArray = payload;
    }
  },
  actions:
  {
    doSetTotalNumOfMonsters(context, payload)
    {
      context.commit('setTotalNumOfMonsters', payload);
    },
    doSetRandomMonstersArray(context, payload)
    {
      context.commit('setRandomMonstersArray', payload);
    },
    doSetFavoriteIdsArray(context, payload)
    {
      context.commit('setFavoriteIdsArray', payload);
    },
    doSetFavoriteMonstersArray(context, payload)
    {
      context.commit('setFavoriteMonstersArray', payload);
    }
  }
}

const quizModule =
{
  state()
  {
    return {
      numOfQuestions: '',
      categorySelected: '',
      categoryArray: [],
      questionsArray: [],
      incompleteIdObjectsArray: [],
      numOfCorrect: 0
    };
  },
  mutations:
  {
    setNumOfQuestions(state, payload)
    {
      state.numOfQuestions = payload;
    },
    setCategorySelected(state, payload)
    {
      state.categorySelected = payload;
    },
    setCategoryArray(state, payload)
    {
      state.categoryArray = payload;
    },
    setQuestionsArray(state, payload)
    {
      state.questionsArray = payload;
    },
    setIncompleteIdObjectsArray(state, payload)
    {
      state.incompleteIdObjectsArray = payload;
    },
    setNumOfCorrect(state, payload)
    {
      state.numOfCorrect = payload;
    }
  },
  actions:
  {
    doSetNumOfQuestions(context, payload)
    {
      context.commit('setNumOfQuestions', payload);
    },
    doSetCategorySelected(context,payload)
    {
      context.commit('setCategorySelected', payload);
    },
    doSetCategoryArray(context, payload)
    {
      context.commit('setCategoryArray', payload);
    },
    doSetQuestionsArray(context, payload)
    {
      context.commit('setQuestionsArray', payload);
    },
    doSetIncompleteIdObjectsArray(context, payload)
    {
      context.commit('setIncompleteIdObjectsArray', payload);
    },
    doSetNumOfCorrect(context, payload)
    {
      context.commit('setNumOfCorrect', payload);
    }
  }
}

const store = createStore(
{
  modules:
  {
    generalStore: generalModule,
    monsterStore: monsterModule,
    quizStore: quizModule
  }
});

createApp(App)
.use(router)
.use(store)
.mount('#app');
