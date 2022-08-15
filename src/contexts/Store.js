import create from "zustand";

const { ipcRenderer } = require("electron");


export const useStore = create((set) => ({
  isLoggedIn: false,
  dropdownOpen: false,
  productForm: {},
  setproductForm: (field, value) => set((state) => ({ productForm: { ...state.productForm, [field]: value } })),
  products: [],
  user: {},
  paymentType: "",
  settings: {
    preferance: { rooms: 4 },
    company: {},
  },
  selectedAttendances: {},
  notifactions: [],
  depenses: [],
  getClasses: () => {
    ipcRenderer.send("classeList:load");
    ipcRenderer.on("classeList:get", (e, res) => {
      set({ classes: JSON.parse(res) });
    });
  },
  getEvents: () => {
    ipcRenderer.send("eventList:load");
    ipcRenderer.on("eventList:get", (e, res) => {
      set({ events: JSON.parse(res) });
    });
  },
  getProducts: () => {
    ipcRenderer.send("productList:load");
    ipcRenderer.on("productList:get", (e, res) => {
      set({ products: JSON.parse(res) });
    });
  },
  getTeachers: () => {
    ipcRenderer.send("teacherList:load");
    ipcRenderer.on("teacherList:get", (e, res) => {
      set({ teachers: JSON.parse(res) });
    });
  },
  getAttendances: () => {
    ipcRenderer.send("attendanceList:load");
    ipcRenderer.on("attendanceList:get", (e, res) => {
      set({ attendances: JSON.parse(res) });
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
export const loadClasses = () => useStore.getState().getClasses();
export const loadProducts = () => useStore.getState().getProducts();
export const loadTeachers = () => useStore.getState().getTeachers();
export const loadEvents = () => useStore.getState().getEvents();
export const loadSettings = () => useStore.getState().getSettings();
export const loadAttendances = () => useStore.getState().getAttendances();
export const loadEmployees = () => useStore.getState().getEmployees();
export const loadDepenses = () => useStore.getState().getDepenses();
export const loadRevenues = () => useStore.getState().getRevenues();
export const loadNotifications = () => useStore.getState().getNotifications();
