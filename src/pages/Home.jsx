import books from "../data/icons/books.png"
import moment from "moment";
import "moment/locale/fr";
import StudentsCard from "../component/widget/StudentsCard";
import TeachersCard from "../component/widget/TeachersCard";
import RevenueCard from "../component/widget/RevenueCard";
import ClassesCard from "../component/widget/ClassesCard";

moment.locale("fr", {
  months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
  monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
  monthsParseExact: true,
  weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
  weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
  weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd, D MMMM YYYY. HH:mm",
  },
});
export default function Home() {
  const cureentTime = moment().format("LLLL");
  
  return (
    <div className="p-2">
      <div className="flex bg-main-bg justify-between shadow-md border border-gray-100 m-4 rounded-md p-2">
        <div id="hello" className="">
          <p className="text-gray-600 text-lg">Bienvenue</p>
        </div>
        <div id="date" className="">
          <p className="text-gray-600 text-lg">{cureentTime.charAt(0).toUpperCase() + cureentTime.slice(1)}</p>
        </div>
        <div id="schoolYear" className="flex">
          <p className="text-gray-600 text-lg">{new Date().getFullYear() + "-" + Number(new Date().getFullYear() + 1)}</p>
          <img className="ml-6 w-6  " src={books} alt="logo " />
        </div>
      </div>
      <div className=" flex flex-wrap m-4 gap-4 items-center justify-center">

      <StudentsCard />
      <TeachersCard />
      <ClassesCard />
      <RevenueCard />
      </div>
    </div>
  );
}
