import React from 'react'

export default function TeacherGridLevels(props) {
  return (
    <div className="flex gap-1 ">
      {props.levels != null && props.levels.length > 1 ? (
        props.levels.map((item, index) => (
          <p key={index} className="px-2 text-center bg-blue-50 rounded-3xl">
            {item}
          </p>
        ))
      ) : (
        <p className="px-2 text-center bg-blue-50 rounded-3xl"> {props.levels}</p>
      )}
    </div>
  );
}
