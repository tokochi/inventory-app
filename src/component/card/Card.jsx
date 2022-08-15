import React from 'react'
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 1.25rem;
  margin: 1.25rem;
  background-color: #ffffff;
  border-radius: 10px;

  --tw-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.16);
  --tw-shadow-colored: 1px 1px 5px 0 var(--tw-shadow-color);
  box-shadow: 0 0 #0000, 0 0 #0000, var(--tw-shadow);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
`;
export default function Card({children}) {
  return <Wrapper>{children}</Wrapper>;
}
