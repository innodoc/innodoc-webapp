import PropTypes from 'prop-types'
import { Col, Row, Progress, Typography } from 'antd'

import css from './Progress.module.sss'

const format = (p) => `${p} %`

const ChapterPieChart = ({ description, disabled, percent, status, title, wideLayout }) => (
  <Col xs={24} sm={24} md={8}>
    <Row justify="space-between" align="middle" gutter={[0, wideLayout ? 0 : 16]}>
      <Col className={css.centerCol} xs={8} sm={6} md={24}>
        <Progress
          format={format}
          type="circle"
          percent={percent}
          showInfo={!disabled}
          status={status}
          width={wideLayout ? undefined : 100}
        />
      </Col>
      <Col className={wideLayout ? css.wide : null} xs={16} sm={18} md={24}>
        <Typography.Text strong>{title}</Typography.Text>
        <br />
        {description}
      </Col>
    </Row>
  </Col>
)

ChapterPieChart.defaultProps = {
  description: '',
  disabled: false,
  status: 'normal',
  percent: 0,
}

ChapterPieChart.propTypes = {
  description: PropTypes.node,
  disabled: PropTypes.bool,
  percent: PropTypes.number,
  status: PropTypes.oneOf(['normal', 'success', 'exception']),
  title: PropTypes.string.isRequired,
  wideLayout: PropTypes.bool.isRequired,
}

export default ChapterPieChart
