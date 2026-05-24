import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Створюємо інтерфейс для пропсів (властивостей) компонента
interface TournamentCardProps {
  title: string;
  status: string;
  category: string;
}

// Передаємо тип у компонент
const TournamentCard = ({ title, status, category }: TournamentCardProps) => (
  <div data-testid="tournament-card" className="card">
    <h3 data-testid="card-title">{title}</h3>
    <span data-testid="card-status">Статус: {status}</span>
    <span data-testid="card-category">Категорія: {category}</span>
    <button data-testid="details-button">Перейти до турніру</button>
  </div>
);

describe('Frontend UI-Testing: TournamentCard Component (Next.js)', () => {
  
  const mockProps: TournamentCardProps = {
    title: 'Кубок Університету 2026',
    status: 'РЕЄСТРАЦІЯ ВІДКРИТА',
    category: 'Студентська ліга'
  };

  it('компонент картки турніру повинен успішно відрендеритися в DOM', () => {
    render(<TournamentCard {...mockProps} />);
    const cardElement = screen.getByTestId('tournament-card');
    expect(cardElement).toBeInTheDocument();
  });

  it('повинен коректно відображати назву турніру з переданих властивостей (props)', () => {
    render(<TournamentCard {...mockProps} />);
    const titleElement = screen.getByTestId('card-title');
    expect(titleElement).toHaveTextContent('Кубок Університету 2026');
  });

  it('повинен правильно відображати поточний статус змагання', () => {
    render(<TournamentCard {...mockProps} />);
    const statusElement = screen.getByTestId('card-status');
    expect(statusElement).toHaveTextContent('Статус: РЕЄСТРАЦІЯ ВІДКРИТА');
  });

  it('повинен містити інтерактивну кнопку для переходу на сторінку деталей', () => {
    render(<TournamentCard {...mockProps} />);
    const button = screen.getByTestId('details-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Перейти до турніру');
    expect(button).not.toBeDisabled();
  });
});