const DataTable = ({ data, columns, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border bg-white shadow">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                {col.header}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id}>
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-800">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              <td className="px-6 py-4 text-right text-sm space-x-4">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;