import TextBox from "../button/TextBox";


export default function BuyingForm(props) {
  const labelclassName = "p-4 w-[170px] text-sm font-medium";
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className={labelclassName}>Raison Social:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="name" width="full" value={props?.name} title="Nom du Fournisseur" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Adresse:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="address" width="full" value={props?.address} title="Adresse du Fournisseur" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Téléphone:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="phone" width="full" value={props?.phone} title="N° Téléphone du Fournisseur" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Fax:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="fax" width="full" value={props?.fax} title="N° Fax du Fournisseur" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Email:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="email" width="full" value={props?.email} title="Email du Fournisseur" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>CCP:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="ccp" width="full" value={props?.name} title="CCP du Fournisseur" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>RIB:</td>
            <td className="w-[320px]">
              <TextBox type="text" id="rib" width="full" value={props?.name} title="RIB du Fournisseur" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Solde Crédit:</td>
            <td className="w-[320px]">
              <TextBox type="number" format="N2" label="DA" id="credit" width="w-[200px]" step={100} min={0} value={props?.credit} title="Solde Crédit" />
            </td>
          </tr>
          <tr>
            <td className={labelclassName}>Remarque:</td>
            <td className="w-[320px]">
              <TextBox type="text" multiline id="comment" width="full" value={props?.comment} title="Remarque sur le Fournisseur" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
