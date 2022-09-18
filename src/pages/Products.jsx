import ProductsTable from '../component/table/ProductsTable';
import Header from './../component/layout/Header';
import { useStore } from "../contexts/Store";
export default function Products() {
const theme = useStore((state) => state.theme);
  return (
    <>
      <Header title="Produits   📦" />
      <ProductsTable />
    </>
  );
}
