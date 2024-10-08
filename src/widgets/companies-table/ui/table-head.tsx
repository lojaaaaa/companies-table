import { Checkbox } from '@/shared/ui/checkbox'
import { memo } from 'react'

interface TableHeadProps {
  isAllSelected: boolean;
  onSelectAllChange: any;
}

export const TableHead = memo(({ isAllSelected, onSelectAllChange }: TableHeadProps) => {
  return (
    <thead className='bg-gray-200 sticky top-0 h-[73px] z-10'>
      <tr>
        <th>
          <Checkbox
            className="align-middle" 
            id="checkboxAll" 
            checked={isAllSelected} 
            onCheckedChange={onSelectAllChange} 
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
  )
});
