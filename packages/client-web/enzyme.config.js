/* eslint import/no-extraneous-dependencies: "off" */
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { act } from 'react-dom/test-utils'

configure({ adapter: new Adapter() })

// Helper function: Give async operation time to finish
global.waitForComponent = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    wrapper.update()
  })
}

// Ant Design Form uses window.matchMedia()
// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
