import { useState } from 'react';

import { createCompany } from '@/entities/company';
import { useAppDispatch } from '@/shared/lib/hooks';

import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader, 
  DialogTrigger, 
  DialogFooter,
  Input,
  Button
} from '@/shared/ui';


interface AddCompanyDialogProps {
  setPage: (page: number) => void;
};

export const AddCompanyDialog = ({ setPage }: AddCompanyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const dispatch = useAppDispatch();

  const handleCreateClick = () => {
    if (name && address) {
      dispatch(createCompany({ name, address }));

      setPage(0);
      setOpen(false);
      clearForm();
    } else {
      setIsError(true);
      setError('Заполните поля');
    }
  };

  const handleCloseClick = () => {
    setOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setAddress('');
    setIsError(false);
    setError('');
  };

  const handleInputChange = (field: 'name' | 'address', value: string) => {
    if (field === 'name') {
      setName(value)
    }

    if (field === 'address') {
      setAddress(value)
    }
    
    if (isError && name && address) {
      setIsError(false);
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>Добавить компанию</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Новая компания</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            id="name"
            placeholder="Название компании"
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="border text-left"
          />
          <Input
            id="address"
            placeholder="Адрес компании"
            value={address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="border text-left"
          />
          {isError && <p className="text-center text-red-400">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={handleCloseClick}>Отмена</Button>
          <Button onClick={handleCreateClick}>Добавить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
