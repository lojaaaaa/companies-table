import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { RootState } from 'src/app/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;