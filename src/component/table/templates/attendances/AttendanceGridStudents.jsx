import React from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import { useStore } from "../../../../contexts/Store";

export default function AttendanceGridStudents(props) {
// console.log("🚀 ~ file: AttendanceGridStudents.jsx ~ line 6 ~ AttendanceGridStudents ~ props", props)
  
  const treeViewTemplate = (props) => (
    <div className="">
      <p
        className="px-2 m-0 rounded-3xl"
        style={{
          backgroundColor: props.present != null && props.present ? "#e5faf2" : props.present != null && "#f8edd2",
          color: props.present != null && props.present ? "#3bb077" : props.present != null && "goldenrod",
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
              return { name: student.name, id: index, present: student.present };
            })
          : useStore.getState().selectedAttendances.students.map((student, index) => {
              return { name: student.name, id: index, present: student.present };
            }),
    },
  ];
  const dataSource = { dataSource: hierarchicalData, id: "id", text: "name", child: "subChild" };
  return <TreeViewComponent name="students" id="students" fields={dataSource} nodeTemplate={treeViewTemplate}></TreeViewComponent>;
}
