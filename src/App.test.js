import { render, screen } from '@testing-library/react';
import App from './App';

test('test general colors', () => {
  render(<App />);
  const primaryColor = screen.getByText(/General colors/i);
  expect(primaryColor).toBeInTheDocument();
});

test('test global size', () => {
  render(<App />);
  const primaryColor = screen.getByText(/Global sizes/i);
  expect(primaryColor).toBeInTheDocument();
});

test('test text field', () => {
  render(<App />);
  const primaryColor = screen.getByText(/Text field/i);
  expect(primaryColor).toBeInTheDocument();
});
