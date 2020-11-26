import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import TraderStocksList from '../../components/TraderStocksList.vue';
import vuetify from 'vuetify';

describe('TraderStocksList.vue', () => {
    let wrapper: Wrapper<any>;
    const localVue = createLocalVue();
    const props = {
        stocks:
        {
            content: [
                {
                    id: 1,
                    name: 'Stock1',
                    currentPrice: 100
                },
                {
                    id: 2,
                    name: 'Stock2',
                    currentPrice: 200
                }
            ],
            totalPages: 1,
        },
    };

    localVue.use(vuetify);

    test('should allow to change input for search', () => {
        wrapper = mount(TraderStocksList, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        const searchInput = wrapper.find('#searchStocks');
        searchInput.setValue('abc');
        expect(wrapper.vm.search).toBe('abc');
    });

    test('should emit search', async () => {
        const searchChanged = jest.fn();
        wrapper = mount(TraderStocksList, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
            mocks: {
                searchChanged,
            },
            watch: {
                searchChanged
            }
        });

        const searchInput = wrapper.find('#searchStocks');
        await searchInput.setValue('abc');
        console.log(wrapper.vm.$data.search)

        expect(searchChanged).toBeCalledTimes(1);
        expect(searchChanged).toBeCalledWith('abc', '');
    });
});
