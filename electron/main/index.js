import { app, BrowserWindow, ipcMain, shell, webFrame } from "electron";
import Store from "electron-store";
import { writeFile, readFile } from "fs";
import { release, tmpdir } from "os";
import { join } from "path";
const jfe = require("json-file-encrypt");
const si = require("systeminformation");
const mongoose = require("mongoose");


// readFile(join(__dirname, "..", "..", "..","..", "/bin.json"), "utf8", async (err, data) => {
//   if (err) {
//    process.exit(0);
//   }
//   let key1 = new jfe.encryptor("tokochi");
//   const cpuData = await si.cpu();
//   const systemData = await si.system();
//   const networkData = await si.networkInterfaces();
//   let encrypted = key1.encrypt(JSON.stringify([networkData[0].mac, cpuData.manufacturer, cpuData.brand, systemData.manufacturer, systemData.model, systemData.uuid]));
//   if (key1.decrypt(data) === "tokochi20101990") {
//     writeFile(join(__dirname, "..", "..", "..", "..", "/bin.json"), encrypted, (err, data) => {
//       if (err) {
// process.exit(0);
//       }
//     });
//   } else {
//     if (key1.decrypt(data) !== JSON.stringify([networkData[0].mac, cpuData.manufacturer, cpuData.brand, systemData.manufacturer, systemData.model, systemData.uuid]) || data == null) {
//       process.exit(0);
//     }
//   }
// });

// // *********** MongoDB onnection **********
mongoose
  .connect("mongodb://localhost/stock")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("cannot connect to MongoDB", err));
mongoose.set("debug", (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});

// *********** Schema **********
const productSchema = new mongoose.Schema({
  id: "number",
  name: "string",
  barCode: "string",
  fav: "boolean",
  notification: "boolean",
  lastTimeNotify: { type: Date },
  category: "string",
  brand: "string",
  unit: "string",
  lastTime: { type: Date },
  quantitySell: "number",
  revenue: "number",
  total: "number",
  quantity: "number",
  qtyAlert: "number",
  buyPrice: "number",
  lastBuyPrice: "number",
  sellPrice: "number",
  sellPriceGros: "number",
  expired: { type: Date },
  date: { type: Date, default: Date.now },
  comment: "string",
});

const customerSchema = new mongoose.Schema({
  id: "number",
  name: "string",
  address: "string",
  email: "string",
  lastTimeNotify: { type: Date },
  phone: "string",
  fax: "string",
  comment: "string",
  date: { type: Date, default: Date.now },
  rc: "string",
  if: "string",
  ai: "string",
  is: "string",
  ccp: "string",
  rib: "string",
  credit: "number",
  avance: [{ date: { type: Date }, amount: "number", credit: "number", paymentType: "string", name: "string", customerId: mongoose.Schema.ObjectId }],
});

const providerSchema = new mongoose.Schema({
  id: "number",
  name: "string",
  address: "string",
  email: "string",
  lastTimeNotify: { type: Date },
  phone: "string",
  fax: "string",
  comment: "string",
  date: { type: Date, default: Date.now },
  rc: "string",
  if: "string",
  ai: "string",
  is: "string",
  ccp: "string",
  rib: "string",
  credit: "number",
  avance: [{ date: { type: Date }, amount: "number", credit: "number", paymentType: "string", name: "string", providerId: mongoose.Schema.ObjectId }],
});
const userSchema = new mongoose.Schema({
  id: "number",
  userName: "string",
  name: "string",
  email: "string",
  password: "string",
  avatar: "string",
  logo: "string",
  facebook: "string",
  address: "string",
  phone: "string",
  birthdate: "date",
  comment: "string",
  date: { type: Date, default: Date.now },
  startAt: { type: Date },
  gender: "string",
});

const depenseSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  description: "string",
  concerned: "string",
  data: {},
  type: "string",
  index: "number",
  amount: "number",
  comment: "string",
});
const revenueSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  name: "string",
  type: "string",
  amount: "number",
  comment: "string",
});

const vendingSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  index: "number",
  type: "string",
  mode: "string",
  client: {},
  paymentType: "string",
  grid: [],
  amount: "number",
  tva: "number",
  rebate: "number",
  totalSellPrice: "number",
  totalbuyPrice: "number",
  totalSellPriceGros: "number",
  total: "number",
  deposit: "number",
  comment: "string",
});
const buyingSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  index: "number",
  type: "string",
  mode: "string",

  supplier: {},
  paymentType: "string",
  grid: [],
  amount: "number",
  tva: "number",
  rebate: "number",
  totalbuyPrice: "number",
  total: "number",
  deposit: "number",
  comment: "string",
});
const notificationSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  name: "string",
  content: "string",
  read: "boolean",
  link: "string",
  comment: "string",
});

const Product = mongoose.model("product", productSchema);
const Provider = mongoose.model("provider", providerSchema);
const Customer = mongoose.model("customer", customerSchema);
const User = mongoose.model("user", userSchema);
const Depense = mongoose.model("depense", depenseSchema);
const Vending = mongoose.model("vending", vendingSchema);
const Buying = mongoose.model("buying", buyingSchema);
const Revenue = mongoose.model("revenue", revenueSchema);
const Notification = mongoose.model("notification", notificationSchema);

// ****** New Product *********
ipcMain.on("addProduct", (event, data) => {
  const product = new Product({
    id: data.id,
    name: data.name,
    barCode: data.barCode,
    category: data.category,
    brand: data.brand,
    notification: data.notification,
    unit: data.unit,
    lastTimeNotify: new Date(),
    quantitySell: 0,
    revenue: 0,
    total: 0,
    quantity: data.quantity,
    qtyAlert: data.qtyAlert,
    buyPrice: data.buyPrice,
    lastBuyPrice: data.lastBuyPrice,
    sellPrice: data.sellPrice,
    sellPriceGros: data.sellPriceGros,
    expired: data.expired,
    comment: data.comment,
  });
  product
    .save()
    .then((data) => win.webContents.send("refreshGridProduct:add", JSON.stringify(data)))
    .catch((err) => console.log("cannot create product", err));
});
// ****** New Customer *********
ipcMain.on("addCustomer", (event, data) => {
  const customer = new Customer({
    name: data.name,
    address: data.address,
    phone: data.phone,
    comment: data.comment,
    lastTimeNotify: new Date(),
    rc: data.rc,
    if: data.if,
    ai: data.ai,
    is: data.is,
    ccp: data.ccp,
    rib: data.rib,
    credit: data.credit,
    avance: data.avance,
  });
  customer
    .save()
    .then((data) => win.webContents.send("refreshGridCustomer:add", JSON.stringify(data)))
    .catch((err) => console.log("cannot create customer", err));
});
// ****** New Provider *********
ipcMain.on("addProvider", (event, data) => {
  const provider = new Provider({
    name: data.name,
    address: data.address,
    phone: data.phone,
    fax: data.fax,
    email: data.email,
    comment: data.comment,
    lastTimeNotify: new Date(),
    rc: data.rc,
    if: data.if,
    ai: data.ai,
    is: data.is,
    ccp: data.ccp,
    rib: data.rib,
    credit: data.credit,
    avance: data.avance,
  });
  provider
    .save()
    .then((data) => win.webContents.send("refreshGridProvider:add", JSON.stringify(data)))
    .catch((err) => console.log("cannot create provider", err));
});

// ****** New Depense *********
ipcMain.on("addDepense", (event, data) => {
  const depense = new Depense({
    description: data.description,
    concerned: data.concern,
    type: data.type,
    time: data.time,
    data: data.data,
    index: data.index,
    amount: data.amount,
    comment: data.comment,
  });
  depense
    .save()
    .then((data) => win.webContents.send("refreshDepense:add", JSON.stringify(data)))
    .catch((err) => console.log("cannot create Depense", err));
});

// ****** New Vending *********
ipcMain.on("addVending", (event, data) => {
  const vending = new Vending({
    time: data.time,
    index: data.index,
    type: data.type,
    mode: data.mode,
    tva: data.tva,
    client: data.client,
    paymentType: data.paymentType,
    totalSellPriceGros: data.totalSellPriceGros,
    totalbuyPrice: data.totalbuyPrice,
    totalSellPrice: data.totalSellPrice,
    rebate: data.rebate,
    deposit: data.deposit,
    total: data.total,
    grid: data.grid,
    amount: data.amount,
    comment: data.comment,
  });
  vending
    .save()
    .then((data) => win.webContents.send("refreshGridVending:add", JSON.stringify(data)))
    .catch((err) => console.log("cannot create vending", err));
});
// ****** New Buying *********
ipcMain.on("addBuying", (event, data) => {
  const buying = new Buying({
    time: data.time,
    index: data.index,
    type: data.type,
    mode: data.mode,
    tva: data.tva,
    supplier: data.supplier,
    paymentType: data.paymentType,
    totalbuyPrice: data.totalbuyPrice,
    rebate: data.rebate,
    deposit: data.deposit,
    total: data.total,
    grid: data.grid,
    amount: data.amount,
    comment: data.comment,
  });
  buying
    .save()
    .then((data) => win.webContents.send("refreshGridBuying:add", JSON.stringify(data)))
    .catch((err) => console.log("cannot create buying", err));
});
// ****** Update *********
ipcMain.on("updateProduct", (event, data) => {
  Product.updateOne({ _id: data._id }, { $set: data })
    .then((data) => win.webContents.send("refreshGridProduct:update", JSON.stringify(data)))
    .catch((err) => console.log("cannot update Product", err));
});
ipcMain.on("updateCustomer", (event, data) => {
  Customer.updateOne({ _id: data._id }, { $set: data })
    .then((data) => win.webContents.send("refreshGridCustomer:update", JSON.stringify(data)))
    .catch((err) => console.log("cannot update Customer", err));
});
ipcMain.on("updateProvider", (event, data) => {
  Provider.updateOne({ _id: data._id }, { $set: data })
    .then((data) => win.webContents.send("refreshGridProvider:update", JSON.stringify(data)))
    .catch((err) => console.log("cannot update Provider", err));
});
ipcMain.on("updateVending", (event, data) => {
  Vending.updateOne({ _id: data._id }, { $set: data })
    .then((data) => win.webContents.send("refreshGridVending:update", JSON.stringify(data)))
    .catch((err) => console.log("cannot update Vending", err));
});
ipcMain.on("updateBuying", (event, data) => {
  Buying.updateOne({ _id: data._id }, { $set: data })
    .then((data) => win.webContents.send("refreshGridBuying:update", JSON.stringify(data)))
    .catch((err) => console.log("cannot update Buying", err));
});
ipcMain.on("updateDepense", (event, data) => {
  Depense.updateOne({ _id: data._id }, { $set: data }).catch((err) => console.log("cannot update Depense", err));
  win.webContents.send("refreshGridDepense:update");
});

// ****** Delete *********
ipcMain.on("deleteProduct", (event, data) => {
  Product.deleteOne({ _id: data._id })
    .then((data) => win.webContents.send("refreshGridProduct:delete", JSON.stringify(data)))
    .catch((err) => console.log("cannot delete Product", err));
  win.webContents.send("refreshGridProduct:delete");
});
ipcMain.on("deleteCustomer", (event, data) => {
  Customer.deleteOne({ _id: data._id }).catch((err) => console.log("cannot delete Customer", err));
  win.webContents.send("refreshGridCustomer:delete");
});
ipcMain.on("deleteProvider", (event, data) => {
  Provider.deleteOne({ _id: data._id }).catch((err) => console.log("cannot delete Provider", err));
  win.webContents.send("refreshGridProvider:delete");
});
ipcMain.on("deleteVending", (event, data) => {
  Vending.deleteOne({ _id: data._id }).catch((err) => console.log("cannot delete Vending", err));
  win.webContents.send("refreshGridVending:delete");
});
ipcMain.on("deleteBuying", (event, data) => {
  Buying.deleteOne({ _id: data._id }).catch((err) => console.log("cannot delete Buying", err));
  win.webContents.send("refreshGridBuying:delete");
});
ipcMain.on("deleteNotification", (event, data) => {
  Notification.deleteOne({ _id: data._id }).catch((err) => console.log("cannot delete Notification", err));
  win.webContents.send("refreshGridNotification:delete");
});
ipcMain.on("deleteUser", (event, data) => {
  User.deleteOne({ _id: data._id }).catch((err) => console.log("cannot delete User", err));
  win.webContents.send("refreshGridUser:delete");
});
ipcMain.on("deleteDepense", (event, data) => {
  Depense.deleteOne({ _id: data._id }).catch((err) => console.log("cannot delete Depense", err));
  win.webContents.send("refreshGridDepense:delete");
});
// ****** Get All Data *********
ipcMain.on("productList:load", () => {
  Product.find()
    .then((List) => win.webContents.send("productList:get", JSON.stringify(List)))
    .catch((err) => console.log("cannot get Product List", err));
});
ipcMain.on("customerList:load", () => {
  Customer.find()
    .then((List) => win.webContents.send("customerList:get", JSON.stringify(List)))
    .catch((err) => console.log("cannot get Customer List", err));
});
ipcMain.on("providerList:load", () => {
  Provider.find()
    .then((List) => win.webContents.send("providerList:get", JSON.stringify(List)))
    .catch((err) => console.log("cannot get Provider List", err));
});
ipcMain.on("vendingList:load", () => {
  Vending.find()
    .then((List) => win.webContents.send("vendingList:get", JSON.stringify(List)))
    .catch((err) => console.log("cannot get Vending List", err));
});
ipcMain.on("buyingList:load", () => {
  Buying.find()
    .then((List) => win.webContents.send("buyingList:get", JSON.stringify(List)))
    .catch((err) => console.log("cannot get Buying List", err));
});
ipcMain.on("depenseList:load", () => {
  Depense.find()
    .then((List) => win.webContents.send("depenseList:get", JSON.stringify(List)))
    .catch((err) => console.log("cannot get Depense List", err));
});
ipcMain.on("notificationList:load", () => {
  Notification.find()
    .then((List) => win.webContents.send("notificationList:get", JSON.stringify(List)))
    .catch((err) => console.log("cannot get notification List", err));
});
// ****** Get one Item Data *********
ipcMain.on("productItem:load", () => {
  Product.findOne({ _id: data._id })
    .then((Item) => win.webContents.send("productItem:get", JSON.stringify(Item)))
    .catch((err) => console.log("cannot get Product Item", err));
});
ipcMain.on("customerItem:load", () => {
  Customer.findOne({ _id: data._id })
    .then((Item) => win.webContents.send("customerItem:get", JSON.stringify(Item)))
    .catch((err) => console.log("cannot get Customer Item", err));
});
ipcMain.on("providerItem:load", () => {
  Provider.findOne({ _id: data._id })
    .then((Item) => win.webContents.send("providerItem:get", JSON.stringify(Item)))
    .catch((err) => console.log("cannot get Provider Item", err));
});
ipcMain.on("vendingItem:load", () => {
  Vending.findOne({ _id: data._id })
    .then((Item) => win.webContents.send("vendingItem:get", JSON.stringify(Item)))
    .catch((err) => console.log("cannot get Vending Item", err));
});
ipcMain.on("notificationItem:load", () => {
  Notification.findOne({ _id: data._id })
    .then((Item) => win.webContents.send("notificationItem:get", JSON.stringify(Item)))
    .catch((err) => console.log("cannot get Notification Item", err));
});
ipcMain.on("userItem:load", (event, data) => {
  User.findOne({ userName: data.userName, password: data.password })
    .then((Item) => win.webContents.send("userItem:get", JSON.stringify(Item)))
    .catch((err) => console.log("cannot get User Item", err));
});
ipcMain.on("depenseItem:load", () => {
  Depense.findOne({ _id: data._id })
    .then((Item) => win.webContents.send("depenseItem:get", JSON.stringify(Item)))
    .catch((err) => console.log("cannot get Depense Item", err));
});
ipcMain.on("buyingItem:load", () => {
  Buying.findOne({ _id: data._id })
    .then((Item) => win.webContents.send("buyingItem:get", JSON.stringify(Item)))
    .catch((err) => console.log("cannot get Buying Item", err));
});
ipcMain.on("backupData", async (event, data) => {
  Promise.all([,]);
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  Product.insertMany(data.products)
    .then(() => console.log("Data inserted"))
    .catch((err) => console.log("cannot Product.insertMany", err));
  Customer.insertMany(data.customers)
    .then(() => console.log("Data inserted"))
    .catch((err) => console.log("cannot Customer.insertMany", err));
  Provider.insertMany(data.providers)
    .then(() => console.log("Data inserted"))
    .catch((err) => console.log("cannot Provider.insertMany", err));
  Vending.insertMany(data.vendings)
    .then(() => console.log("Data inserted"))
    .catch((err) => console.log("cannot Vending.insertMany", err));
  Buying.insertMany(data.buyings)
    .then(() => console.log("Data inserted"))
    .catch((err) => console.log("cannot Buying.insertMany", err));
});
// ********* Electron App *********************************
Store.initRenderer();
// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const store = new Store();

let win = null;
// Here you can add more preload scripts
const splash = join(__dirname, "../preload/splash.js");
// 🚧 Use ['ENV_NAME'] to avoid vite:define plugin
const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;

async function createWindow() {
  win = new BrowserWindow({
    title: "Stock App",
    width: 1600,
    height: 900,
    //autoHideMenuBar: true,
    webPreferences: {
      preload: splash,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      spellcheck: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../../index.html"));
  } else {
    win.loadURL(url);
    // win.webContents.openDevTools()
  }

  // Test active push message to Renderer-process
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (store?.get("reset") === true) {
    store?.set("user", {});
    store?.set("isLoggedIn", false);
  }
  // backup
  if ((new Date() - new Date(store?.get("backupTime"))) / 3600000 > 24) {
    Promise.all([Product.find(), Customer.find(), Provider.find(), Vending.find(), Buying.find()])
      .then((values) => {
        store?.set("backup", [...store?.get("backup"), { date: new Date(), products: values[0], customers: values[1], providers: values[2], vendings: values[3], buyings: values[4] }]);
        store?.set("backupTime", new Date());
        console.log("backup done");
      })
      .catch((err) => console.log("backup Error", err));
  }

  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.on("zoom-", (event, data) => {
  webFrame.setZoomLevel(data);
  console.log(data);
});
ipcMain.on("reload", (event, data) => {
  win.reload();
  try {
    ToolbarWindow.reload();
  } catch (error) {}
});
ipcMain.on("zoom+", (event, data) => {
  webFrame.setZoomLevel(1);
  console.log(data);
});

const printOptions = {
  silent: false,
  pageSize: { height: 301000, width: 58100 },
  // printBackground: true,
  // color: true,
  // margin: {
  //   marginType: "printableArea",
  // },
  // landscape: false,
  // pagesPerSheet: 1,
  // collate: false,
  // copies: 1,
  // header: "Page header",
  // footer: "Page footer",
};

// when worker window is ready
// ipcMain.on("readyToPrintPDF", (event) => {
//   const pdfPath = join(tmpdir(), "print.pdf");
//   // Use default printing options
//   win.webContents
//     .printToPDF({ printSelectionOnly: true, pageSize: { height: 301000, width: 58100 } })
//     .then((data) => {
//       writeFile(pdfPath, data, function (error) {
//         if (error) {
//           throw error;
//         }
//         shell.openExternal("file://" + pdfPath);
//         event.sender.send("wrote-pdf", pdfPath);
//       });
//     })
//     .catch((error) => {
//       throw error;
//     });
// });

ipcMain.on("printComponent", (event, url) => {
  console.log("Print Initiated in Main...");
  let wino = new BrowserWindow({ show: true });

  wino.loadURL(url);

  wino.webContents.on("did-finish-load", () => {
    wino.webContents.print(printOptions, (success, failureReason) => {
      console.log("Print Initiated in Main...");
      if (!success) console.log(failureReason);
    });
  });
  return "shown print dialog";
});

//handle preview
ipcMain.on("previewComponent", (event, url) => {
  let wino = new BrowserWindow({ title: "Preview", show: true, defaultEncoding: "utf8", autoHideMenuBar: true });
  wino.loadURL(url);

  wino.webContents.once("did-finish-load", () => {
    wino.webContents
      .printToPDF(printOptions)
      .then((data) => {
        let buf = Buffer.from(data);
        var data = buf.toString("base64");
        let url = "data:application/pdf;base64," + data;

        wino.webContents.on("ready-to-show", () => {
          wino.show();
          wino.setTitle("Preview");
        });

        wino.webContents.on("closed", () => (wino = null));
        wino.loadURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return "shown preview window";
});
ipcMain.on("previewComponent2", (event, url) => {
  let wino = new BrowserWindow({ title: "Preview", show: true, defaultEncoding: "utf8", autoHideMenuBar: true });
  wino.loadURL(url);

  wino.webContents.once("did-finish-load", () => {
    wino.webContents
      .printToPDF({ ...printOptions, pageSize:"A4" })
      .then((data) => {
        let buf = Buffer.from(data);
        var data = buf.toString("base64");
        let url = "data:application/pdf;base64," + data;

        wino.webContents.on("ready-to-show", () => {
          wino.show();
          wino.setTitle("Preview");
        });

        wino.webContents.on("closed", () => (wino = null));
        wino.loadURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return "shown preview window";
});
