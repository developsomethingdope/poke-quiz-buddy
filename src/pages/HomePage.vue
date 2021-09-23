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
    //const randomUrl = 'https://app.pokemon-api.xyz/pokemon/random'; //// old api
    const totalUrl = 'https://pokeapi.co/api/v2/pokedex/national/';
    const partialRandomUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const store = useStore();
    const numOfRandomMonsters = store.state.monsterStore.numOfRandomMonsters;
    const randomMonstersArray = computed(() => store.state.monsterStore.randomMonstersArray);
    const doSetTotalNumOfMonsters = (totalNum) => { store.dispatch('doSetTotalNumOfMonsters', totalNum); };
    const doSetRandomMonstersArray = (monstersArray) => store.dispatch('doSetRandomMonstersArray', monstersArray);
    const doSetIsLinkToDetail = (isLinkToDetail) => store.dispatch('doSetIsLinkToDetail', isLinkToDetail);
    
    //// FUNCTIONS

    const init = () =>
    {
      const totalNumMonsters = store.state.monsterStore.totalNumOfMonsters;
      if (totalNumMonsters === 0)
      {
        getTotalNumData();
      }

      if (totalNumMonsters > 0 && randomMonstersArray.value.length < 1)
      {
        getRandomData();
      }
      doSetIsLinkToDetail(true);
    }

    const getTotalNumData = async () =>
    {
      try
      {
        const response = await fetch(totalUrl);
        const dataJson = await response.json();
        doSetTotalNumOfMonsters(dataJson.pokemon_entries.length);
        getRandomData();
      }
      catch(error)
      {
        console.log('home page: ', error);
      }
    }

    const getRandomData = async () =>
    {
      try
      {
        var newMonstersArray = [];
        var idsObject = {};
        const totalNumMonsters = store.state.monsterStore.totalNumOfMonsters;
        
        for (let i = 0; i < numOfRandomMonsters; i++)
        {
          let idLocal = '';
          var dataJson = null;
          do
          {
            const randomId = Math.floor(Math.random() * totalNumMonsters) + 1;
            const randomUrl = partialRandomUrl + randomId + '/';
            const response = await fetch(randomUrl);
            dataJson = await response.json();
            idLocal = dataJson.id;
          } while (idsObject[idLocal]);
          idsObject[idLocal] = true;
          const newData = simplifyData(dataJson);
          newMonstersArray = addDataToList(newData, newMonstersArray);
          //console.log('home: ', idsObject);
        }
        doSetRandomMonstersArray(newMonstersArray);
      }
      catch(error)
      {
        console.log('home page: ', error);
      }
    }

    const simplifyData = (data) =>
    {
      var newTypeArray = [];
      //const imageUrl = data.sprites.front_default; //// backup image link
      const imageUrl = 'https://img.pokemondb.net/artwork/large/' + data.name + '.jpg';
      for (let i = 0; i < data.types.length; i++)
      {
        newTypeArray[i] = data.types[i].type.name;
      }
      const newDataObject = 
      {
        id: data.id,
        name: {
          english: capitalizeWord(data.name)
        },
        hires: imageUrl,
        type: newTypeArray
      };
      return newDataObject;
    }

    const capitalizeWord = (word) =>
    {
      let newWord = word.substr(0,1).toUpperCase() + word.substr(1);
      return newWord;
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
