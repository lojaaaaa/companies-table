import { debounce, throttle } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { RootState } from 'src/app/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useObserver = (
  lastElement: React.RefObject<HTMLDivElement>, 
  canLoad: boolean, 
  isLoading: boolean, 
  cb: () => void
) => {

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && canLoad) {
        cb();
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (lastElement.current) {
      observer.current.observe(lastElement.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };

  }, [isLoading]);
};

export const useVirtualizedList = <T>(items: T[], rowHeight: number, visibleRows: number) => {
  const [start, setStart] = useState(0);

  const topHeight = useMemo(() => (items.length ? rowHeight * start : 0), [start, rowHeight, items.length]);
  const bottomHeight = useMemo(
    () => (items.length ? rowHeight * (items.length - (start + visibleRows)) : 0),
    [start, items.length, rowHeight, visibleRows]
  )

  const handleScroll = useCallback(throttle((e: any) => {
    const scrollTop = e.target.scrollTop;
    const newStart = Math.min(items.length - visibleRows, Math.floor(scrollTop / rowHeight));
    if (!items.length) {
      setStart(0);
    } else {
      setStart(newStart);
    }
  }, 100), [items.length, visibleRows, rowHeight]);

  useEffect(() => {
    return () => {
      handleScroll.cancel();
    };
  }, [handleScroll]);

  const visibleItems = useMemo(() => items.slice(start, start + visibleRows + 1), [items, start, visibleRows]);

  return {
    visibleItems,
    topHeight,
    bottomHeight,
    handleScroll,
  };
};

export const useDebouncedFetch = (page: number, callback: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      dispatch(callback())
    }, 300);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [page, dispatch]);
};