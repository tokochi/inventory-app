import { createGlobalStyle } from "styled-components";
import { useStore } from "../contexts/Store";
export default createGlobalStyle`
.e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left).e-disabled,
.e-input-group input.e-input::placeholder,
.e-input-group textarea.e-input::placeholder {
 background-color: ${useStore.getState().theme.name === "dark" && "#40444B"} !important;
    color:${useStore.getState().theme.name === "dark" && "#dcddde"}  !important;
}
.e-dropdownbase .e-list-item {
background: ${useStore.getState().theme.name === "dark" && "#565B65"} !important;
color:${useStore.getState().theme.name === "dark" && "#dcddde"}  !important;
} 


.e-ddl.e-input-group.e-control-wrapper .e-input,
.e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left) {
 background-color: ${useStore.getState().theme.name === "dark" && "#40444B"} !important;
    color:${useStore.getState().theme.name === "dark" && "#dcddde"}  !important;
}

  .e-dlg-content {
    background-color: ${useStore.getState().theme.name === "dark" && "#2f3136"};
    color:${useStore.getState().theme.name === "dark" && "#eee"} ;
    border:${useStore.getState().theme.name === "dark" && "none"} !important;
  }
  .e-dialog {
    background-color: ${useStore.getState().theme.name === "dark" && "#2f3136"};
     color:${useStore.getState().theme.name === "dark" && "#eee"} ;
     border:${useStore.getState().theme.name === "dark" && "none"} !important;
  }
  .e-tab .e-tab-header .e-toolbar-item .e-close-icon{
    color:${useStore.getState().theme.name === "dark" && "#eee"} !important;
  }
  .e-tab .e-tab-header .e-toolbar-items, .e-tab .e-tab-header .e-toolbar-item .e-tab-wrap {
        background-color: ${useStore.getState().theme.name === "dark" && "#202225"}!important;
     color:${useStore.getState().theme.name === "dark" && "#eee"} !important;
     //border:${useStore.getState().theme.name === "dark" && "none"} !important;
  }

  .e-dialog .e-dlg-header-content{
background-color: ${useStore.getState().theme.name === "dark" && "#202225"};
border:${useStore.getState().theme.name === "dark" && "none"} !important;
  }
  .e-dialog .e-dlg-header-content .e-btn.e-dlg-closeicon-btn{
    background-color:${useStore.getState().theme.name === "dark" && "#dcddde"} ;

  }
    .e-dialog .e-dlg-header{
 color:${useStore.getState().theme.name === "dark" && "#fff"};
 border:${useStore.getState().theme.name === "dark" && "none"} !important;
  }
    .e-dialog .e-btn.e-flat {
 color:${useStore.getState().theme.name === "dark" && "#fff"};

  }
  .e-dialog .e-footer-content {
background-color: ${useStore.getState().theme.name === "dark" && "#202225"};
border:${useStore.getState().theme.name === "dark" && "none"} !important;
  }
   .e-grid {
    background-color: ${useStore.getState().theme.name === "dark" && "#202225"};
    color: white;
    border: none;
  }
  .e-toolbar .e-toolbar-items,
  .e-toolbar .e-tbar-btn {
    background-color: ${useStore.getState().theme.name === "dark" && "#202225"};
  }
  .e-grid .e-content {
    background-color: ${useStore.getState().theme.name === "dark" && "#202225"};
  }
  .e-grid .e-table tr td {
    background-color: ${useStore.getState().theme.name === "dark" && "#2f3136"};
    color: ${useStore.getState().theme.name === "dark" && "white"} !important;
  }
  .e-grid .e-gridheader,
  .e-grid .e-gridheader tr th {
    background-color: ${useStore.getState().theme.name === "dark" && "#202225"};
    border-bottom-color: ${useStore.getState().theme.name === "dark" && "#a5acb7"};
    border-top-color: ${useStore.getState().theme.name === "dark" && "#a5acb7"};
    color: ${useStore.getState().theme.name === "dark" && "#d9dadb"};
  }
  .e-toolbar .e-toolbar-items .e-toolbar-item .e-tbar-btn-text,
  .e-toolbar .e-toolbar-item .e-tbar-btn.e-btn .e-icons.e-btn-icon {
    color: ${useStore.getState().theme.name === "dark" && "white"};
  }
`;
