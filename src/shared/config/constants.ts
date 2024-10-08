export const PER_PAGE = '10';

export const API_COMPANIES = import.meta.env.VITE_BASE_URL + '/companies';

export enum ErrorMessages {
  CREATE_COMPANY_ERROR = 'Ошибка добавления компании',
  GET_COMPANIES_ERROR = 'Ошибка получения списка компаний',
  EDIT_COMPANY_ERROR = 'Ошибка редактирования компании',
  DELETE_COMPANIES_ERROR = 'Ошибка удаления компаний',
};