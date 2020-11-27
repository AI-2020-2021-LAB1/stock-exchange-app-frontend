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

    test('should allow to click pagination', async () => {
        wrapper = mount(TraderStocksList, {
            localVue,
            vuetify: new vuetify(),
            propsData: {
                stocks: [{ content: [{ key: 1, name: "asas", currentPrice: 12 }, { key: 2, name: "asas", currentPrice: 12 }, { key: 3, name: "asas", currentPrice: 12 }] }
                    , { totalPages: 12 }
                ],
                search: ""
            },
        });

        wrapper.vm.$emit('pagination', 1);

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().pagination).toBeTruthy();

    });


    test('should allow to click pagination', async () => {
        wrapper = mount(TraderStocksList, {
            localVue,
            vuetify: new vuetify(),
            propsData: {
                stocks: [{ content: [{ key: 1, name: "asas", currentPrice: 12 }, { key: 2, name: "asas", currentPrice: 12 }, { key: 3, name: "asas", currentPrice: 12 }] }
                    , { totalPages: 12 }
                ],
                search: ""
            },
        });

        wrapper.vm.$emit('pagination', 1);

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().pagination).toBeTruthy();

    });

})