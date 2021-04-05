<template>
  <div>
    <Loading v-if="list_prop.length < 1" />
    <div v-else class="section-list">
      <MonsterItem v-for="(monster, index) in list_prop" :key="index" :item_prop="monster" />
    </div>
  </div>
</template>

<script>
import MonsterItem from "./MonsterItem";
import Loading from "./Loading";

export default {
  name: 'MonsterList',
  components:
  {
    MonsterItem,
    Loading
  },
  props: ['list_prop']
}
</script>
