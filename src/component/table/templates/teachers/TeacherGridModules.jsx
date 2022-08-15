import React from 'react'

export default function TeacherGridModules(props) {
  return (
    <div className="flex gap-1 ">
      {props.modules != null && props.modules.length > 1 ? (
        props.modules.map((item, index) => (
          <p key={index} className="px-2 text-center bg-blue-50 rounded-3xl">
            {item}
          </p>
        ))
      ) : (
        <p className="px-2 text-center bg-blue-50 rounded-3xl"> {props.modules}</p>
      )}
    </div>
  );
}
