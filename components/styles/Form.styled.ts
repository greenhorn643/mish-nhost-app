import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
  }
`

export const Info = styled.div`
  > h2 {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  > p {
    margin-top: 0.25rem;
    color: rgb(107, 114, 128);
    line-height: 1.25;
  }
`

export const Card = styled.div`
  width: 100%;
  max-width: 768px;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
  border-width: 1px;
  border-radius: 0.375rem;
  border-color: rgba(229, 231, 235, 0.5);
  box-shadow: 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
`

export const FormFields = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  > * + * {
    margin-top: 1.5rem;
  }
  @media (min-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`

export const FormFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background-color: rgb(249, 250, 251);
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  @media (min-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`

export const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`

export const InputEmailWrapper = styled.div`
  @media (min-width: 640px) {
    max-width: 28rem;
  }
`

export const Button = styled.button`
  color: rgb(255, 255, 255);
  background-color: rgb(55, 65, 81);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.375rem;
  /* transition */
  transition-property: color, background-color, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  &:hover {
    background-color: rgb(75, 85, 99);
  }
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 calc(4px) rgb(55 65 81 / 0.2), 0 0 #0000;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:disabled:hover {
    background-color: rgb(55, 65, 81);
  }
`