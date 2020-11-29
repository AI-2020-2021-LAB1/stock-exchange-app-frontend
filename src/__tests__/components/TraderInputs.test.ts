import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import TraderInputs from '../../components/TraderInputs.vue';
import vuetify from 'vuetify';

describe('TraderInputs.vue', () => {
    let wrapper: Wrapper<any>;
    const localVue = createLocalVue();
    const props = {
        selectedStock: {
            stockInfo: {
                id: 20,
                name: "xtYOkPuhDzhibSlg0w7G3",
                abbreviation: "xtY",
                currentPrice: 3416.24,
                amount: 934,
                priceChangeRatio: 0,
                tag: "DEFAULT",
            },
            userPossession: {
                id: 38,
                name: "MpOvm5lUZ6LQYeNQqQ1er",
                abbreviation: "MpO",
                amount: 11,
                amountAvailableForSale: 11,
                currentPrice: 11,
            },
        }
    };
    const data = {
        buyAmount: 3,
        buyDate: "2020-11-28",
        buyDatePicker: false,
        buyPrice: 2,
        buyTime: "21:04",
        buyTimePicker: false,
        buyType: "LESS_OR_EQUAL",
        buyTypeLabels: [
            {
                text: "Cena maksymalna",
                value: "LESS_OR_EQUAL"
            },
            {
                text: "Stała cena",
                value: "EQUAL",
            },
        ],
        text: "Stała cena",
        value: "EQUAL",
        sellAmount: 3,
        sellDate: "2020-11-28",
        sellDatePicker: false,
        sellPrice: 3,
        sellTime: "21:04",
        sellTimePicker: false,
        sellType: "EQUAL",
        sellTypeLabels: [
            {
                text: "Cena minimalna",
                value: "GREATER_OR_EQUAL"
            },
            {
                text: "Stała cena",
                value: "EQUAL"
            },
        ],
        stock: {
            stockInfo: {
                id: 20,
                name: "xtYOkPuhDzhibSlg0w7G3",
                abbreviation: "xtY",
                currentPrice: 3416.24,
                amount: 934,
                priceChangeRatio: 0,
                tag: "DEFAULT",
            },
            userPossession: {
                id: 38,
                name: "MpOvm5lUZ6LQYeNQqQ1er",
                abbreviation: "MpO",
                amount: 11,
                amountAvailableForSale: 11,
                currentPrice: 11,
            }
        },
    };

    localVue.use(vuetify);

    test('should allow to change buy price', () => {
        wrapper = mount(TraderInputs, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        const buyPriceInput = wrapper.find('#buyPrice');
        buyPriceInput.setValue(2);
        expect(wrapper.vm.buyPrice).toBe(2);
    });

    test('should allow to change buy amount', () => {
        wrapper = mount(TraderInputs, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        const buyAmountInput = wrapper.find('#buyAmount');
        buyAmountInput.setValue(3);
        expect(wrapper.vm.buyAmount).toBe(3);
    });

    test('should calculate buy value', () => {
        wrapper = mount(TraderInputs, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        const buyPriceInput = wrapper.find('#buyPrice');
        buyPriceInput.setValue(2);
        const buyAmountInput = wrapper.find('#buyAmount');
        buyAmountInput.setValue(3);
        expect(wrapper.vm.buyValue).toBe(6);
    });

    test('should allow to change sell price', () => {
        wrapper = mount(TraderInputs, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        const sellPriceInput = wrapper.find('#sellPrice');
        sellPriceInput.setValue(2);
        expect(wrapper.vm.sellPrice).toBe(2);
    });

    test('should allow to change sell amount', () => {
        wrapper = mount(TraderInputs, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        const sellAmountInput = wrapper.find('#sellAmount');
        sellAmountInput.setValue(3);
        expect(wrapper.vm.sellAmount).toBe(3);
    });

    test('should calculate sell value', () => {
        wrapper = mount(TraderInputs, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        const sellPriceInput = wrapper.find('#sellPrice');
        sellPriceInput.setValue(2);
        const sellAmountInput = wrapper.find('#sellAmount');
        sellAmountInput.setValue(3);
        expect(wrapper.vm.sellValue).toBe(6);
    });

    test('should enable buy button', () => {
        wrapper = mount(TraderInputs, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        wrapper.setData(data)
        
        expect(wrapper.vm.buyValue <= 0 || wrapper.vm.buyType === 0).toBe(false);
    });

    test('should enable sell button', () => {
        wrapper = mount(TraderInputs, {
            localVue,
            vuetify: new vuetify(),
            propsData: props,
        });

        wrapper.setData(data)
        
        expect(wrapper.vm.sellValue <= 0 || wrapper.vm.sellType === 0).toBe(false);
    });

    // test('should enable buy button', async () => {
    //     const buy = jest.fn();
    //     const placeOrder = jest.fn();
    //     wrapper = mount(TraderInputs, {
    //         localVue,
    //         vuetify: new vuetify(),
    //         propsData: props,
    //         mocks: {
    //             buy,
    //             placeOrder
    //         }
    //     });

    //     wrapper.setData(data);
        
    //     const buyBtn = wrapper.find('#buyBtn');

    //     await buyBtn.trigger('click');
    //     console.log(wrapper.emitted())

    //     expect(buy).toHaveBeenCalled();
    // });
});
