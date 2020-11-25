import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import TraderStocksList from '../../components/TraderStocksList.vue';
import vuetify from 'vuetify';

describe('TraderStocksList.vue', () => {
    let wrapper: Wrapper<any>;
    const localVue = createLocalVue();

    localVue.use(vuetify);

    test('should allow to change input for search', () => {
        wrapper = mount(TraderStocksList, {
            localVue,
            vuetify: new vuetify(),
            propsData: {
                stocks: [],
                search: ""
            },
        });

        wrapper.setProps({ search: 'abc' });
        expect(wrapper.vm.Search).toBe('abc');
    });

})