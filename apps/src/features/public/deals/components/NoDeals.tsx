const NoDeals = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
          </svg>
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            No Deals Available
          </h3>
          <p className="text-[13px] text-gray-500">
            There are currently no active deals available.
          </p>
        </div>
    );
}

export default NoDeals;