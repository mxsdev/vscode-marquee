import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';

// @ts-expect-error mock import
import { ModeProvider, _addMode } from '../../src/contexts/ModeContext';
import ModeAddDialog from '../../src/dialogs/ModeAddDialog';

jest.mock('../../src/contexts/ModeContext');

test('should render component', () => {
  const close = jest.fn();
  const { getByText } = render(<ModeProvider>
    <ModeAddDialog close={close} />
  </ModeProvider>);
  userEvent.keyboard('foobar');
  expect(_addMode).toBeCalledTimes(0);
  userEvent.click(getByText('Add'));
  expect(_addMode).toBeCalledWith('foobar', null);
  expect(close).toBeCalledTimes(1);
});