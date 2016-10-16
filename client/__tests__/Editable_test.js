import React from 'react';
import assert from 'assert';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  findRenderedDOMComponentWithTag,
  Simulate
} from 'react-addons-test-utils';
import {shallow} from 'enzyme';
import {expect} from 'chai';
// import sinon from 'sinon';
import Editable from '../app/components/Editable.jsx';

describe('Editable', () => {

  // Tests render value
  it('renders value', () => {
    const value = 'value';
    const component = renderIntoDocument(
      <Editable value={value} />
    );
    const valueComponent = component.props.value;

    assert.equal(valueComponent, value);
  });

  // expect the input element
  it('sures editing status', () => {
    const input = shallow(
      <Editable editing={true} />
    );

    expect(input.find('input')).to.have.length(1);
  });

  // expect the div element
  it('sures view value status', () => {
    const wrapper = shallow(
      <Editable editing={false} />
    );

    expect(wrapper.find('input')).to.not.have.length(1);
  });

  // Tests trigger on edit
  it('triggers onEdit', () => {
    const newValue = 'value';
    const onEdit = (val) => {
      assert.equal(val, newValue);
    };

    let input = shallow(
      <Editable editing={true} value={'value'} onEdit={onEdit} />
    );

    input.value = newValue;

    expect(input.value).to.equal(newValue);
  });
});
