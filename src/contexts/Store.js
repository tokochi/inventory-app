import create from "zustand";

const { ipcRenderer } = require("electron");


export const useStore = create((set) => ({
  isLoggedIn: false,
  dropdownOpen: false,
  productForm: {},
  mode:"Détail",
  products: [],
  providers: [],
  customers: [],
  vendings: [],
  buyings: [],
  user: {},
  paymentType: "",
  settings: {
    preferance: { rooms: 4 },
    company: {},
  },
  selectedAttendances: {},
  notifactions: [],
  depenses: [],
  getProviders: () => {
    ipcRenderer.send("providerList:load");
    ipcRenderer.on("providerList:get", (e, res) => {
      set({ providers: JSON.parse(res) });
    });
  },
  getCustomers: () => {
    ipcRenderer.send("customerList:load");
    ipcRenderer.on("customerList:get", (e, res) => {
      set({ customers: JSON.parse(res) });
    });
  },
  getProducts: () => {
    ipcRenderer.send("productList:load");
    ipcRenderer.on("productList:get", (e, res) => {
      set({ products: JSON.parse(res) });
    });
  },
  getVendings: () => {
    ipcRenderer.send("vendingList:load");
    ipcRenderer.on("vendingList:get", (e, res) => {
      set({ vendings: JSON.parse(res) });
    });
  },
  getBuyings: () => {
    ipcRenderer.send("buyingList:load");
    ipcRenderer.on("buyingList:get", (e, res) => {
      set({ buyings: JSON.parse(res) });
    });
  },

  getDepenses: () => {
    ipcRenderer.send("depenseList:load");
    ipcRenderer.on("depenseList:get", (e, res) => {
      set({ depenses: JSON.parse(res) });
    });
  },

  getSettings: () => {
    ipcRenderer.send("settingList:load");
    ipcRenderer.on("settingList:get", (e, res) => {
      const resArray = JSON.parse(res);
      set({ settings: resArray[0] });
    });
  },
  getUsers: () => {
    ipcRenderer.send("settingList:load");
    ipcRenderer.on("settingList:get", (e, res) => {
      const resArray = JSON.parse(res);
      set({ settings: resArray[0] });
    });
  },
  getRevenues: () => {
    ipcRenderer.send("revenueList:load");
    ipcRenderer.on("revenueList:get", (e, res) => {
      set({ revenues: JSON.parse(res) });
    });
  },
  getNotifications: () => {
    ipcRenderer.send("notificationList:load");
    ipcRenderer.on("notificationList:get", (e, res) => {
      set({ notifications: JSON.parse(res) });
    });
  },
}));

export const useisClicked = () => useStore((state) => state.isClicked);
export const useSetIsClicked = () => useStore((state) => state.setIsClicked);
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
