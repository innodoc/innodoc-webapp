import React from 'react'
import PropTypes from 'prop-types'
import { Container, Segment, Grid, Image, List, Header } from 'semantic-ui-react'
import { translate, Trans } from 'react-i18next'

import css from './style.sass'

const Footer = ({ t }) => (
  <Segment inverted vertical className={css.footerSegment}>
    <Container>
      <Grid divided inverted stackable>
        <Grid.Row>
          <Grid.Column width={4}>
            <Header inverted as="h4" content={t('footer.course')} />
            <List link inverted>
              <List.Item as="a" content={t('footer.viewIndex')} />
              <List.Item as="a" content={t('footer.displayOfFormulas')} />
            </List>
            <Header inverted as="h4" content={t('footer.aboutThisProject')} />
            <List link inverted>
              <List.Item as="a" content={t('footer.courseInformation')} />
              <List.Item as="a" content={t('footer.contact')} />
              <List.Item as="a" content={t('footer.authors')} />
              <List.Item as="a" content={t('footer.imprint')} />
              <List.Item as="a" content={t('footer.liability')} />
            </List>
          </Grid.Column>
          <Grid.Column width={7}>
            <Header as="h4" inverted>{t('footer.license')}</Header>
            <p>
              <Trans i18nKey="footer.licensePhrase">
                License: <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">License</a>
              </Trans>
            </p>
            <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">
              <Image.Group size="mini">
                <Image src="/static/img/cc-by-sa/cc-icon-white-x2.png" />
                <Image src="/static/img/cc-by-sa/attribution-icon-white-x2.png" />
                <Image src="/static/img/cc-by-sa/sa-white-x2.png" />
              </Image.Group>
            </a>
          </Grid.Column>
          <Grid.Column width={5}>
            <Header as="h4" inverted>{t('footer.institutions')}</Header>
            <p>
              <Trans i18nKey="footer.projectPhrase">
                Project link: <a href="http://www.ve-und-mint.de/" target="_blank" rel="noopener noreferrer">Project name</a>
              </Trans>
            </p>
            <p>{t('footer.institutionsPhrase')}</p>
            <p>TODO</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Segment>
)
Footer.propTypes = {
  t: PropTypes.func.isRequired,
}

export default translate()(Footer)
