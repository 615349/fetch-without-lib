import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('contains h3', () => {
    expect(wrapper.find('h3').text()).toEqual('coins:');
  });

  it('should mock fetch successfully', (done) => {
    const mockSuccessResponse = [{
      id: 'bitcoin',
      name: 'bitcoin',
      price_usd: 1
    }];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: true
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    wrapper.instance().fetchData().then(() => {
      expect(wrapper.state()).toEqual({
        hasError: false,
        coins: mockSuccessResponse
      });
      global.fetch.mockClear();
      done();
    });
  });

  it('should mock fetch failure', (done) => {
    const mockFetchPromise = Promise.resolve({
      ok: false
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    wrapper.instance().fetchData().then(() => {
      expect(wrapper.state()).toEqual({
        hasError: true,
        coins: []
      });
      global.fetch.mockClear();
      done();
    });
  });
});
