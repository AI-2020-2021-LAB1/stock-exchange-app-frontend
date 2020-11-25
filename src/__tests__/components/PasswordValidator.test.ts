import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import PasswordValidator from '../../components/PasswordValidator.vue';
import vuetify from 'vuetify';

describe('PasswordValidator.vue', () => {
  let wrapper: Wrapper<any>;
  const localVue = createLocalVue();

  localVue.use(vuetify);

  test('should show nothing is validated', () => {
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
    });

    expect(wrapper.vm.passwdHas8Chars).toBe(false);
    expect(wrapper.vm.passwdHasUppercase).toBe(false);
    expect(wrapper.vm.passwdHasLowercase).toBe(false);
    expect(wrapper.vm.passwdHasNumber).toBe(false);
    expect(wrapper.vm.passwdHasSpecialChar).toBe(false);
  });

  test('should show uppercase is validated', async () => {
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
    });
    wrapper.setProps({ password: 'B' });

    await localVue.nextTick();

    expect(wrapper.vm.passwdHas8Chars).toBe(false);
    expect(wrapper.vm.passwdHasUppercase).toBe(true);
    expect(wrapper.vm.passwdHasLowercase).toBe(false);
    expect(wrapper.vm.passwdHasNumber).toBe(false);
    expect(wrapper.vm.passwdHasSpecialChar).toBe(false);
  });

  test('should show uppercase & lowercase are validated', async () => {
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
    });
    wrapper.setProps({ password: 'Bl' });

    await localVue.nextTick();

    expect(wrapper.vm.passwdHas8Chars).toBe(false);
    expect(wrapper.vm.passwdHasUppercase).toBe(true);
    expect(wrapper.vm.passwdHasLowercase).toBe(true);
    expect(wrapper.vm.passwdHasNumber).toBe(false);
    expect(wrapper.vm.passwdHasSpecialChar).toBe(false);
  });

  test('should show uppercase & lowercase & number are validated', async () => {
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
    });
    wrapper.setProps({ password: 'Blabl8' });

    await localVue.nextTick();

    expect(wrapper.vm.passwdHas8Chars).toBe(false);
    expect(wrapper.vm.passwdHasUppercase).toBe(true);
    expect(wrapper.vm.passwdHasLowercase).toBe(true);
    expect(wrapper.vm.passwdHasNumber).toBe(true);
    expect(wrapper.vm.passwdHasSpecialChar).toBe(false);
  });

  test('should show uppercase & lowercase & number & special are validated', async () => {
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
    });
    wrapper.setProps({ password: 'Blabl8!' });

    await localVue.nextTick();

    expect(wrapper.vm.passwdHas8Chars).toBe(false);
    expect(wrapper.vm.passwdHasUppercase).toBe(true);
    expect(wrapper.vm.passwdHasLowercase).toBe(true);
    expect(wrapper.vm.passwdHasNumber).toBe(true);
    expect(wrapper.vm.passwdHasSpecialChar).toBe(true);
  });

  test('should show everything is validated', async () => {
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
    });
    wrapper.setProps({ password: 'Blabl8!a' });

    await localVue.nextTick();

    expect(wrapper.vm.passwdHas8Chars).toBe(true);
    expect(wrapper.vm.passwdHasUppercase).toBe(true);
    expect(wrapper.vm.passwdHasLowercase).toBe(true);
    expect(wrapper.vm.passwdHasNumber).toBe(true);
    expect(wrapper.vm.passwdHasSpecialChar).toBe(true);
  });

  test('should emit error if nothing is validated', async () => {
    const $emit = jest.fn();
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
      mocks: {
        $emit
      }
    });
    wrapper.setProps({ password: 'B' });

    await localVue.nextTick();

    wrapper.setProps({ password: '' });

    await localVue.nextTick();

    expect($emit).not.toBeCalledWith('validation', true);
  });

  test('should emit error when uppercase is validated', async () => {
    const $emit = jest.fn();
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
      mocks: {
        $emit
      }
    });
    wrapper.setProps({ password: 'B' });

    await localVue.nextTick();

    expect($emit).not.toBeCalledWith('validation', true);
  });

  test('should emit error when uppercase & lowercase are validated', async () => {
    const $emit = jest.fn();
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
      mocks: {
        $emit
      }
    });
    wrapper.setProps({ password: 'Bl' });

    await localVue.nextTick();

    expect($emit).not.toBeCalledWith('validation', true);
  });

  test('should emit error when uppercase & lowercase & number are validated', async () => {
    const $emit = jest.fn();
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
      mocks: {
        $emit
      }
    });
    wrapper.setProps({ password: 'Blabl8' });

    await localVue.nextTick();

    expect($emit).not.toBeCalledWith('validation', true);
  });

  test('should emit error when uppercase & lowercase & number & special are validated', async () => {
    const $emit = jest.fn();
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
      mocks: {
        $emit
      }
    });
    wrapper.setProps({ password: 'Blabl8!' });

    await localVue.nextTick();

    expect($emit).not.toBeCalledWith('validation', true);
  });

  test('should emit true when everything is validated', async () => {
    const $emit = jest.fn();
    wrapper = mount(PasswordValidator, {
      localVue,
      vuetify: new vuetify(),
      propsData: {
        password: '',
      },
      mocks: {
        $emit
      }
    });
    wrapper.setProps({ password: 'Blabl8!a' });

    await localVue.nextTick();

    expect($emit).not.toBeCalledWith('validation', 'Hasło nie spełnia wymagań');
  });
});
