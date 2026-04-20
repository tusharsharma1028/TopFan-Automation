import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './App';

const renderWithProviders = (component) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(document.querySelector('.app')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/welcome to topfan automation/i)).toBeInTheDocument();
  });
});
