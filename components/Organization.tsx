import { Container, Label, Input, Card } from '../components/styles/Organization.styled'

interface Props {
  organization_id: string,
  organization_name: string,
}

const Organization = (props: Props) => {
  const { organization_id, organization_name } = props
  return (
    <Container>
      <Card>
        <Label>Organization Name</Label>
        <Input type='text' defaultValue={organization_name} readOnly/>
        <Label>Organization Id</Label>
        <Input type='uuid' defaultValue={organization_id} readOnly/>
      </Card>
    </Container>
  );
};

export default Organization