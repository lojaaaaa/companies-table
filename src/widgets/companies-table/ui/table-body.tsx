import { Row } from './table-row';
import { ICompany } from '@/entities/company';

interface TableBodyProps {
  items: ICompany[];
  selectedIds: string[];
  onSelectChange: (id: string) => void;
};

export const TableBody = ({ items, selectedIds, onSelectChange }: TableBodyProps) => {
  return (
    <tbody 
    >
      {items.map(({ id, name, address }) => (
        <Row
          key={id}
          id={id}
          name={name}
          address={address}
          isSelected={selectedIds.includes(id)}
          onSelectChange={onSelectChange}
        />
      ))}
    </tbody>
  )
}
