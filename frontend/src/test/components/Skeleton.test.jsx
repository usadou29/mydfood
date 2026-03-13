import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  SkeletonCard,
  SkeletonCardGrid,
  SkeletonTableRow,
  SkeletonTable,
  SkeletonProfile,
  SkeletonOrderList,
} from '../../components/Skeleton';

describe('Skeleton Components', () => {
  describe('SkeletonCard', () => {
    it('renders without crashing', () => {
      const { container } = render(<SkeletonCard />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('has animate-pulse elements', () => {
      const { container } = render(<SkeletonCard />);
      const pulseElements = container.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThan(0);
    });
  });

  describe('SkeletonCardGrid', () => {
    it('renders default 6 cards', () => {
      const { container } = render(<SkeletonCardGrid />);
      const cards = container.querySelectorAll('.bg-white.rounded-2xl');
      expect(cards.length).toBe(6);
    });

    it('renders custom count', () => {
      const { container } = render(<SkeletonCardGrid count={3} />);
      const cards = container.querySelectorAll('.bg-white.rounded-2xl');
      expect(cards.length).toBe(3);
    });
  });

  describe('SkeletonTable', () => {
    it('renders table with default rows and columns', () => {
      const { container } = render(<SkeletonTable />);
      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(5);
      const headerCols = container.querySelectorAll('thead th');
      expect(headerCols.length).toBe(6);
    });

    it('renders with custom rows and columns', () => {
      const { container } = render(<SkeletonTable rows={3} columns={4} />);
      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3);
      const headerCols = container.querySelectorAll('thead th');
      expect(headerCols.length).toBe(4);
    });
  });

  describe('SkeletonTableRow', () => {
    it('renders correct number of cells', () => {
      const { container } = render(
        <table><tbody><SkeletonTableRow columns={4} /></tbody></table>
      );
      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(4);
    });
  });

  describe('SkeletonProfile', () => {
    it('renders without crashing', () => {
      const { container } = render(<SkeletonProfile />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('has skeleton blocks for form fields', () => {
      const { container } = render(<SkeletonProfile />);
      const pulseElements = container.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThan(5);
    });
  });

  describe('SkeletonOrderList', () => {
    it('renders default 3 order skeletons', () => {
      const { container } = render(<SkeletonOrderList />);
      const cards = container.querySelectorAll('.bg-white.rounded-2xl');
      expect(cards.length).toBe(3);
    });

    it('renders custom count', () => {
      const { container } = render(<SkeletonOrderList count={5} />);
      const cards = container.querySelectorAll('.bg-white.rounded-2xl');
      expect(cards.length).toBe(5);
    });
  });
});
