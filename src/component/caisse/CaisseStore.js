import create from "zustand";

export const useCaisseStore = create((set) => ({
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
}));



