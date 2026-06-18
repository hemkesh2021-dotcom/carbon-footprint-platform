import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

describe('UI Primitives Components', () => {
  describe('Button', () => {
    test('renders children correctly', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    test('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      fireEvent.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders disabled state and prevents clicks', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Click Me</Button>);
      const button = screen.getByRole('button', { name: 'Click Me' });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('renders loading state, shows spinner and prevents clicks', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} loading>Click Me</Button>);
      const button = screen.getByRole('button', { name: 'Click Me' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button.querySelector('svg')).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('ProgressBar', () => {
    test('renders progress percent and sets ARIA attributes', () => {
      render(<ProgressBar value={40} max={100} showLabel label="Test Progress" />);
      
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
      expect(progressbar).toHaveAttribute('aria-valuenow', '40');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
      expect(progressbar).toHaveAttribute('aria-label', 'Test Progress');
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    test('renders correctly with animated=false', () => {
      render(<ProgressBar value={40} max={100} showLabel label="Test Progress" animated={false} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
      expect(progressbar).toHaveAttribute('aria-valuenow', '40');
    });
  });
});
