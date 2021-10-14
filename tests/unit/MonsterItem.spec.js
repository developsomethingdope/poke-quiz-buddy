import { mount } from '@vue/test-utils';
import MonsterItem from '@/components/MonsterItem.vue';
import router from '@/shared/router';
import store from '@/shared/store';

describe('MonsterItem.vue', () => {
  it('set monster to favorite', async () => {
    const monsterItemWrapper = mount(MonsterItem, {
      global: {
        plugins: [
          router,
          store
        ]
      },
      props: {
        item_prop: {
          id: 2,
          name: 'someName2',
          image: '',
          isFavorite: false
        }
      }
    });
    router.push('/');
    await router.isReady();

    const checkboxInput = monsterItemWrapper.get('input');
    await checkboxInput.trigger('click');

    //const sectionItemDiv = monsterItemWrapper.find('.section-item');
    //expect(sectionItemDiv.html()).toMatch('abc1');

    const sectionItemDiv = monsterItemWrapper.find('.section-item-favorite');
    expect(sectionItemDiv.exists()).toBe(true);
  });

  it('set monster to not favorite', async () => {
    const monsterItemWrapper = mount(MonsterItem, {
      global: {
        plugins: [
          router,
          store
        ]
      },
      props: {
        item_prop: {
          id: 3,
          name: 'someName3',
          image: '',
          isFavorite: true
        }
      }
    });
    router.push('/');
    await router.isReady();

    const checkboxInput = monsterItemWrapper.get('input');
    await checkboxInput.trigger('click');

    const sectionItemDiv = monsterItemWrapper.find('.section-item-favorite');
    expect(sectionItemDiv.exists()).toBe(false);
  });
});
