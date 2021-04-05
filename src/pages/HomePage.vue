<template>
  <div>
    <div class="page-top">
      <div class="links">
        <NavLinks link_type="NO_HOME_LINK" />
      </div>
      <div class="title">random monsters</div>
    </div>
    
    <div class="page-bottom section-home">
      <div v-if="randomMonstersArray.length < 1" class="button button-home-disabled">Show me new random monsters</div>
      <div v-else class="button button-home" @click="showClickHandler">Show me new random monsters</div>
      <MonsterList :list_prop="randomMonstersArray" />
      <BackToTop />
    </div>
  </div>
</template>

<script>
import NavLinks from "@/components/NavLinks";
import { computed } from 'vue';
import { useStore } from "vuex";
import MonsterList from "../components/MonsterList";
import BackToTop from "../components/BackToTop";

export default {
  name: 'HomePage',
  components: 
  {
    NavLinks,
    MonsterList,
    BackToTop
  },
  setup()
  {
    //console.log('home: ');
    const randomUrl = 'https://app.pokemon-api.xyz/pokemon/random';
    const store = useStore();
    const numOfRandomMonsters = store.state.monsterStore.numOfRandomMonsters;
    const randomMonstersArray = computed(() => store.state.monsterStore.randomMonstersArray);
    const doSetRandomMonstersArray = (monstersArray) => { store.dispatch('doSetRandomMonstersArray', monstersArray); };
    const doSetIsLinkToDetail = (isLinkToDetail) => store.dispatch('doSetIsLinkToDetail', isLinkToDetail);
    
    //// FUNCTIONS

    const init = () =>
    {
      if (randomMonstersArray.value.length < 1)
      {
        getRandomData();
      }
      doSetIsLinkToDetail(true);
    }

    const getRandomData = async () =>
    {
      try
      {
        var newMonstersArray = [];
        var idsObject = {};
        for (let i = 0; i < numOfRandomMonsters; i++)
        {
          var idLocal = '';
          var dataJson = null;
          do
          {
            const response = await fetch(randomUrl);
            dataJson = await response.json();
            idLocal = dataJson.id;
          } while (idsObject[idLocal]);
          idsObject[idLocal] = true;
          newMonstersArray = addDataToList(dataJson, newMonstersArray);
          //console.log('home: ', idsObject);
        }
        doSetRandomMonstersArray(newMonstersArray);
      }
      catch(error)
      {
        console.log('home page: ', error);
      }
    }

    const addDataToList = (dataItem, list) =>
    {
      let isFavoriteLocal = false;
      const favoriteIdsArrayLocal = [...store.state.monsterStore.favoriteIdsArray];
      for (const idItem of favoriteIdsArrayLocal)
      {
        if (idItem === dataItem.id)
        {
          isFavoriteLocal = true;
          break;
        }
      }
      let newType = '';
      for (let i = 0; i < dataItem.type.length; i++)
      {
        if (i === 0)
        {
          newType = dataItem.type[i];
        }
        else
        {
          newType += ', ' + dataItem.type[i];
        }
      }
      const monsterItem =
      {
        id: dataItem.id,
        name: dataItem.name.english,
        image: dataItem.hires,
        type: newType,
        isFavorite: isFavoriteLocal
      }
      list.push(monsterItem);
      return list;
    }

    //// EVENT HANDLER
    
    const showClickHandler = () =>
    {
      doSetRandomMonstersArray([]);
      getRandomData();
    }

    //// START

    init();

    return { randomMonstersArray, showClickHandler };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
