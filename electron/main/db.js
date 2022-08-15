const mongoose = require("mongoose");
// *********** MongoDB onnection **********
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
  category: "string",
  brand: "string",
  unit: "number",
  quantity: "number",
  qtyAlert: "number",
  buyPrice: "number",
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
  phone: "number",
  comment: "string",
  date: { type: Date, default: Date.now },
  rc: "number",
  if: "number",
  ai: "number",
  is: "number",
  ccp: "number",
  rib: "number",
  credit: "number",
  avance: [{ date: { type: Date }, amount: "number" }],
});

const providerSchema = new mongoose.Schema({
  id: "number",
  name: "string",
  address: "string",
  email: "string",
  phone: "number",
  fax: "number",
  comment: "string",
  date: { type: Date, default: Date.now },
  rc: "number",
  if: "number",
  ai: "number",
  is: "number",
  ccp: "number",
  rib: "number",
  credit: "number",
  avance: [{ date: { type: Date }, amount: "number" }],
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
  index: "string",
  type: "string",
  customer: mongoose.Schema.ObjectId,
  paymentType: "string",
  payment: { total: "number", rebate: "number", deposit: "number" },
  grid: [],
  amount: "number",
  comment: "string",
});
const buyingSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  index: "string",
  type: "string",
  provider: mongoose.Schema.ObjectId,
  grid: [],
  paymentType: "string",
  payment: { total: "number", rebate: "number", deposit: "number" },
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
    name: data.name,
    barCode: data.barCode,
    category: data.category,
    brand: data.brand,
    unit: data.unit,
    quantity: data.quantity,
    qtyAlert: data.qtyAlert,
    buyPrice: data.buyPrice,
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
// ****** New Vending *********
ipcMain.on("addVending", (event, data) => {
  const vending = new Vending({
    time: data.time,
    index: data.index,
    type: data.type,
    customer: data.customer,
    paymentType: data.paymentType,
    payment: data.payment,
    grid: data.grid,
    amount: data.amount,
    comment: data.comment,
  });
  vending.save().catch((err) => console.log("cannot create vending", err));
  win.webContents.send("refreshGridVending:add");
});
// ****** New Buying *********
ipcMain.on("addBuying", (event, data) => {
  const buying = new Buying({
    time: data.time,
    index: data.index,
    type: data.type,
    provider: data.customer,
    paymentType: data.paymentType,
    payment: data.payment,
    grid: data.grid,
    amount: data.amount,
    comment: data.comment,
  });
  buying.save().catch((err) => console.log("cannot create buying", err));
  win.webContents.send("refreshGridBuying:add");
});
