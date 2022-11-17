import { Container, Label, Input as SInput } from '../components/styles/Input.styled'

const Input = ({ type = 'text', label = '', ...props }) => {
  return (
    <Container>
      {label ? <Label>{label}</Label> : null}
      <SInput {...props} type={type}/>
    </Container>
  )
}

export default Input