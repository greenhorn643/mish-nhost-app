import { Container, Label, Button, Card } from './styles/OAuthApp.styled'
import { PlusCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { UrlObject } from 'url'

interface Props {
  label: string,
  href: UrlObject | string,
}

const Add = ({ label, href }: Props) => {
  return (
    <Container>
      <Card>
        <Label>{label}</Label>
        <Link href={href}>
          <Button>
            <PlusCircleIcon height={20} color='grey'/>
          </Button>
        </Link>
      </Card>
    </Container>
  );
};

export default Add