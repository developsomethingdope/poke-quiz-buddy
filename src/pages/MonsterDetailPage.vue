<template>
  <div>
    <div class="page-top">
      <div class="links">
        <NavLinks link_type="ALL_LINK" />
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
    const partialUrl = 'https://app.pokemon-api.xyz/pokemon/';
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
        
        const detailUrl = partialUrl + monsterId;
        const response = await fetch(detailUrl);
        const dataJson = await response.json();
        var newMonster = {};
        if (detailType === 'FULL_DETAIL')
        {
          newMonster = parseDataToFullDetail(dataJson);
          monsterItem.value = newMonster;
        }
        else if (detailType === 'NEXT_FORM_DETAIL')
        {
          updateMonsterNextForm(monsterId, dataJson);
        }
        else
        {
          monsterItem.value.previousForm.name = dataJson.name.english;
        }
      }
      catch(error)
      {
        console.log('detail page: ', error);
      }
    }

    const updateMonsterNextForm = (monsterId, data) =>
    {
      for (let i = 0; i < monsterItem.value.nextFormArray.length; i++)
      {
        if (monsterItem.value.nextFormArray[i].id === monsterId)
        {
          if (data)
          {
            monsterItem.value.nextFormArray[i].name = data.name.english;
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
        for (const nextItemArray of data.evolution.next)
        {
          newNextFormArray.push({ id: nextItemArray[0], name: '' });
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
