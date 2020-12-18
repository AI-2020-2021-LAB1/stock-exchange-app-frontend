<template>
  <div>
    <v-row class="mx-1 my-2" justify="center">
      <v-col class="pa-0" cols="12" md="10" lg="8" xl="6">
        <v-expansion-panels dark>
          <v-expansion-panel class="warning">
            <v-expansion-panel-header class="text-h6 font-weight-bold pa-4"
              >Instrukcja obsługi edytora</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <p>
                <b>
                  Konfiguracja oparta jest o logikę drzewa decyzyjnego co
                  oznacza, iż algorytm obciążnika dokonuje kolejnych wyborów
                  symulujących działania użytkownika. Wartości poszczególnych
                  ustawień o tym samym kolorze reprezentują opcje dostępne w
                  ramach konkretnego wyboru. Suma wartości procentowych o tym
                  samym kolorze musi być równa 100%.
                </b>
              </p>
              <ul>
                <li>
                  Pierwsze cztery wartości reprezentują opcje możliwe do
                  podjęcia przez użytkownika (w tym przypadku symulowanego przez
                  obciążnik) po zalogowaniu. Są to kolejno: sprawdzenie listy
                  dostępnych akcji, sprawdzenie listy posiadanych akcji,
                  sprawdzenie aktualnych zleceń lub przejście bezpośrednio do
                  utworzenia zlecenia. Opcje z tej grupy oznaczone są kolorem
                  żółtym.
                </li>
                <li>
                  Kolejne dwie wartości oznaczają opcje, które użytkownik może
                  podjąć po sprawdzeniu listy wszystkich dostępnych aukcji. Są
                  to: utworzenie zlecenia lub powrót do strony głównej.
                  Oznaczone są kolorem zielonym.
                </li>
                <li>
                  Kolejne dwie wartości dotyczą działań, które symulowany
                  użytkownik może podjąć po sprawdzeniu listy posiadanych akcji.
                  Ponownie są to: utworzenie zlecenia lub powrót do strony
                  głównej. Oznaczone są kolorem niebieskim.
                </li>
                <li>
                  Kolejne trzy wartości dotyczą opcji dostępnych po sprawdzeniu
                  aktualnych zleceń. W tym przypadku obciążnik może utworzyć
                  nowe zlecenie, usunąć jedno z już istniejących lub wrócić do
                  strony głównej. Oznaczone są kolorem brązowym.
                </li>
                <li>
                  Ostatnie dwa parametry dotyczą sytuacji w której symulowany
                  użytkownik zdecyduje się na utworzenie zlecenia. Dostępne są
                  tu dwie opcje: zlecenie kupna oraz zlecenie sprzedaży.
                  Oznaczone są kolorem czerwonym.
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row no-gutters justify="center">
      <v-col class="pa-0" cols="12" md="10" lg="8" xl="6">
        <detailed-list
          title="Lista konfiguracji"
          :list="configurations"
          :listElements="confElems"
          objIcon="mdi-database-settings"
          @pagination="paginationClicked($event)"
          @panelChanged="panelChanged($event)"
        >
          <configuration-editor
            :confData="editedConfData"
            @confEdited="editConf($event)"
          >
          </configuration-editor>
        </detailed-list>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ConfigurationEditor from '../components/BenchmarkConfigurationEditor.vue';
import { ConfigurationsService } from '../API/configurations';
import { Content } from '../models/ConfigurationModel';

@Component({
  components: {
    ConfigurationEditor,
  },
})
export default class BenchmarkConfigurations extends Vue {
  private configurationsService!: ConfigurationsService;

  private beforeCreate() {
    this.configurationsService = new ConfigurationsService();
  }

  private created() {
    this.getConfigurations({ page: 0 });
  }

  private getConfigurations(params: object) {
    this.configurationsService
      .getConfigurations(params)
      .then((res) => {
        this.$data.configurations = res.data;
      })
      .catch((err) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private paginationClicked(pageNumber: number) {
    this.getConfigurations({ page: pageNumber - 1 });
  }

  private panelChanged(panelId: number) {
    this.$data.editedConf = panelId;
    this.$data.editedConfData = this.$data.configurations.content[panelId];
  }

  private editConf(data: Content) {}

  private data() {
    return {
      configurations: [],
      editedConf: 0,
      editedConfData: {
        id: 0,
        name: '',
        createdAt: '',
        archived: false,
        loginAllStocks: 0,
        loginOwnedStocks: 0,
        loginUserOrders: 0,
        loginMakeOrder: 0,
        allStocksMakeOrder: 0,
        allStocksEnd: 0,
        ownedStocksMakeOrder: 0,
        ownedStocksEnd: 0,
        userOrdersMakeOrder: 0,
        userOrdersEnd: 0,
        userOrderDeleteOrder: 0,
        makeOrderBuyOrder: 0,
        makeOrderSellOrder: 0,
        noOfOperations: 0,
        noOfMoney: 0,
      },
      confElems: [
        {
          text: 'Nazwa',
          value: 'name',
        },
      ],
    };
  }
}
</script>
