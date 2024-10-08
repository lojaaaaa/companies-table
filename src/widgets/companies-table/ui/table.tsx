import { 
  useCallback, 
  useEffect, 
  useRef, 
  useState
} from 'react'

import { 
  selectCompaniesData, 
  selectCompaniesIsLoading, 
  deleteCompanies, 
  getCompanies 
} from '@/entities/company'

import { AddCompanyDialog } from '@/features/add-company/ui/dialog'
import { PER_PAGE } from '@/shared/config/constants'
import { useAppDispatch, useAppSelector, useDebouncedFetch, useObserver, useVirtualizedList } from '@/shared/lib/hooks'
import { Loader, Button } from '@/shared/ui'

import { TableHead } from './table-head'
import { TableBody } from './table-body';

const rowHeight = 73;
const visibleRows = +PER_PAGE;

export const CompaniesTable = () => {
  const { items: companies, totalPages } = useAppSelector(selectCompaniesData);
  const isLoading = useAppSelector(selectCompaniesIsLoading);
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const lastElement = useRef<HTMLDivElement | null>(null);

  const handleSelectAllChange = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds([]);
      setIsAllSelected(false);
    } else {
      setSelectedIds(companies.map(company => company.id));
      setIsAllSelected(true);
    }
  }, [isAllSelected, companies]);

  const handleSelectChange = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSelectedIds = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      setIsAllSelected(newSelectedIds.length === companies.length);
      return newSelectedIds;
    });
  }, [companies.length]);

  const handleDeleteClick = () => {
    if (selectedIds.length) {
      dispatch(deleteCompanies(selectedIds));
      setSelectedIds([]);
    }
  };

  const { 
    visibleItems: visibleCompanies, 
    topHeight, 
    bottomHeight, 
    handleScroll 
  } = useVirtualizedList(companies, rowHeight, visibleRows);

  useObserver(
    lastElement, 
    page < totalPages, 
    isLoading, 
    () => setPage((prev) => prev + 1)
  );

  useDebouncedFetch(page, () => getCompanies({ _page: String(page), _limit: PER_PAGE }));

  useEffect(() => {
    if (isAllSelected) {
      setSelectedIds(prev => [
        ...prev, 
        ...companies.filter(company => !prev.includes(company.id)).map(company => company.id)
      ]);
    }
  }, [companies, isAllSelected]);

  useEffect(() => {
    if (!page) {
      setPage(1);
    }
  }, [page]);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 mb-4'>
          <Button onClick={handleDeleteClick} disabled={selectedIds.length === 0}>
            Удалить все выбранные
          </Button>
          <AddCompanyDialog setPage={setPage} />
        </div>
        {companies.length > 0 &&  <h3>Количество: {companies.length}</h3>}
      </div>

      <div className='relative' >
        <div style={{ height: rowHeight * visibleRows + 1, overflow: 'auto' }} onScroll={handleScroll}>
          <table>
            <TableHead isAllSelected={isAllSelected} onSelectAllChange={handleSelectAllChange} />
            <div style={{ height: topHeight }} />
            
            <TableBody items={visibleCompanies} selectedIds={selectedIds} onSelectChange={handleSelectChange} />

            <div style={{ height: bottomHeight }} />  
          </table>
          {isLoading && <Loader className="mt-8 mx-auto" />}
          {!isLoading && companies.length === 0 && <p className='text-center'>Таблица пустая</p>}
          <div ref={lastElement} style={{ height: '20px', margin: '20px 0' }} />
        </div>
      </div>

    </div>
  );
};
