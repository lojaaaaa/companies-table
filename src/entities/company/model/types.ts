export interface ICompany {
  id: string;
  name: string;
  address: string;
};

export interface CompanyState {
  data: {
    items: ICompany[],
    totalPages: number;
  };
  isLoading: boolean;
};