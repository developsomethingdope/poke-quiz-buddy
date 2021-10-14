import { mount } from '@vue/test-utils';
import NavLinks from '@/components/NavLinks.vue';
import router from '@/shared/router';

describe('NavLinks.vue', () => {
  it('check if a specific link exists', async () => {
    //const link_type = 'NO_HOME_LINK';
    const link_type = 'NO_FAVORITE_LINK';
    const navLinksWrapper = mount(NavLinks, {
      global: {
        plugins: [router]
      },
      props: { link_type }
    });
    router.push('/');
    await router.isReady();

    const navLinkDiv = navLinksWrapper.find('.nav-links');
    //expect(navLinkDiv.text()).not.toMatch('Home');
    expect(navLinkDiv.text()).toMatch('Home');
  });
});
