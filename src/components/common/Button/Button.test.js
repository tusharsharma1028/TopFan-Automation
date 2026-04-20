import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renders primary variant by default', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('primary');
  });

  test('renders different variants correctly', () => {
    const { container, rerender } = render(<Button variant="secondary">Click me</Button>);
    let button = container.querySelector('button');
    expect(button).toHaveClass('secondary');

    rerender(<Button variant="success">Click me</Button>);
    button = container.querySelector('button');
    expect(button).toHaveClass('success');
  });

  test('renders different sizes correctly', () => {
    const { container, rerender } = render(<Button size="small">Click me</Button>);
    let button = container.querySelector('button');
    expect(button).toHaveClass('small');

    rerender(<Button size="large">Click me</Button>);
    button = container.querySelector('button');
    expect(button).toHaveClass('large');
  });

  test('renders full width button', () => {
    const { container } = render(<Button fullWidth>Click me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('fullWidth');
  });

  test('has correct button type', () => {
    const { container, rerender } = render(<Button type="submit">Submit</Button>);
    let button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'submit');

    rerender(<Button type="button">Button</Button>);
    button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
