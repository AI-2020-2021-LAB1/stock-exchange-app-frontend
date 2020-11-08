import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import Login from '../../views/Login.vue';
import vuetify from 'vuetify';

describe('Login.vue', () => {
    let wrapper: Wrapper<any>;
    const localVue = createLocalVue();

    localVue.use(vuetify);

    test('should allow to change email', () => {
        wrapper = mount(Login, {
            localVue,
            vuetify: new vuetify(),
        });

        const emailInput = wrapper.find('#email');
        emailInput.setValue('email@localhost.com');
        expect(wrapper.vm.login).toBe('email@localhost.com');
    });

    test('should display proper error messages for email', () => {
        wrapper = mount(Login, {
            localVue,
            vuetify: new vuetify(),
        });

        const emailInput = wrapper.find('#email');
        emailInput.setValue('em');
        expect(wrapper.vm.rules.counter(wrapper.vm.login, 3, 'i')).toBe('Minimum 3 znaki');
        emailInput.setValue('');
        expect(wrapper.vm.rules.required(wrapper.vm.login)).toBe('Pole wymagane');
    });

    test('should allow to change password', () => {
        wrapper = mount(Login, {
            localVue,
            vuetify: new vuetify(),
        });

        const passwordInput = wrapper.find('#password');
        passwordInput.setValue('password');
        expect(wrapper.vm.password).toBe('password');
    });

    test('should display proper error messages for password', () => {
        wrapper = mount(Login, {
            localVue,
            vuetify: new vuetify(),
        });

        const passwordInput = wrapper.find('#password');
        passwordInput.setValue('pass');
        expect(wrapper.vm.rules.counter(wrapper.vm.password, 8, 'ów')).toBe('Minimum 8 znaków');
        passwordInput.setValue('');
        expect(wrapper.vm.rules.required(wrapper.vm.password)).toBe('Pole wymagane');
    });

    test('should toggle show password option', () => {
        wrapper = mount(Login, {
            localVue,
            vuetify: new vuetify(),
        });

        const appendIconButton = wrapper.find('[aria-label="append icon"]');
        appendIconButton.trigger('click');
        expect(wrapper.vm.showPass).toBe(true);
        appendIconButton.trigger('click');
        expect(wrapper.vm.showPass).toBe(false);
    });

    test('enable submit button', () => {
        wrapper = mount(Login, {
            localVue,
            vuetify: new vuetify(),
        });

        const emailInput = wrapper.find('#email');
        emailInput.setValue('email@localhost.com');
        const passwordInput = wrapper.find('#password');
        passwordInput.setValue('password');
        expect(wrapper.vm.inputValidated).toBe(true);
    });

    test('should dispatch login action', async () => {
        const mockStore = { dispatch: jest.fn() };
        wrapper = mount(Login, {
            localVue,
            vuetify: new vuetify(),
            mocks: {
                $store: mockStore,
            },
            data() {
                return {
                    inputValidated: true,
                    login: 'email@localhost.com',
                    password: 'password',
                    showPass: false,
                    rules: {
                        required: (value: string) => !!value || 'Pole wymagane',
                        counter: (value: string, num: number, end: string) =>
                            value.length >= num || 'Minimum ' + num + ' znak' + end,
                    },
                };
            },
        });

        await wrapper.find('form').trigger('submit');

        expect(mockStore.dispatch).toHaveBeenCalledWith('login', {
            login: 'email@localhost.com',
            password: 'password',
        });
    });
});
