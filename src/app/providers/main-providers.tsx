
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

interface MainProvidersProps {
	children: ReactNode;
};

export const MainProviders = ({ children }: MainProvidersProps) => (
	<Provider store={store}>
		{children}
	</Provider>
);
