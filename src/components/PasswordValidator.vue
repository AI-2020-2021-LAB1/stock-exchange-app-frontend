<template>
  <div>
    <p class="text-body-1 text-center font-weight-bold mb-0">Wymagania dotyczące hasła</p>
    <v-alert prominent outlined :type="isPasswordValid === true ? 'success' : 'error'">
      <v-row class="ma-0 pa-0" align="center">
        <v-icon
          left
          :color="passwdHas8Chars ? 'success' : 'error'"
        >{{ passwdHas8Chars ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
        <span class="my-0 black--text">8 znaków</span>
      </v-row>
      <v-row class="ma-0 pa-0" align="center">
        <v-icon
          left
          :color="passwdHasLowercase ? 'success' : 'error'"
        >{{ passwdHasLowercase ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
        <span class="my-0 black--text">Jedna mała litera</span>
      </v-row>
      <v-row class="ma-0 pa-0" align="center">
        <v-icon
          left
          :color="passwdHasUppercase ? 'success' : 'error'"
        >{{ passwdHasUppercase ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
        <span class="my-0 black--text">Jedna duża litera</span>
      </v-row>
      <v-row class="ma-0 pa-0" align="center">
        <v-icon
          left
          :color="passwdHasNumber ? 'success' : 'error'"
        >{{ passwdHasNumber ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
        <span class="my-0 black--text">Jedna cyfra</span>
      </v-row>
      <v-row class="ma-0 pa-0" align="center">
        <v-icon
          left
          :color="passwdHasSpecialChar ? 'success' : 'error'"
        >{{ passwdHasSpecialChar ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
        <span class="my-0 black--text">Jeden znak specjalny</span>
      </v-row>
    </v-alert>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class PasswordValidator extends Vue {
  @Prop() private readonly password!: string;

  private data() {
    return {
      passwdHas8Chars: false,
      passwdHasUppercase: false,
      passwdHasLowercase: false,
      passwdHasNumber: false,
      passwdHasSpecialChar: false,
    };
  }

  @Watch('password')
  private passwdChanged(newPass: string) {
    const special = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    newPass.length >= 8
      ? (this.$data.passwdHas8Chars = true)
      : (this.$data.passwdHas8Chars = false);
    /[a-z]/.test(newPass)
      ? (this.$data.passwdHasLowercase = true)
      : (this.$data.passwdHasLowercase = false);
    /[A-Z]/.test(newPass)
      ? (this.$data.passwdHasUppercase = true)
      : (this.$data.passwdHasUppercase = false);
    /\d/.test(newPass)
      ? (this.$data.passwdHasNumber = true)
      : (this.$data.passwdHasNumber = false);
    special.test(newPass)
      ? (this.$data.passwdHasSpecialChar = true)
      : (this.$data.passwdHasSpecialChar = false);

    this.$emit('validation', this.isPasswordValid);
  }

  get isPasswordValid() {
    return (
      (this.$data.passwdHas8Chars &&
        this.$data.passwdHasUppercase &&
        this.$data.passwdHasLowercase &&
        this.$data.passwdHasNumber &&
        this.$data.passwdHasSpecialChar) ||
      'Hasło nie spełnia wymagań'
    );
  }
}
</script>