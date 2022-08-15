import React from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import { useStore } from "../../../../contexts/Store";

export default function ClasseGridStudents(props) {
 const treeViewTemplate = (props) => (
   <div className="">
     <p
       className="px-2 m-0 rounded-3xl"
       style={{
         backgroundColor: props.paid != null && props.paid ? "#e5faf2" : props.paid != null && "#fff0f1",
         color: props.paid != null && props.paid ? "#3bb077" : props.paid != null && "#d95087",
       }}>
       {props.name}
     </p>
   </div>
 );


  const hierarchicalData = [
    {
      id: "01",
      name: "Élèves",
      subChild:
        props.students != null
          ? props.students.map((student, index) => {
              return { name: student.name, id: index, paid: student.paid };
            })
          : useStore.getState().selectedClasses.students.map((student, index) => {
              return { name: student.name, id: index, paid: student.paid };
            }),
    },
  ];
  const dataSource = { dataSource: hierarchicalData, id: "id", text: "name", child: "subChild" };
  return <TreeViewComponent name="students" id="students" fields={dataSource} nodeTemplate={treeViewTemplate}></TreeViewComponent>;
}
