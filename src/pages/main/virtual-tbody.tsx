import { useState } from 'react';

const itemHeight = 35; // Adjustable глобальная переменная
const windowHeight = 1000; // Adjustable глобальная переменная
const overscan = 20; // Количество дополнительных элементов для рендера до и после видимого диапазона

interface Company {
  name: string;
  address: string;
}

export const VirtualizedTbody = ({
  companies,
}: {
  companies: Company[];
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const numberOfItems = companies.length;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  let renderedNodesCount = Math.floor(windowHeight / itemHeight) + 2 * overscan;
  renderedNodesCount = Math.min(numberOfItems - startIndex, renderedNodesCount);

  const generateRows = () => {
    let rows: JSX.Element[] = [];
    for (let i = 0; i < renderedNodesCount; i++) {
      const index = i + startIndex;
      if (index >= numberOfItems) break;
      rows.push(<TableRow key={index} company={companies[index]} index={index} />);
    }
    return rows;
  };

  return (
    <tbody
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      className="overflow-y-scroll"
      style={{
        position: 'relative',
        height: `${windowHeight}px`,
      }}
    >
      <tr
        style={{
          transform: `translateY(${startIndex * itemHeight}px)`,
        }}
      />
      {generateRows()}
    </tbody>
  );
};

const TableRow = ({ company, index }: { company: Company; index: number }) => {
  return (
    <tr
      style={{
        height: `${itemHeight}px`,
        backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
      }}
      className="text-center w-full"
    >
      <td className="border p-2">{index}</td>
      <td className="border p-2">{company.name}</td>
      <td className="border p-2">{company.address}</td>
    </tr>
  );
};
