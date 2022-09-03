import create from "zustand";
const { ipcRenderer } = require("electron");
import Store from "electron-store";

const store = new Store();
export const useStore = create((set) => ({
  isLoggedIn: store?.get("reset") && !store?.get("user")?.userName ? false : true,
  dropdownOpen: false,
  indexRow: false,
  caisse: {
    mode: "Détail",
    autoCompleteObj: {},
    time: new Date(),
    client: { name: "Standard" },
    amount: 0,
    total: 0,
    rebate: 0,
    deposit: 0,
    selectedProducts: [],
    selectedProduct: null,
  },
  facture: {
    mode: "Détail",
    paymentType: "Espéce",
    client: { name: "Standard" },
    tva: 0,
    autoCompleteObj: {},
    amount: 0,
    total: 0,
    rebate: 0,
    deposit: 0,
    selectedProducts: [],
    toastObj: {},
    selectedProduct: null,
  },
  bonAchat: {
    mode: "Détail",
    paymentType: "Espéce",
    tva: 0,
    supplier: { name: "Standard" },
    autoCompleteObj: {},
    amount: 0,
    total: 0,
    rebate: 0,
    deposit: 0,
    selectedProducts: [],
    selectedProduct: null,
  },
  productForm: {},
  products: [],
  providers: [],
  customers: [],
  vendings: [],
  buyings: [],
  user: () => store?.get("user"),
  paymentType: "",
  settings: {
    preferance: { rooms: 4 },
    company: {},
  },
  selectedAttendances: {},
  notifactions: [],
  depenses: [],
  setTotal: () =>
    set((state) => ({
      caisse: {
        ...state.caisse,
        amount:
          state.caisse.selectedProducts.reduce(
            (prevProduct, currProduct) =>
              state.caisse.mode === "Détail"
                ? parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPrice)
                : parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPriceGros),
            0
          ) - state.caisse.rebate,
        total: state.caisse.selectedProducts.reduce(
          (prevProduct, currProduct) =>
            state.caisse.mode === "Détail"
              ? parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPrice)
              : parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPriceGros),
          0
        ),
        deposit:
          state.caisse.selectedProducts.reduce(
            (prevProduct, currProduct) =>
              state.caisse.mode === "Détail"
                ? parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPrice)
                : parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPriceGros),
            0
          ) - parseInt(state.caisse.rebate),
      },
    })),
  setTotalFacture: () =>
    set((state) => ({
      facture: {
        ...state.facture,
        amount:
          state.facture.selectedProducts.reduce(
            (prevProduct, currProduct) =>
              state.facture.mode === "Détail"
                ? parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPrice)
                : parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPriceGros),
            0
          ) +
          parseInt(
            state.facture.selectedProducts.reduce(
              (prevProduct, currProduct) =>
                state.facture.mode === "Détail"
                  ? parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPrice)
                  : parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPriceGros),
              0
            ) * state.facture.tva
          ) -
          state.facture.rebate,
        total: state.facture.selectedProducts.reduce(
          (prevProduct, currProduct) =>
            state.facture.mode === "Détail"
              ? parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPrice)
              : parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPriceGros),
          0
        ),
        deposit:
          state.facture.selectedProducts.reduce(
            (prevProduct, currProduct) =>
              state.facture.mode === "Détail"
                ? parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPrice)
                : parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.sellPriceGros),
            0
          ) - parseInt(state.facture.rebate),
      },
    })),
  setTotalBonAchat: () =>
    set((state) => ({
      bonAchat: {
        ...state.bonAchat,
        amount:
          state.bonAchat.selectedProducts.reduce((prevProduct, currProduct) => parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.buyPrice), 0) +
          parseInt(
            state.bonAchat.selectedProducts.reduce((prevProduct, currProduct) => parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.buyPrice), 0) *
              state.bonAchat.tva
          ) -
          state.bonAchat.rebate,
        total: state.bonAchat.selectedProducts.reduce((prevProduct, currProduct) => parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.buyPrice), 0),
        deposit:
          state.bonAchat.selectedProducts.reduce((prevProduct, currProduct) => parseInt(prevProduct) + parseInt(currProduct.selectedQuantity) * parseInt(currProduct?.buyPrice), 0) -
          parseInt(state.bonAchat.rebate),
      },
    })),
  getProviders: () => {
    ipcRenderer.send("providerList:load");
  },
  getCustomers: () => {
    ipcRenderer.send("customerList:load");
  },
  getProducts: () => {
    ipcRenderer.send("productList:load");
  },
  getVendings: () => {
    ipcRenderer.send("vendingList:load");
  },
  getBuyings: () => {
    ipcRenderer.send("buyingList:load");
  },
  getNotifications: () => {
    ipcRenderer.send("notificationList:load");
  },
}));

// Romove all isteners
ipcRenderer.eventNames().forEach((n) => {
  ipcRenderer.removeAllListeners(n);
});
// Add new isteners

ipcRenderer.on("productList:get", (e, res) => {
  useStore.setState({ products: JSON.parse(res) });
});
ipcRenderer.on("providerList:get", (e, res) => {
  useStore.setState({ providers: JSON.parse(res) });
});
ipcRenderer.on("customerList:get", (e, res) => {
  useStore.setState({ customers: JSON.parse(res) });
});
ipcRenderer.on("vendingList:get", (e, res) => {
  useStore.setState({ vendings: JSON.parse(res) });
});
ipcRenderer.on("buyingList:get", (e, res) => {
  useStore.setState({ buyings: JSON.parse(res) });
});
ipcRenderer.on("notificationList:get", (e, res) => {
  useStore.setState({ notifications: JSON.parse(res) });
});

export const loadProviders = () => useStore.getState().getProviders();
export const loadProducts = () => useStore.getState().getProducts();
export const loadCustomers = () => useStore.getState().getCustomers();
export const loadVendings = () => useStore.getState().getVendings();
export const loadBuyings = () => useStore.getState().getBuyings();
export const loadEvents = () => useStore.getState().getEvents();
export const loadSettings = () => useStore.getState().getSettings();
export const loadDepenses = () => useStore.getState().getDepenses();
export const loadRevenues = () => useStore.getState().getRevenues();
export const loadNotifications = () => useStore.getState().getNotifications();
