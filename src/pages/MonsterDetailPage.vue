<template>
  <div>
    <div class="page-top">
      <div class="links">
        <NavLinks link_type="ALL_LINKS" />
      </div>
      <div class="title">monster detail</div>
    </div>
    <Loading v-if="!monsterItem.id" />
    <div v-else class="page-bottom section-detail">
      <div class="section-detail-content">
        <MonsterItem :item_prop="monsterItem" :key="monsterItem.id" />
        <div class="content-info">
          <div class="info-area">
            <div class="info-label label-type">Type:</div>
            <div class="info-text text-type">{{ monsterItem.type }}</div>
          </div>
          <div class="info-area">
            <div class="info-label label-measurements">Measurements:</div>
            <div class="info-text text-measurements">Height: {{ monsterItem.height }} &nbsp;&nbsp; | &nbsp;&nbsp; Weight: {{ monsterItem.weight }}</div>
          </div>
          <div class="info-area">
            <div class="info-label label-description">Description:</div>
            <div class="info-text text-description">{{ monsterItem.description }}</div>
          </div>
          <div v-if="monsterItem.nextFormArray.length > 0" class="info-area">
            <div class="info-label label-evolves-into">Evolves Into:</div>
            <div class="info-text text-evolves-into">
              <div class="evolves-into-link" v-for="(nextItem, index) in monsterItem.nextFormArray" :key="index">
                <span v-if="!nextItem.name" @click="nextFormClickHandler(nextItem.id)" class="evolves-into-link-click">???</span>
                <span v-else-if="nextItem.name === 'DATA_NOT_AVAILABLE'">{{ nextItem.name }}</span>
                <router-link v-else :to="{ name: 'MonsterDetailPage', params: {url_id: nextItem.id} }">{{ nextItem.name }}</router-link>
              </div>
            </div>
          </div>
          <div v-if="monsterItem.previousForm.id" class="info-area">
            <div class="info-label label-evolves-from">Evolves From:</div>
            <div class="info-text text-evolves-from">
              <div class="evolves-from-link">
                <span v-if="!monsterItem.previousForm.name" @click="previousFormClickHandler(monsterItem.previousForm.id)" class="evolves-from-link-click">???</span>
                <router-link v-else :to="{ name: 'MonsterDetailPage', params: {url_id: monsterItem.previousForm.id} }">{{ monsterItem.previousForm.name }}</router-link>
              </div>
            </div>
          </div>
        </div> <!-- end content-info -->
      </div>
      <BackToTop />
    </div> <!-- end page-bottom -->
  </div>
</template>

<script>
import NavLinks from "../components/NavLinks";
import { ref, computed, watch } from 'vue';
import Loading from "../components/Loading";
import { useStore } from 'vuex';
import MonsterItem from "../components/MonsterItem";
import BackToTop from "../components/BackToTop";
import { useRoute } from 'vue-router';

export default {
  name: 'MonsterDetailPage',
  components: 
  {
    NavLinks,
    Loading,
    MonsterItem,
    BackToTop
  },
  props: ['url_id'],
  setup(props)
  {
    //console.log('detail: ');
    //const partialUrl = 'https://app.pokemon-api.xyz/pokemon/'; //// old api
    const partialUrl = 'https://pokeapi.co/api/v2/';
    const store = useStore();
    const monsterItem = ref({});
    const doSetIsLinkToDetail = (isLinkToDetail) => store.dispatch('doSetIsLinkToDetail', isLinkToDetail);
    const route = useRoute();
    const urlId = computed(() => route.params.url_id);

    //// FUNCTIONS

    const init = () =>
    {
      getDetailData(props.url_id, 'FULL_DETAIL');
      doSetIsLinkToDetail(false);
    }

    //// detailType: FULL_DETAIL, NEXT_FORM_DETAIL, PREVIOUS_FORM_DETAIL
    const getDetailData = async (monsterId, detailType) =>
    {
      try
      {
        //// same as loading
        if (detailType === 'NEXT_FORM_DETAIL')
        {
          updateMonsterNextForm(monsterId, null);
        }

        const detailUrl1 = partialUrl + 'pokemon/' + monsterId + '/';
        const response1 = await fetch(detailUrl1);
        const dataJson1 = await response1.json();
        //console.log('detail1: ', dataJson1);
        
        if (detailType === 'FULL_DETAIL')
        {
          //const detailUrl2 = partialUrl + 'pokemon-species/' + monsterId + '/';
          const detailUrl2 = dataJson1.species.url;
          const response2 = await fetch(detailUrl2);
          const dataJson2 = await response2.json();
          
          var evolutionArray = [];
          const maxEvolutionChainNum = 3;
          evolutionArray.push(dataJson2.name);
          if (dataJson2.evolves_from_species)
          {
            let detailUrl3 = '';
            var dataJson3 = null;
            for (let i = 0; i < maxEvolutionChainNum - 1; i++)
            {
              if (i === 0)
              {
                detailUrl3 = dataJson2.evolves_from_species.url;
              }
              else
              {
                detailUrl3 = dataJson3.evolves_from_species.url;
              }
              const response3 = await fetch(detailUrl3);
              dataJson3 = await response3.json();
              evolutionArray.push(dataJson3.name);
              if (!dataJson3.evolves_from_species)
              {
                break;
              }
            }
          }
          evolutionArray.reverse();
          //console.log('detail evoArray: ', evolutionArray);

          var dataJson4 = null;
          if (evolutionArray.length < maxEvolutionChainNum)
          {
            const detailUrl4 = dataJson2.evolution_chain.url;
            const response4 = await fetch(detailUrl4);
            dataJson4 = await response4.json();
          }
          
          const newData = simplifyData(dataJson1, dataJson2, dataJson4, evolutionArray);
          //console.log('detail newData: ', newData);
          var newMonster = parseDataToFullDetail(newData);
          monsterItem.value = newMonster;
        }
        else if (detailType === 'NEXT_FORM_DETAIL')
        {
          updateMonsterNextForm(monsterId, dataJson1);
        }
        else
        {
          monsterItem.value.previousForm.name = capitalizeWord(dataJson1.name);
        }
      }
      catch(error)
      {
        console.log('detail page: ', error);
      }
    }

    const simplifyData = (data1, data2, data4, evolutionArray) =>
    {
      //const imageUrl = data1.sprites.front_default; //// backup image link
      const imageUrl = 'https://img.pokemondb.net/artwork/large/' + data1.name + '.jpg';
      var newTypeArray = [];
      for (let i = 0; i < data1.types.length; i++)
      {
        newTypeArray[i] = data1.types[i].type.name;
      }
      const newHeightInMeters = data1.height / 10;
      const heightString = newHeightInMeters + ' m';
      const newWeightInKg = data1.weight / 10;
      const weightString = newWeightInKg + ' kg';
      let flavorTextString = '';
      const flavorTextArray = data2.flavor_text_entries;
      for (const flavorTextItem of flavorTextArray)
      {
        if (flavorTextItem.language.name === "en")
        {
          flavorTextString = flavorTextItem.flavor_text;
          break;
        }
      }
      var evolveFromIdArray = null;
      if (data2.evolves_from_species)
      {
        const evolveFromUrl = data2.evolves_from_species.url;
        evolveFromIdArray = [extractIdFromUrl(evolveFromUrl)];
      }
      var evolveToIdArray = null;
      if (evolutionArray.length === 1 && data4.chain.evolves_to.length > 0)
      {
        evolveToIdArray = [];
        const firstFormEvolvesToArray = data4.chain.evolves_to;
        for (const firstFormEvolvesToItem of firstFormEvolvesToArray)
        {
          const firstFormEvolvesToItemUrl = firstFormEvolvesToItem.species.url;
          evolveToIdArray.push(extractIdFromUrl(firstFormEvolvesToItemUrl));
        }
      }
      else if (evolutionArray.length === 2)
      {
        const firstFormEvolvesToArray = data4.chain.evolves_to;
        for (const firstFormEvolvesToItem of firstFormEvolvesToArray)
        {
          if (firstFormEvolvesToItem.species.name === evolutionArray[1])
          {
            if (firstFormEvolvesToItem.evolves_to.length > 0)
            {
              evolveToIdArray = [];
              const secondFormEvolvesToArray = firstFormEvolvesToItem.evolves_to;
              for (const secondFormEvolvesToItem of secondFormEvolvesToArray)
              {
                const secondFormEvolvesToItemUrl = secondFormEvolvesToItem.species.url;
                evolveToIdArray.push(extractIdFromUrl(secondFormEvolvesToItemUrl));
              }
            }
            break;
          }
        }
      }
      
      const newDataObject = 
      {
        id: data1.id,
        name: {
          english: capitalizeWord(data1.name)
        },
        hires: imageUrl,
        description: flavorTextString,
        profile: {
          height: heightString,
          weight: weightString
        },
        evolution: {
          prev: evolveFromIdArray,
          next: evolveToIdArray
        },
        type: newTypeArray
      };
      return newDataObject;
    }

    const extractIdFromUrl = (url) =>
    {
      const urlArray = url.split("/");
      const id = parseInt(urlArray[urlArray.length - 2]);
      return id;
    }
    
    const capitalizeWord = (word) =>
    {
      let newWord = word.substr(0,1).toUpperCase() + word.substr(1);
      return newWord;
    }

    const updateMonsterNextForm = (monsterId, data) =>
    {
      for (let i = 0; i < monsterItem.value.nextFormArray.length; i++)
      {
        if (monsterItem.value.nextFormArray[i].id === monsterId)
        {
          if (data)
          {
            monsterItem.value.nextFormArray[i].name = capitalizeWord(data.name);
          }
          else
          {
            monsterItem.value.nextFormArray[i].name = 'DATA_NOT_AVAILABLE';
          }
          break;
        }
      }
    }
    
    const parseDataToFullDetail = (data) =>
    {
      let isFavoriteLocal = false;
      const favoriteIdsArrayLocal = [...store.state.monsterStore.favoriteIdsArray];
      for (const idItem of favoriteIdsArrayLocal)
      {
        if (idItem === data.id)
        {
          isFavoriteLocal = true;
          break;
        }
      }
      var newPreviousForm = {};
      var newNextFormArray = [];
      if (data.evolution.prev)
      {
        newPreviousForm = { id: data.evolution.prev[0], name: '' };
      }
      if (data.evolution.next)
      {
        for (const nextItemId of data.evolution.next)
        {
          newNextFormArray.push({ id: nextItemId, name: '' });
        }
      }
      let newType = '';
      for (let i = 0; i < data.type.length; i++)
      {
        if (i === 0)
        {
          newType = data.type[i];
        }
        else
        {
          newType += ', ' + data.type[i];
        }
      }

      const newMonster =
      {
        id: data.id,
        name: data.name.english,
        image: data.hires,
        description: data.description,
        height: data.profile.height,
        weight: data.profile.weight,
        previousForm: newPreviousForm,
        nextFormArray: newNextFormArray,
        type: newType,
        isFavorite: isFavoriteLocal
      }
      return newMonster;
    }

    watch(urlId, () =>
    {
      //console.log('detail: watch: ', urlId.value);
      if (urlId.value)
      {
        getDetailData(urlId.value, 'FULL_DETAIL');
      }
    });
    
    //// EVENT HANDLER
    
    const nextFormClickHandler = (monsterId) =>
    {
      getDetailData(monsterId, 'NEXT_FORM_DETAIL');
    }

    const previousFormClickHandler = (monsterId) =>
    {
      getDetailData(monsterId, 'PREVIOUS_FORM_DETAIL');
    }

    //// START

    init();
    
    return { monsterItem, nextFormClickHandler, previousFormClickHandler };
  }
}
</script>
