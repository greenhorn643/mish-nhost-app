import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
`

export const Input = styled.input`
  width: 100%;
  border-width: 1px;
  border-radius: 0.375rem;
  border-color: rgb(209, 213, 219);
  padding: 0.75rem;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  &:focus {
    border-color: rgb(59, 130, 246);
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 calc(4px) rgba(59, 130, 246, 0.2), 0 0 #0000;
    transition-property: border-color, box-shadow;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:read-only {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:read-only:focus {
    border-color: rgb(209, 213, 219);
    box-shadow: none;
  }
`

export const Label = styled.label`
  color: rgb(55, 65, 81);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
`