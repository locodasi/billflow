import styled from "styled-components";

import { useTranslations } from "next-intl";

import SearchInput from "@/components/inputs/SearchInput";
import Chips from "@/components/Chips";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";

import { ITEMS_PER_PAGE } from "../_utils/constant";

import { PaymentFilters } from "../_types/filters";
import { DesktopComponent, MobileComponent } from "@/components/DiscoverVersions";
import NormalSelect from "@/components/Select";

const Filters = ({ filters, setFilters, count }: { filters: PaymentFilters, setFilters: React.Dispatch<React.SetStateAction<PaymentFilters>>, count: number }) => {

    const t = useTranslations('payments');

    const changeStatus = (status: string) => {
        const newFilters = { ...filters, page: 1 }

        if (status === 'all') {
            delete newFilters.status
        } else {
            newFilters.status = status as PaymentFilters['status']
        }

        setFilters(newFilters)
    }

    const pages = Math.ceil(count / ITEMS_PER_PAGE);

    const SELECT_OPTIONS = [
        { label: t('all'), value: 'all' },
        { label: t('status.approved_plural'), value: 'approved' },
        { label: t('status.pending_plural'), value: 'pending' },
        { label: t('status.rejected_plural'), value: 'rejected' },
    ]

    return (
        <Wrapper>
            <SearchWrapper>
                <SearchInput placeholder={t('search_placeholder')} onSearch={v => setFilters({ ...filters, search: v, page: 1 })} />
            </SearchWrapper>

            <DesktopComponent>
                <Chips
                    items={[
                        { text: t('all'), value: 'all' },
                        { text: t('status.approved_plural'), value: 'approved' },
                        { text: t('status.pending_plural'), value: 'pending' },
                        { text: t('status.rejected_plural'), value: 'rejected' },
                    ]}
                    selected={filters.status || 'all'}
                    onClick={changeStatus}
                />
            </DesktopComponent>

            <MobileComponent>
                <NormalSelect
                    options={SELECT_OPTIONS}
                    value={SELECT_OPTIONS.find(o => o.value === filters.status) || { label: t('all'), value: 'all' }}
                    onChange={(v) => changeStatus(v.value)}
                    width="160px"
                />
            </MobileComponent>

            <Pagination>
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
            </Pagination>
        </Wrapper >
    )
}

export default Filters;

const Wrapper = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 0.75rem;
    }
`;

const SearchWrapper = styled.div`
    width: 50%;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Pagination = styled.div`
    display: flex;
    gap: 0.25rem;
    align-items: center;
    margin-left: auto;

    @media (max-width: 768px) {
        margin-left: auto;
    }
`;