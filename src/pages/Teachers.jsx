import Header from "./../component/layout/Header";
import teacher from "../data/icons/teacher.png";
import TeachersTable from './../component/table/TeachersTable';
export default function Teachers() {
  return (
    <div>
      <Header tilte="Liste d'enseignants" subTilte="Une liste d'enseignants complète , peut être modifié." img={teacher} />
      <div className="p-4 ">
         <TeachersTable />
      </div>
    </div>
  );}
