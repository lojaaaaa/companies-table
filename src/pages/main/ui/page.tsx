import { CompaniesTable } from "@/widgets/companies-table";

export const Main = () => {

  return (
    <div className="pt-12">
      <h1 className="text-center text-4xl mb-8">Список компаний</h1>
      <CompaniesTable />
    </div>
  )
}
