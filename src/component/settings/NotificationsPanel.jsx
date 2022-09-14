import Store from "electron-store";
import React, { useState } from "react";

function NotificationsPanel() {
  const schema = {
    notifications: { default: { productAlert: true, clients: true, providers: true, revenue: true }, type: "object" },
  };
  const store = new Store({ schema });
  const notify = store?.get("notifications");
  const [productAlert, setProductAlert] = useState(notify.productAlert);
  const [clients, setClients] = useState(notify.clients);
  const [providers, setProviders] = useState(notify.providers);
  const [revenue, setRevenue] = useState(notify.revenue);

  return (
    <div className=" h-[500px]">
      {/* Panel body */}
      <div className="p-6 space-y-6">
        <h2 className="text-2xl text-slate-800 font-bold mb-5">Notifications</h2>

        {/* General */}
        <section>
          <h3 className="text-xl leading-snug text-slate-800 font-bold mb-1">Géneral</h3>
          <ul>
            <li className="flex justify-between items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div>
                <div className="text-slate-800 font-semibold">Rupture de Stock</div>
                <div className="text-sm">Notification des Produit en quantité alérte ou rupture.</div>
              </div>
              {/* Right */}
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{productAlert ? "On" : "Off"}</div>
                <div className="form-switch">
                  <input
                    type="checkbox"
                    id="productAlert"
                    className="sr-only"
                    checked={productAlert}
                    onChange={(e) => {
                      setProductAlert(!productAlert);
                      store?.set("notifications", { ...store?.get("notifications"), productAlert: e.target.checked });
                    }}
                  />
                  <label className="bg-slate-400" htmlFor="productAlert">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div>
                <div className="text-slate-800 font-semibold">Crédit Client</div>
                <div className="text-sm">Notification des crédits clients .</div>
              </div>
              {/* Right */}
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{clients ? "On" : "Off"}</div>
                <div className="form-switch">
                  <input
                    type="checkbox"
                    id="clients"
                    className="sr-only"
                    checked={clients}
                    onChange={(e) => {
                      setClients(!clients);
                      store?.set("notifications", { ...store?.get("notifications"), clients: e.target.checked });
                    }}
                  />
                  <label className="bg-slate-400" htmlFor="clients">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div>
                <div className="text-slate-800 font-semibold">Déttes Fournisseurs</div>
                <div className="text-sm">Notifications des déttes des fournisseurs.</div>
              </div>
              {/* Right */}
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{providers ? "On" : "Off"}</div>
                <div className="form-switch">
                  <input
                    type="checkbox"
                    id="providers"
                    className="sr-only"
                    checked={providers}
                    onChange={(e) => {
                      setProviders(!providers);
                      store?.set("notifications", { ...store?.get("notifications"), providers: e.target.checked });
                    }}
                  />
                  <label className="bg-slate-400" htmlFor="providers">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div>
                <div className="text-slate-800 font-semibold">Revenue Quotidien</div>
                <div className="text-sm">Notification des Revenues des ventes journalier.</div>
              </div>
              {/* Right */}
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{revenue ? "On" : "Off"}</div>
                <div className="form-switch">
                  <input
                    type="checkbox"
                    id="revenue"
                    className="sr-only"
                    checked={revenue}
                    onChange={(e) => {
                      setRevenue(!revenue);
                      store?.set("notifications", { ...store?.get("notifications"), revenue: e.target.checked });
                    }}
                  />
                  <label className="bg-slate-400" htmlFor="revenue">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
            </li>
          </ul>
        </section>

        {/* Shares */}
      </div>
    </div>
  );
}

export default NotificationsPanel;
