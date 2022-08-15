import React from "react";
import { ScheduleComponent, Day, Week, Inject, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective, DragAndDrop, Resize } from "@syncfusion/ej2-react-schedule";
import Localization from "./Localization";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import moment from "moment";
import styled from "styled-components";
import { useStore, loadEvents, loadClasses } from "../contexts/Store";
import { SwitchComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import { ColorPickerComponent, TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { useState, useEffect } from "react";
import ClasseAvatar from "./avatar/ClasseAvatar";
const { ipcRenderer } = require("electron");

Localization();
loadEvents();
loadClasses();

export default function Schedular() {
  // ******** Column Templates  ********
  const classesData = useStore((state) => state.classes);
  const eventsData = useStore((state) => state.events);
  const ownerData = [
    { text: "Salle 01", id: 1, color: "#ea7a57" },
    { text: "Salle 02", id: 2, color: "#7fa900" },
    { text: "Salle 03", id: 3, color: "#5978ee" },
    { text: "Salle 04", id: 4, color: "#fec200" },
  ];

  const rooms = 4;

  const eventTemplate = (props) => {
    const attendanceGridName = (prop) => (
      <div className="flex items-center gap-2 text-gray-700 ">
        <ClasseAvatar moduleName={prop.name} width="40px" />
        <div className="">
          <p className="font-medium ">{prop.name}</p>
          {prop.students != null &&
          <p className="text-xs ">{`Élèves: ${prop.students != null ? prop.students.length : 0}`}</p>}
        </div>
      </div>
    );
    const initClasse = {
      name: "",
      sessions: 4,
      students: [{}, {}, {}, {}, {}],
      currentSession: 0,
      payment: "",
    };
    const [selectedClasse, setSelectedClasse] = useState(typeof props.classe === "undefined" ? initClasse : classesData.find((classe) => classe._id === props.classe));
    const [color, setColor] = useState(props.CategoryColor || "#5978ee");
    return (
      <div className="h-screen" style={{ backgroundColor: color }}>
        <DropDownListComponent
          id="name"
          name="name"
          itemTemplate={attendanceGridName}
          valueTemplate={attendanceGridName}
          value={selectedClasse.name}
          dataSource={classesData}
          change={(e) => {
            if (e.itemData != null) {
              setSelectedClasse(e.itemData);
              ipcRenderer.send("updateEvent", { Id: props.Id, classe: e.itemData._id });
              ipcRenderer.on("refreshEvent:update", (e, res) => {
                loadEvents();
              });
            }
          }}
          width="250px"
          floatLabelType="Always"
          popupHeight="400px"
          popupWidth="300px"
          fields={{ value: "name", text: "name", groupBy: "module" }}></DropDownListComponent>
        <div className="opacity-0 hover:opacity-100 active:opacity-100 inline-block">
          <ColorPickerComponent
            value={color}
            showButtons={false}
            beforeClose={(e) => ipcRenderer.send("updateEvent", { Id: props.Id, CategoryColor: color })}
            change={(e) => setColor(e.value)}></ColorPickerComponent>
        </div>
        <div className="ml-10 flex gap-4 text-gray-700">
          🕑 {moment(props.StartTime).format("HH:mm")} - {moment(props.EndTime).format("HH:mm")}
          <p className="font-semibold">{props.Subject}</p>
        </div>
        <div className="ml-14 text-gray-700 ">{props.Description}</div>
      </div>
    );
  };
  const dateHeaderTemplate = (props) => {
    const cureentTime = moment(props.date).format("dddd,  D MMMM YYYY");
    return <div className={`text-center text-lg text-gray-600 mx-8`}>{cureentTime.charAt(0).toUpperCase() + cureentTime.slice(1)}</div>;
  };

  function actionBegin(args) {}
  function actionComplete(args) {
    if (args.requestType === "eventCreated") {
      ipcRenderer.send("addEvent", args.addedRecords[0]);
      ipcRenderer.on("refreshEvent:add", (e, res) => {
        loadEvents();
      });
    }
    if (args.requestType === "eventChanged") {
      if (args.addedRecords.length > 0) {
        ipcRenderer.send("updateEvent", args.changedRecords[0]);
        ipcRenderer.send("addEvent", args.addedRecords[0]);
        ipcRenderer.on("refreshEvent:add", (e, res) => {
          loadEvents();
        });
      } else {
        ipcRenderer.send("updateEvent", args.data[0]);
        ipcRenderer.on("refreshEvent:update", (e, res) => {
          loadEvents();
        });
      }
    }
    if (args.requestType === "eventRemoved") {
      if (args.changedRecords.length > 0) {
        ipcRenderer.send("updateEvent", args.changedRecords[0]);
        ipcRenderer.on("refreshEvent:update", (e, res) => {
          loadEvents();
        });
      } else {
        ipcRenderer.send("deleteEvent", args.deletedRecords[0]);
        ipcRenderer.on("refreshEvent:delete", (e, res) => {
          loadEvents();
        });
      }
    }
  }
  function popupOpen(args) {}
  function popupClose(args) {}
  return (
    <div>
      <Wrapper>
        <ScheduleComponent
          startHour="08:00"
          endHour="19:00"
          height="650"
          allowKeyboardInteraction
          actionBegin={actionBegin}
          actionComplete={actionComplete}
          popupOpen={popupOpen}
          popupClose={popupClose}
          group={{ byDate: true, resources: ["Owners"] }}
          firstDayOfWeek={6}
          showQuickInfo={false}
          dateHeaderTemplate={dateHeaderTemplate}
          eventSettings={{ dataSource: eventsData, template: eventTemplate }}
          timeScale={{ enable: true, interval: 30, slotCount: 1 }}>
          <ResourcesDirective>
            <ResourceDirective
              field="resourceID"
              title="Salle"
              name="Owners"
              width="120"
              allowMultiple={true}
              dataSource={ownerData}
              textField="text"
              idField="id"
              colorField="color"></ResourceDirective>
          </ResourcesDirective>
          <ViewsDirective>
            <ViewDirective option="Day" />
            <ViewDirective option="Week" />
          </ViewsDirective>
          <Inject services={[Day, Week, Resize]} />
        </ScheduleComponent>
      </Wrapper>
    </div>
  );
}

const Wrapper = styled.div`
  .e-schedule .e-vertical-view.e-day-view .e-work-cells,
  .e-schedule .e-vertical-view.e-day-view .e-date-header-wrap table col,
  .e-schedule .e-vertical-view.e-day-view .e-content-wrap table col {
    width: 300px;
  }
  .e-schedule .e-vertical-view.e-week-view .e-work-cells,
  .e-schedule .e-vertical-view.e-week-view .e-date-header-wrap table col,
  .e-schedule .e-vertical-view.e-week-view .e-content-wrap table col {
    width: 300px;
  }
  .e-schedule .e-vertical-view .e-header-cells {
    height: 40px;
  }
  .e-schedule .e-vertical-view .e-date-header-wrap table tbody td {
    text-align: center;
  }
  .e-schedule .e-vertical-view .e-resource-cells {
    height: 30px;
    padding: 0;
  }
`;
