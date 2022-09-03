import { French } from "flatpickr/dist/l10n/fr.js";
import { useEffect, useRef } from "react";
import Flatpickr from "react-flatpickr";

function Datepicker({ align, mode, change, value, disabled, placeholder }) {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.flatpickr.altInput.disabled = disabled;
  }, [disabled]);
  const options = {
    locale: {
      ...French,
    },
    mode: mode, // "single", "multiple", or "range"
    // enableTime: true,
    static: true,
    monthSelectorType: "static",
    dateFormat: "j M, Y",
    altInput: true,
    rangeSeparator: " **",
    defaultDate: [new Date().setDate(new Date().getDate() - 6), new Date()],
    prevArrow: '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow: '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr.replace("au", "-");
      const customClass = align ? align : "";
      instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
    },
    onChange: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr.replace("au", "-");
    },
  };

  return (
    <div className="relative w-[120px]">
      <Flatpickr
        ref={inputRef}
        placeholder={placeholder}
        onChange={change}
        disable
        value={value}
        className="form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300 w-60"
        options={options}
      />
      <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
        <svg className="w-4 h-4 fill-current text-slate-500 ml-3" viewBox="0 0 16 16">
          <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
        </svg>
      </div>
    </div>
  );
}

export default Datepicker;
