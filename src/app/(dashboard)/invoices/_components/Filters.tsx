import styled from "styled-components";

import SearchInput from "@/components/inputs/SearchInput";
import Chips from "@/components/Chips";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";

import { ITEMS_PER_PAGE } from "../_utils/constant";

import { InvoiceFilters } from "../_types/filters";

const Filters = ({ filters, setFilters, count }: { filters: InvoiceFilters, setFilters: React.Dispatch<React.SetStateAction<InvoiceFilters>>, count: number }) => {

    const changeStatus = (status: string) => {
        const newFilters = { ...filters, page: 1 }

        if (status === 'all') {
            delete newFilters.status
        } else {
            newFilters.status = status as InvoiceFilters['status']
        }

        setFilters(newFilters)
    }

    const pages = Math.ceil(count / ITEMS_PER_PAGE);

    return (
        <Wrapper>
            <SearchInput placeholder="Buscar por número de factura o moneda..." onSearch={v => setFilters({ ...filters, search: v, page: 1 })} width="50%" />

            <Chips
                items={[
                    { text: 'Todas', value: 'all' },
                    { text: 'Pagadas', value: 'paid' },
                    { text: 'En proceso', value: 'processing' },
                    { text: 'No pagadas', value: 'unpaid' },
                ]}
                selected={filters.status || 'all'}
                onClick={changeStatus}
            />

            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', marginLeft: 'auto' }}>
                {pages <= 5 ? (
                    <>
                        {[...Array(pages)].map((_, i) => (
                            <Button
                                key={i}
                                text={(i + 1).toString()}
                                size="ultra-small"
                                onClick={() => setFilters({ ...filters, page: i + 1 })}
                                disabled={filters.page === i + 1}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        <IconButton icon={"nav-arrow-left"} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} disabled={filters.page === 1} />

                        {filters.page > 1 && (
                            <Button
                                text={(filters.page - 1).toString()}
                                size="ultra-small"
                                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                            />
                        )}

                        <Button
                            text={filters.page.toString()}
                            size="ultra-small"
                            onClick={() => setFilters({ ...filters, page: filters.page })}
                            disabled
                        />

                        {filters.page < pages && (
                            <Button
                                text={(filters.page + 1).toString()}
                                size="ultra-small"
                                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                            />
                        )}

                        <IconButton icon={"nav-arrow-right"} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={filters.page === pages} />
                    </>
                )}
            </div>
        </Wrapper >
    )
}

export default Filters;

const Wrapper = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;