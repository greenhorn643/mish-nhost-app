import { Container, Label, Input, Card } from '../styles/OAuthApp.styled'

interface Props {
  app_name: string,
  snap_client_id: string,
  snap_redirect_uri: string,
}

const OAuthApp = (props: Props) => {
  const { app_name, snap_client_id, snap_redirect_uri } = props
  return (
    <Container>
      <Card>
        <Label>App Name</Label>
        <Input type='text' defaultValue={app_name} readOnly/>
        <Label>Snap Client Id</Label>
        <Input type='text' defaultValue={snap_client_id} readOnly/>
        <Label>Redirect URI</Label>
        <Input type='text' defaultValue={snap_redirect_uri} readOnly/>
      </Card>
    </Container>
  );
};

export default OAuthApp