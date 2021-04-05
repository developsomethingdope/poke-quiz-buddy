<template>
  <div>
    <div class="page-top">
      <div class="links">
        <NavLinks link_type="NO_FAVORITE_LINK" />
      </div>
      <div class="title">favorite monsters</div>
    </div>
    <div v-if="favoriteIdsArrayLocal.length < 1" class="page-bottom section-favorite section-favorite-none">
      <div class="section-subtitle">none found</div>
      <p>Just click on Home and pick some monsters.</p>
    </div>
    <div v-else class="page-bottom section-favorite">
      <MonsterList :list_prop="favoriteMonstersArrayLocal" />
      <BackToTop />
    </div>
  </div>
</template>

<script>
import NavLinks from "../components/NavLinks";
import { useStore } from 'vuex';
import { ref } from 'vue';
import MonsterList from "../components/MonsterList";
import BackToTop from "../components/BackToTop";

export default {
  name: 'FavoritePage',
  components: 
  {
    NavLinks,
    MonsterList,
    BackToTop
  },
  setup()
  {
    //console.log('favorite: ');
    const partialUrl = 'https://app.pokemon-api.xyz/pokemon/';
    const store = useStore();
    const favoriteIdsArrayLocal = ref(store.state.monsterStore.favoriteIdsArray);
    const favoriteMonstersArrayLocal = ref(store.state.monsterStore.favoriteMonstersArray);
    const doSetIsLinkToDetail = (isLinkToDetail) => store.dispatch('doSetIsLinkToDetail', isLinkToDetail);
    const doSetFavoriteMonstersArray = (monsterArray) => store.dispatch('doSetFavoriteMonstersArray', monsterArray);
    const isIdsArrayChangedLocal = store.state.generalStore.isIdsArrayChanged;
    const doSetIsIdsArrayChanged = (isArrayChanged) => store.dispatch('doSetIsIdsArrayChanged', isArrayChanged);

    //// FUNCTIONS

    const init = () =>
    {
      if (favoriteIdsArrayLocal.value.length > 0 && isIdsArrayChangedLocal)
      {
        favoriteMonstersArrayLocal.value = [];
        getFavoriteData();
        doSetIsIdsArrayChanged(false);
      }
      doSetIsLinkToDetail(true);
    }

    const getFavoriteData = async () =>
    {
      try
      {
        var newMonstersArray = [];
        for (const idItem of favoriteIdsArrayLocal.value)
        {
          const favoriteUrl = partialUrl + idItem;
          const response = await fetch(favoriteUrl);
          const dataJson = await response.json();
          newMonstersArray = addDataToList(dataJson, newMonstersArray);
        }
        favoriteMonstersArrayLocal.value = newMonstersArray;
        doSetFavoriteMonstersArray(newMonstersArray);
      }
      catch(error)
      {
        console.log('favorite page: ', error);
      }
    }

    const addDataToList = (dataItem, list) =>
    {
      const monsterItem =
      {
        id: dataItem.id,
        name: dataItem.name.english,
        image: dataItem.hires,
        isFavorite: true
      }
      list.push(monsterItem);
      return list;
    }

    //// START

    init();

    return { favoriteIdsArrayLocal, favoriteMonstersArrayLocal };
  }
}
</script>
