import React from 'react';
import { render } from '@testing-library/react';
import app from './app';

test('renders learn react link', () => {
  const { getByText } = render(<app />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
