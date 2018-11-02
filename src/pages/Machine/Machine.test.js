import React from 'react';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store'

import Machine from './Machine';

configure({adapter: new Adapter()});

// create any initial state needed
const initialState = {};
const mockStore = configureStore();

describe('Machine', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(<Machine store={store}/>)
  });

  it('contains a betting button', () => {
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('Browser without web3 has a warning message', () => {
    expect(wrapper.find('.init-error').text()).toEqual('Couldn\'t load contract/web3 provider');
  });
});
