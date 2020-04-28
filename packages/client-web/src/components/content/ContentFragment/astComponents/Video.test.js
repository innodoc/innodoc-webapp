import React from 'react'
import { shallow } from 'enzyme'
import { Typography } from 'antd'

import Video, { StaticVideo, YouTubeVideo } from './Video'

jest.mock('react-redux', () => ({
  useSelector: () => ({
    language: 'en',
    staticRoot: 'https://cdn.example.com/',
  }),
}))

describe('<Video />', () => {
  it.each([
    ['static', undefined, StaticVideo],
    ['YouTube', 'video-youtube', YouTubeVideo],
  ])('should render %s video', (type, cls, VideoComponent) => {
    const data = [[null, ['video', cls], []], null, ['video-url', 'Foo video']]
    const wrapper = shallow(<Video data={data} />)
    const videoComponent = wrapper.find(VideoComponent)
    expect(videoComponent.prop('src')).toBe(data[2][0])
    if (type === 'YouTube') {
      expect(videoComponent.prop('title')).toBe(data[2][1])
    }
  })
})

describe('<StaticVideo />', () => {
  it.each([
    ['test.mp4', 'https://cdn.example.com/test.mp4'],
    ['/test.mp4', 'https://cdn.example.com/test.mp4'],
    ['https://example.com/test.mp4', 'https://example.com/test.mp4'],
  ])('should render (%s)', (src, expectedSrc) => {
    const wrapper = shallow(<StaticVideo src={src} />)
    expect(wrapper.find('video').prop('src')).toBe(expectedSrc)
  })
})

describe('<YouTubeVideo />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <YouTubeVideo
        src="https://www.youtube.com/watch?v=Jqqwh0oTWpo"
        title="TU Berlin"
      />
    )
    const iframe = wrapper.find('iframe')
    const iframeSrc = iframe.prop('src')
    expect(iframeSrc).toMatch('https://www.youtube.com/embed/')
    expect(iframeSrc).toMatch('hl=en')
    expect(iframeSrc).toMatch('Jqqwh0oTWpo')
    expect(iframe.prop('title')).toBe('TU Berlin')
  })

  it('should not render with invalid video URL', () => {
    const wrapper = shallow(
      <YouTubeVideo src="https://vimeo.com/119230629" title="Broken URL" />
    )
    expect(wrapper.exists('iframe')).toBe(false)
    const errorMsg = wrapper.find(Typography.Text)
    expect(errorMsg.prop('type')).toBe('danger')
    expect(errorMsg.children().text()).toMatch(/error/i)
  })
})
