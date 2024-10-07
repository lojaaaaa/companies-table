import { editCompany } from '@/entities/company/api';
import { useAppDispatch } from '@/shared/lib/hooks';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react'

interface RowProps {
  id: string;
  name: string;
  address: string;
  isSelected: boolean;
  handleSelectChange: any;
}

export const Row = ({ id, name, address, isSelected, handleSelectChange }: RowProps) => {

  console.log('render')

  const dispatch = useAppDispatch();

  const [rowName, setName] = useState(name);
  const [rowAddress, setAddress] = useState(address);

  const handleDebouncedChange = useCallback(
    debounce((id: string, field: 'name' | 'address', value: string) => {
      dispatch(editCompany({ id, field, value }));
    }, 500), 
    []
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    handleDebouncedChange(id, 'name', value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    handleDebouncedChange(id, 'address', value);
  };

  return (
    <tr 
      className="align-middle" 
      key={id} 
      style={{
        backgroundColor: isSelected ? 'rgba(190, 207, 245, 0.2)' : '',
      }}
    >
      <td>
        <Checkbox 
          className="align-middle" 
          id={`checkbox-${id}`} 
          checked={isSelected} 
          onCheckedChange={() => handleSelectChange(id)} 
        />
      </td>
      <td>
        <Input 
          value={rowName} 
          onChange={handleNameChange} 
        />
      </td>
      <td>
        <Input 
          value={rowAddress} 
          onChange={handleAddressChange} 
        />
      </td>
    </tr>
  )
}
