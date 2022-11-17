import { Container, Label, Input, Card } from '../components/styles/Organization.styled'
import { SnapchatAccount as SnapchatAccountT } from '../types/SnapchatAccount'

interface Props {
  account: SnapchatAccountT
}

const SnapchatAccount = (props: Props) => {
  const { account } = props
  return (
    <Container>
      <Card>
        <Label>Snap Name</Label>
        <Input type='text' defaultValue={account.snap_name} readOnly/>
      </Card>
    </Container>
  );
};

export default SnapchatAccount