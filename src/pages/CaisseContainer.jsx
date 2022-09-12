import React, { useEffect } from "react";
import { TabComponent, TabItemDirective, TabItemsDirective } from "@syncfusion/ej2-react-navigations";
import Caisse from "./Caisse";
import Caisse1 from "../component/caisse/Caisse";
import Caisse2 from "../component/caisse/Caisse2";
import Caisse3 from "../component/caisse/Caisse3";
import add from "./../data/icons/Plus.png";
import { useStore } from "../contexts/Store";
export default function CaisseContainer() {
  function chooseCaisse(index) {
    if (index === 0) return () => <Caisse />;
    if (index === 1) return () => <Caisse1 />;
    if (index === 2) return () => <Caisse2 />;
    if (index === 3) return () => <Caisse3 />;
  }
  let tabObj;
  const showTabs1 = useStore((state) => state.showTabs1);
  const showTabs2 = useStore((state) => state.showTabs2);
  const showTabs3 = useStore((state) => state.showTabs3);

  useEffect(() => {
    useStore.setState((state) => ({ tabObj }));
  }, [tabObj]);

  return (
    <>
      <div className=" m-2 shadow-lg rounded-sm  relative">
        <TabComponent
          ref={(g) => (tabObj = g)}
          heightAdjustMode="Auto"
          animation={{ previous: { effect: "None" }, next: { effect: "None" } }}
          showCloseButton
          removed={(e) => {
          if (e.removedItem.innerText === "# N°2"){useStore.setState((state) => ({ showTabs1: false }));};
          if (e.removedItem.innerText === "# N°3"){useStore.setState((state) => ({ showTabs2: false }));};
          if (e.removedItem.innerText === "# N°4"){useStore.setState((state) => ({ showTabs3: false }));};
          }}
          id="defaultTab ">
          <TabItemsDirective>
            <TabItemDirective header={{ text: `# N°1` }} content={() => <Caisse />} />
            {showTabs1 && <TabItemDirective header={{ text: `# N°2` }} id="tab1" content={() => <Caisse1 />} />}
            {showTabs2 && <TabItemDirective header={{ text: `# N°3` }} id="tab2" content={() => <Caisse2 />} />}
            {showTabs3 && <TabItemDirective header={{ text: `# N°4` }} id="tab3" content={() => <Caisse3 />} />}
          </TabItemsDirective>
        </TabComponent>
      </div>
    </>
  );
}
