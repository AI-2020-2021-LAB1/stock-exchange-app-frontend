import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import Register from '../../views/Register.vue';
import PasswordValidator from '../../components/PasswordValidator.vue';
import vuetify from 'vuetify';

describe('Register.vue', () => {
    let wrapper: Wrapper<any>;
    const localVue = createLocalVue();

    localVue.use(vuetify);

    test('should allow to change email', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const emailInput = wrapper.find('#email');
        emailInput.setValue('email@localhost.com');
        expect(wrapper.vm.email).toBe('email@localhost.com');
    });

    test('should display proper error messages for email', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const emailInput = wrapper.find('#email');
        emailInput.setValue('em');
        expect(wrapper.vm.rules.email(wrapper.vm.email)).toBe('Adres e-mail nie jest poprawny');
        emailInput.setValue('');
        expect(wrapper.vm.rules.required(wrapper.vm.login)).toBe('Pole wymagane');
    });

    test('should allow to change first name', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const firstNameInput = wrapper.find('#first_name');
        firstNameInput.setValue('name');
        expect(wrapper.vm.first_name).toBe('name');
    });

    test('should display proper error message for first name', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const firstNameInput = wrapper.find('#first_name');
        firstNameInput.setValue('name');
        firstNameInput.setValue('');
        expect(wrapper.vm.rules.required(wrapper.vm.first_name)).toBe('Pole wymagane');
    });

    test('should allow to change last name', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const lastNameInput = wrapper.find('#last_name');
        lastNameInput.setValue('lastname');
        expect(wrapper.vm.last_name).toBe('lastname');
    });

    test('should display proper error message for last name', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const lastNameInput = wrapper.find('#last_name');
        lastNameInput.setValue('name');
        lastNameInput.setValue('');
        expect(wrapper.vm.rules.required(wrapper.vm.last_name)).toBe('Pole wymagane');
    });

    test('should allow to change first password', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const firstPasswordInput = wrapper.find('#password1');
        firstPasswordInput.setValue('Blabla8!');
        expect(wrapper.vm.password1).toBe('Blabla8!');
    });

    test('should display proper error messages for first password', () => {
        localVue.component('password-validator', PasswordValidator);
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
            data() {
                return {
                    inputValidated: false,
                    email: '',
                    login: '',
                    first_name: '',
                    last_name: '',
                    password1: '',
                    password2: '',
                    showPass: false,
                    passwdFocus: true,
                    passwdValid: false,
                    rules: {
                        required: (value: string) => !!value || 'Pole wymagane',
                        identical: (value1: string, value2: string) =>
                            value1 === value2 || 'Hasła nie są identyczne',
                        counter: (value: string, num: number, end: string) =>
                            value.length >= num || 'Minimum ' + num + ' znak' + end,
                        email: (value: string) => {
                            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            return pattern.test(value) || 'Adres e-mail nie jest poprawny';
                        },
                    },
                };
            },
        });
        const firstPasswordInput = wrapper.find('#password1');

        wrapper.vm.$refs.passwordValidator.$emit('validation', wrapper.vm.$refs.passwordValidator.isPasswordValid);
        expect(wrapper.vm.passwdValid).toBe('Hasło nie spełnia wymagań');
        firstPasswordInput.setValue('');
        expect(wrapper.vm.rules.required(wrapper.vm.password1)).toBe('Pole wymagane');
    });

    test('should toggle show password option', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const appendIconButton = wrapper.find('[aria-label="append icon"]');
        appendIconButton.trigger('click');
        expect(wrapper.vm.showPass).toBe(true);
        appendIconButton.trigger('click');
        expect(wrapper.vm.showPass).toBe(false);
    });

    test('should allow to change second password', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const secondPasswordInput = wrapper.find('#password2');
        secondPasswordInput.setValue('Blabla8!');
        expect(wrapper.vm.password2).toBe('Blabla8!');
    });

    test('should display proper error messages for second password', () => {
        localVue.component('password-validator', PasswordValidator);
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });
        const firstPasswordInput = wrapper.find('#password1');
        const secondPasswordInput = wrapper.find('#password2');

        firstPasswordInput.setValue('Blabla');
        secondPasswordInput.setValue('Bla');
        expect(wrapper.vm.rules.identical(wrapper.vm.password1, wrapper.vm.password2)).toBe('Hasła nie są identyczne');
        secondPasswordInput.setValue('');
        expect(wrapper.vm.rules.required(wrapper.vm.password2)).toBe('Pole wymagane');
    });

    test('enable submit button', () => {
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
        });

        const emailInput = wrapper.find('#email');
        const firstNameInput = wrapper.find('#first_name');
        const lastNameInput = wrapper.find('#last_name');
        const firstPasswordInput = wrapper.find('#password1');
        const secondPasswordInput = wrapper.find('#password2');

        emailInput.setValue('email@localhost.com');
        firstNameInput.setValue('name');
        lastNameInput.setValue('lastname');
        firstPasswordInput.setValue('Blabla8!');
        secondPasswordInput.setValue('Blabla8!');

        expect(wrapper.vm.inputValidated).toBe(true);
    });

    test('should dispatch login action', async () => {
        const mockStore = { dispatch: jest.fn() };
        wrapper = mount(Register, {
            localVue,
            vuetify: new vuetify(),
            mocks: {
                $store: mockStore,
            },
            data() {
                return {
                    inputValidated: true,
                    email: 'email@localhost.com',
                    login: '',
                    first_name: 'name',
                    last_name: 'lastname',
                    password1: 'Blabla8!',
                    password2: 'Blabla8!',
                    showPass: false,
                    passwdFocus: false,
                    passwdValid: true,
                    rules: {
                        required: (value: string) => !!value || 'Pole wymagane',
                        identical: (value1: string, value2: string) =>
                            value1 === value2 || 'Hasła nie są identyczne',
                        counter: (value: string, num: number, end: string) =>
                            value.length >= num || 'Minimum ' + num + ' znak' + end,
                        email: (value: string) => {
                            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            return pattern.test(value) || 'Adres e-mail nie jest poprawny';
                        },
                    },
                };
            },
        });

        await wrapper.find('form').trigger('submit');

        expect(mockStore.dispatch).toHaveBeenCalledWith('register', {
            email: 'email@localhost.com',
            password: 'Blabla8!',
            firstName: 'name',
            lastName: 'lastname',
        });
    });
});
