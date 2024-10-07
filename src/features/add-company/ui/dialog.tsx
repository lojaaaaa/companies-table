import { createCompany } from '@/entities/company/api';
import { useAppDispatch } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader, 
  DialogTrigger, 
  DialogFooter
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';

export const AddCompanyDialog = () => {
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const dispatch = useAppDispatch();

  const handleCreateClick = () => {
    if (name && address) {
      // Отправка данных на сервер
      dispatch(createCompany({ name, address }));

      // Закрытие модалки и сброс полей
      setOpen(false);
      clearForm();
    } else {
      // Установка сообщения об ошибке
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
