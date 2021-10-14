<template>
  <div class="section-item" :class="isFavoriteLocal && 'section-item-favorite'">
    <div class="item-image">
      <div class="item-gradient"></div>
      <!-- 
      <img :src="item_prop.image" :alt="item_prop.name">
      <img :src="require('@/assets/placeholder.png')" alt="placeholder">
      -->
      <router-link v-if="isLinkToDetailLocal" :to="{ name: 'MonsterDetailPage', params: {url_id: item_prop.id} }">
        <img :src="item_prop.image" :alt="item_prop.name">
      </router-link>
      <img v-else :src="item_prop.image" :alt="item_prop.name">
    </div>
    <div class="section-item-bottom">
      <div class="item-title">
        <router-link v-if="isLinkToDetailLocal" :to="{ name: 'MonsterDetailPage', params: {url_id: item_prop.id} }">{{ item_prop.name }}</router-link>
        <span v-else>{{ item_prop.name }}</span>
      </div>
      <div class="item-favorite">
        <div class="favorite-toggle">
          <div v-if="isFavoriteLocal" class="toggle-label">Favorite</div>
          <div v-else class="toggle-label">Not favorite</div>
          <label class="toggle-switch">
            <input type="checkbox" :checked="isFavoriteLocal" @click="toggleChangeHandler" />
            <span class="switch-slider switch-round"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from "vuex";

export default {
  name: 'MonsterItem',
  props: ['item_prop'],
  setup(props)
  {
    const store = useStore();
    const localStorageKeyLocal = store.state.monsterStore.localStorageKey;
    const isFavoriteLocal = ref(props.item_prop.isFavorite);
    const doSetFavoriteIdsArray = (idsArray) => { store.dispatch('doSetFavoriteIdsArray', idsArray); };
    const doSetRandomMonstersArray = (monstersArray) => { store.dispatch('doSetRandomMonstersArray', monstersArray); };
    const doSetIsIdsArrayChanged = (isArrayChanged) => { store.dispatch('doSetIsIdsArrayChanged', isArrayChanged); };
    const isLinkToDetailLocal = ref(store.state.generalStore.isLinkToDetail);
    
    //// EVENT HANDLER
    
    const toggleChangeHandler = () =>
    {
      var localStorageIdsArray = [...store.state.monsterStore.favoriteIdsArray];
      if (isFavoriteLocal.value)
      {
        localStorageIdsArray = localStorageIdsArray.filter((idItem) => idItem !== props.item_prop.id);
      }
      else
      {
        localStorageIdsArray.push(props.item_prop.id);
      }
      //console.log('item: ', localStorageIdsArray);
      const randomArrayLocal = [...store.state.monsterStore.randomMonstersArray];
      for (const randomItem of randomArrayLocal)
      {
        if (randomItem.id === props.item_prop.id)
        {
          randomItem.isFavorite = !randomItem.isFavorite;
          break;
        }
      }
      localStorage.setItem(localStorageKeyLocal, JSON.stringify(localStorageIdsArray));
      doSetFavoriteIdsArray(localStorageIdsArray);
      doSetRandomMonstersArray(randomArrayLocal);
      isFavoriteLocal.value = !isFavoriteLocal.value;
      doSetIsIdsArrayChanged(true);
    }

    return { isFavoriteLocal, toggleChangeHandler, isLinkToDetailLocal }
  }
}
</script>
