import { useEffect, useState } from "react";

export default function Unit8Table() {
  const [table, setTable] = useState<string[]>();
  const getData = () => {
    const buffer = new ArrayBuffer(255);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < 255; i++) {
      view[i] = i;
    }
    const file = new File([buffer], "s.txt");

    const reader = new FileReader();
    reader.onload = () => {
      const s = reader.result;
      if (typeof s === "string") {
        const arr = s.split("");
        setTable(arr);
      }
    };
    reader.readAsText(file);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="h-[100sh]">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-[70vh] overflow-scroll">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Number
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Respond
                  <a href="/">
                    <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </a>
                </div>
              </th>
            </tr>
          </thead>
          {table &&
            table.map((ch, index) => {
              return (
                <>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <td className="px-6 py-4">{index}</td>
                      <td className="px-6 py-4">{ch}</td>
                    </tr>
                  </tbody>
                </>
              );
            })}
        </table>
      </div>
    </div>
  );
}
