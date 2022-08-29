import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from 'os'
import { join } from 'path'
import Store from "electron-store";
import { writeFile } from "fs";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
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
  category: "string",
  brand: "string",
  unit: "string",
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
  avance: [{ date: { type: Date }, amount: "number", credit: "number", paymentType: "string" }],
});

const providerSchema = new mongoose.Schema({
  id: "number",
  name: "string",
  address: "string",
  email: "string",
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
  avance: [{ date: { type: Date }, amount: "number", credit: "number", paymentType: "string" }],
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
client:{},
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
    unit: data.unit,
    quantity: data.quantity,
    qtyAlert: data.qtyAlert,
    buyPrice: data.buyPrice,
    lastBuyPrice: data.lastBuyPrice,
    sellPrice: data.sellPrice,
    sellPriceGros: data.sellPriceGros,
    expired: data.expired,
    comment: data.comment,
  });
  product.save().catch((err) => console.log("cannot create product", err));
  win.webContents.send("refreshGridProduct:add");
});
// ****** New Customer *********
ipcMain.on("addCustomer", (event, data) => {
  const customer = new Customer({
    name: data.name,
    address: data.address,
    phone: data.phone,
    comment: data.comment,
    rc: data.rc,
    if: data.if,
    ai: data.ai,
    is: data.is,
    ccp: data.ccp,
    rib: data.rib,
    credit: data.credit,
    avance: data.avance,
  });
  customer.save().catch((err) => console.log("cannot create customer", err));
  win.webContents.send("refreshGridCustomer:add");
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
    rc: data.rc,
    if: data.if,
    ai: data.ai,
    is: data.is,
    ccp: data.ccp,
    rib: data.rib,
    credit: data.credit,
    avance: data.avance,
  });
  provider.save().catch((err) => console.log("cannot create provider", err));
  win.webContents.send("refreshGridProvider:add");
});
// ****** New User *********
ipcMain.on("addUser", async (event, data) => {
  const user = new User({
    userName: data.userName,
    name: data.name,
    email: data.email,
    address: data.address,
    birthdate: data.birthdate,
    avatar: data.avatar,
    logo: data.logo,
    phone: data.phone,
    password: data.password,
    gender: data.gender,
    comment: data.comment,
    facebook: data.facebook,
    startAt: data.startAt,
    isAdmin: false,
    isLogged: false,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(data.password, salt);
  await user.save();
  win.webContents.send("refreshGridUser:add");
});
// ****** Login User *********
ipcMain.on("loginUser", (event, data) => {
  User.findOne({ userName: data.userName })
    .then((user) => {
      if (user == null) {
        win.webContents.send("loginUser:get", JSON.stringify(user));
      } else {
        bcrypt.compare(data.password, user.password).then((validation) => {
          win.webContents.send("loginUser:get", JSON.stringify({ ...user._doc, isLogged: validation }));
        });
      }
    })
    .catch((err) => console.log("cannot get User Item", err));
});
// ****** New Depense *********
ipcMain.on("addDepense", (event, data) => {
  const depense = new Depense({
    description: data.description,
    concerned: data.concern,
    type: data.type,
    time: data.time,
    data: data.data,
    index:data.index,
    amount: data.amount,
    comment: data.comment,
  });
  depense.save().catch((err) => console.log("cannot create Depense", err));
  win.webContents.send("refreshGridTeacher:add");
});
// ****** New Revenue *********
ipcMain.on("addRevenue", (event, data) => {
  const revenue = new Revenue({
    name: data.name,
    type: data.type,
    time: data.time,
    amount: data.amount,
    comment: data.comment,
  });
  revenue.save().catch((err) => console.log("cannot create Revenue", err));
  win.webContents.send("refreshGridRevenue:add");
});
// ****** New Notification *********
ipcMain.on("addNotification", (event, data) => {
  const notification = new Notification({
    name: data.name,
    type: data.type,
    amount: data.amount,
  });
  notification.save().catch((err) => console.log("cannot create Notification", err));
  win.webContents.send("refreshGridTeacher:add");
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
  vending.save()
    .then(() => win.webContents.send("refreshGridVending:add"))
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
    .then(() => win.webContents.send("refreshGridBuying:add"))
    .catch((err) => console.log("cannot create buying", err));
  
});
// ****** Update *********
ipcMain.on("updateProduct", (event, data) => {
  Product.updateOne(
    { _id: data._id },{$set: data,}).catch((err) => console.log("cannot update Product", err));
  win.webContents.send("refreshGridProduct:update");
});
ipcMain.on("updateCustomer", (event, data) => {
  Customer.updateOne(
    { _id: data._id },{$set: data,}).catch((err) => console.log("cannot update Customer", err));
  win.webContents.send("refreshGridCustomer:update");
});
ipcMain.on("updateProvider", (event, data) => {
  Provider.updateOne(
    { _id: data._id },{$set: data,}).catch((err) => console.log("cannot update Provider", err));
  win.webContents.send("refreshGridProvider:update");
});
ipcMain.on("updateVending", (event, data) => {
  Vending.updateOne(
    { _id: data._id },{$set: data,}).catch((err) => console.log("cannot update Vending", err));
  win.webContents.send("refreshGridVending:update");
});
ipcMain.on("updateBuying", (event, data) => {
  Buying.updateOne(
    { _id: data._id },{$set: data,}).catch((err) => console.log("cannot update Buying", err));
  win.webContents.send("refreshGridBuying:update");
});
ipcMain.on("updateDepense", (event, data) => {
  Depense.updateOne(
    { _id: data._id },{$set: data,}).catch((err) => console.log("cannot update Depense", err));
  win.webContents.send("refreshGridDepense:update");
});
ipcMain.on("updateNotification", (event, data) => {
  Notification.updateOne(
    { _id: data._id },{$set: data,}).catch((err) => console.log("cannot update Notification", err));
  win.webContents.send("refreshGridStudent:update");
});
ipcMain.on("updateUser", (event, data) => {
  User.updateOne(
    { _id: data._id },{$set: data,}).catch((err) => console.log("cannot update User", err));
  win.webContents.send("refreshGridUser:update");
});
ipcMain.on("updateUserPassword", async (event, data) => {
  const user = await User.findOne({ _id: data._id });
  const validation = await bcrypt.compare(data.password, user.password);
  if (validation) {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(data.newPassword, salt);
    await User.updateOne({ _id: data._id }, { $set: { password: newPassword } });
  } else {
    win.webContents.send("userPassword:failed");
  }
});
// ****** Delete *********
ipcMain.on("deleteProduct", (event, data) => {
  Product.deleteOne({ _id: data._id }).catch((err) => console.log("cannot delete Product", err));
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

// ********* Electron App *********************************
Store.initRenderer();
// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win= null
// Here you can add more preload scripts
const splash = join(__dirname, '../preload/splash.js')
// 🚧 Use ['ENV_NAME'] to avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

async function createWindow() {
  win = new BrowserWindow({
    title: "Stock App",
    width: 1600,
    height: 900,
    webPreferences: {
      preload: splash,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      spellcheck: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../../index.html'))
  } else {
    win.loadURL(url)
    // win.webContents.openDevTools()
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())

   
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// when worker window is ready
ipcMain.on("readyToPrintPDF", (event) => {
  const pdfPath = join(tmpdir(), "print.pdf");
  // Use default printing options
  win.webContents
    .printToPDF({ printSelectionOnly: true, })
    .then((data) => {
      writeFile(pdfPath, data, function (error) {
        if (error) {
          throw error;
        }
         shell.openExternal("file://" + pdfPath);
        event.sender.send("wrote-pdf", pdfPath);
      });
    })
    .catch((error) => {
      throw error;
    });
});

const printOptions = {
  silent: false,
  printBackground: true,
  color: true,
  margin: {
    marginType: "printableArea",
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: "Page header",
  footer: "Page footer",
};



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