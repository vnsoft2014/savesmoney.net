'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Check, ChevronDown, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Badge } from '@/shared/shadecn/ui/badge';
import { DealType, Store } from '@/shared/types';

type DealsFiltersProps = {
    dealTypes: DealType[];
    stores: Store[];
};

type Option = {
    value: string;
    label: string;
};

type FilterListboxProps = {
    value: string;
    options: Option[];
    placeholder: string;
    onChange: (value: string) => void;
};

const FilterListbox = ({ value, options, placeholder, onChange }: FilterListboxProps) => {
    const selected = options.find((o) => o.value === value);

    const columnSize = 12;

    const allOptions: Option[] = [{ value: '', label: placeholder }, ...options];

    const totalColumns = Math.ceil(allOptions.length / columnSize);

    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative min-w-35">
                <ListboxButton className="w-full px-3 py-2 text-[13px] bg-white border border-gray-400 rounded-full flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <span className="text-gray-900">{selected?.label || placeholder}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </ListboxButton>

                <ListboxOptions
                    className="
            absolute z-20 mt-2 pt-1 pb-3
            rounded-xl bg-white shadow-lg
            border border-gray-200
            text-[13px]

            grid grid-flow-col

            /* scroll */
            overflow-auto
            outline-none focus:outline-none
            ring-0 focus:ring-0

            /* mobile center */
            left-1/2 -translate-x-1/2
            w-[55vw] max-w-[320px]
            max-h-[70vh]

            /* desktop */
            sm:left-0 sm:translate-x-0
            sm:w-auto sm:max-w-none
            sm:max-h-80
          "
                    style={{
                        gridTemplateRows: `repeat(${columnSize}, minmax(0, 1fr))`,
                        width:
                            typeof window !== 'undefined'
                                ? window.innerWidth < 640
                                    ? '55vw'
                                    : `${Math.min(totalColumns, 3) * 180}px`
                                : `${Math.min(totalColumns, 3) * 180}px`,
                    }}
                >
                    {allOptions.map((option, index) => {
                        const currentColumn = Math.floor(index / columnSize);
                        const isLastColumn = currentColumn === totalColumns - 1;

                        return (
                            <ListboxOption
                                key={`${option.value}-${index}`}
                                value={option.value}
                                className={`
                  group relative h-7.5
                  cursor-pointer
                  px-3 pt-1 pb-2

                  transition-colors duration-150

                  ${!isLastColumn ? 'border-r border-gray-200' : ''}

                  hover:bg-orange-50 hover:text-orange-600
                  ui-active:bg-orange-50 ui-active:text-orange-600
                  ui-selected:bg-orange-100 ui-selected:text-orange-700
                `}
                            >
                                {({ selected }) => (
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate">{option.label}</span>
                                        {selected && <Check className="w-4 h-4 shrink-0" />}
                                    </div>
                                )}
                            </ListboxOption>
                        );
                    })}
                </ListboxOptions>
            </div>
        </Listbox>
    );
};

const DealsFilters = ({ dealTypes, stores }: DealsFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState({
        dealType: searchParams.get('dealType') || '',
        store: searchParams.get('store') || '',
    });

    const handleFilterChange = (name: string, value: string) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newFilters).forEach(([key, val]) => {
            if (val) {
                params.set(key, val);
            } else {
                params.delete(key);
            }
        });

        params.set('page', '1');
        startTransition(() => {
            router.push(`?${params.toString()}`, {
                scroll: false,
            });
        });
    };

    const hasActiveFilters = Object.keys(filters).some((val) => val !== '');

    return (
        <div className="flex flex-col-reverse lg:flex-row items-center gap-3 lg:gap-0 mt-2 md:mt-0 font-sans">
            {isPending && <span className="text-sm opacity-60">Updating…</span>}
            {hasActiveFilters && (
                <div className="flex justify-end flex-wrap gap-2 mr-3">
                    {filters.dealType && (
                        <Badge
                            variant="secondary"
                            className="bg-orange-100 font-normal text-sm text-orange-600 hover:bg-orange-100 border-none px-3 py-1 gap-2 rounded-full"
                        >
                            Type: {dealTypes.find((t) => t._id === filters.dealType)?.name}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('dealType', '')} />
                        </Badge>
                    )}
                    {filters.store && (
                        <Badge
                            variant="secondary"
                            className="bg-orange-100 font-normal text-sm text-orange-600 hover:bg-orange-100 border-none px-3 py-1 gap-2 rounded-full"
                        >
                            Store: {stores.find((s) => s._id === filters.store)?.name}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('store', '')} />
                        </Badge>
                    )}
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    {dealTypes.length > 0 && (
                        <FilterListbox
                            value={filters.dealType}
                            placeholder="Deal Type"
                            onChange={(val) => handleFilterChange('dealType', val)}
                            options={dealTypes.map((type) => ({
                                value: type._id,
                                label: type.name,
                            }))}
                        />
                    )}

                    {stores.length > 0 && (
                        <FilterListbox
                            value={filters.store}
                            placeholder="Deal Store"
                            onChange={(val) => handleFilterChange('store', val)}
                            options={stores.map((store) => ({
                                value: store._id,
                                label: store.name,
                            }))}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DealsFilters;
