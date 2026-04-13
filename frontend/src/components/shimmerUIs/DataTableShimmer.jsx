const DataTableShimmer = ({ rowCount = 5, columnCount = 4 }) => {
  return (
    <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="relative w-full overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm border-collapse">
          {/* Matching Header Styling */}
          <thead className="bg-muted/50 border-b">
            <tr>
              {Array.from({ length: columnCount }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Matching Body Styling */}
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b last:border-0">
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-4 align-middle">
                    <div 
                      className={`h-4 bg-muted animate-pulse rounded ${
                        // Varying widths for a more realistic "text" look
                        colIndex === 0 ? "w-12" : colIndex === 1 ? "w-full" : "w-20"
                      }`} 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableShimmer;