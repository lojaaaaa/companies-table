import { selectCompaniesData, selectCompaniesIsLoading } from '@/entities/company'
import { deleteCompanies, getCompanies } from '@/entities/company/api'
import { PER_PAGE } from '@/shared/config/constants'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { Checkbox } from '@/shared/ui/checkbox'
import { Loader } from '@/shared/ui/loader'
import { debounce } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Row } from './table-row'
import { Button } from '@/shared/ui/button'
import { AddCompanyDialog } from '@/features/add-company/ui/dialog'


export const CompaniesTable = () => {
  const { items: companies, totalPages } = useAppSelector(selectCompaniesData);
  const isLoading = useAppSelector(selectCompaniesIsLoading);
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElement = useRef<HTMLDivElement | null>(null);

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      setIsAllSelected(false);
    } else {
      // Иначе выбираем все загруженные элементы
      setSelectedIds(companies.map(company => company.id));
      setIsAllSelected(true);
    }
  };

  const handleSelectChange = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSelectedIds = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      setIsAllSelected(newSelectedIds.length === companies.length);
      return newSelectedIds;
    });
  }, [companies.length]);


  // Удаляем выбранные элементы
  const handleDeleteClick = () => {
    if (selectedIds.length) {
      dispatch(deleteCompanies(selectedIds));
      setSelectedIds([]);
    }
  };

  // Логика бесконечной прокрутки
  useEffect(() => {
    const debouncedFetch = debounce((page) => {
      dispatch(getCompanies({ _page: String(page), _limit: PER_PAGE }));
    }, 300);
  
    debouncedFetch(page);
  
    return () => {
      debouncedFetch.cancel();
    };
  }, [page]);

  // Автоматическое добавление новых компаний в выбор при подгрузке, если выбраны все
  useEffect(() => {
    if (isAllSelected) {
      setSelectedIds(prev => [
        ...prev, 
        ...companies.filter(company => !prev.includes(company.id)).map(company => company.id)
      ]);
    }
  }, [companies, isAllSelected]);

  useEffect(() => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setPage((prev) => prev + 1);
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

  const isRowSelected = (id: string) => selectedIds.includes(id);

  console.log(selectedIds)

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 mb-4'>
          <Button onClick={handleDeleteClick} disabled={selectedIds.length === 0}>
            Удалить все выбранные
          </Button>
          <AddCompanyDialog />
        </div>
        {companies.length > 0 &&  <h3>Количество: {companies.length}</h3>}
      </div>

      <table>
        <thead>
          <tr className='bg-gray-200'>
            <th>
              <Checkbox 
                className="align-middle" 
                id="checkboxAll" 
                checked={isAllSelected} 
                onCheckedChange={handleSelectAllChange} 
              />
            </th>
            <th>
              Компании
            </th>
            <th>
              Адреса
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map(({ id, name, address }) => (
            <Row
              key={id}
              id={id}
              name={name}
              address={address}
              isSelected={isRowSelected(id)}
              handleSelectChange={handleSelectChange}
            />
          ))}
        </tbody>
      </table>
      {isLoading && <Loader className="mt-8 mx-auto" />}
      {!isLoading && companies.length < 0 && <p className='text-center'>Таблица пустая</p>}
      <div ref={lastElement} style={{ height: '20px', margin: '20px 0' }} />
    </div>
  );
};
