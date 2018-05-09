import React from 'react'
import {Container, Segment, Grid, Image, List, Header} from 'semantic-ui-react'

import css from './style.sass'

const Footer = () => (
  <Segment inverted vertical className={css.footerSegment}>
    <Container>
      <Grid divided inverted stackable>
        <Grid.Row>
          <Grid.Column width={4}>
            <Header inverted as="h4" content="Kurs" />
            <List link inverted>
              <List.Item as="a">Stichwortliste</List.Item>
              <List.Item as="a">Formeldarstellung</List.Item>
            </List>
            <Header inverted as="h4" content="Über dieses Projekt" />
            <List link inverted>
              <List.Item as="a">Kursinformationen</List.Item>
              <List.Item as="a">Kontakt</List.Item>
              <List.Item as="a">Autor*innen</List.Item>
              <List.Item as="a">Impressum</List.Item>
              <List.Item as="a">Haftungsausschluss</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={7}>
            <Header as="h4" inverted>Lizenz</Header>
            <p>
              Die Bestandteile dieses Kurses stehen unter der <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">
              Creative Commons License CC BY-SA 3.0</a> und können kopiert oder nach
              Bearbeitung weiterverwendet werden solange  Ursprung
              (dieser Kurs) zitiert wird.
            </p>
            <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">
              <Image.Group size="tiny">
                <Image src="/static/img/cc-by-sa/cc-icon-white-x2.png" centered />
                <Image src="/static/img/cc-by-sa/attribution-icon-white-x2.png" />
                <Image src="/static/img/cc-by-sa/sa-white-x2.png" />
              </Image.Group>
            </a>
          </Grid.Column>
          <Grid.Column width={5}>
            <Header as="h4" inverted>Mitwirkende</Header>
            <p>
              Dieser Kurs wurde im Rahmen des <a href="http://www.ve-und-mint.de/" target="_blank" rel="noopener noreferrer">VE&MINT-Projekts</a> entwickelt.
            </p>
            <p>
              Die folgenden Institutionen waren an der Entwicklung beteiligt:
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Segment>
)

export default Footer
