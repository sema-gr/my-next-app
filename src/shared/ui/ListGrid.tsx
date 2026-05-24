
interface ListGridProps<T> {
    items: T[];
    loading: boolean;
    renderItem: (item: T) => React.ReactNode;
    emptyText: string;
}

export function ListGrid<T>({
    items,
    loading,
    renderItem,
    emptyText,
}: ListGridProps<T>) {
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!items.length) {
        return <div>{emptyText}</div>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
                <div key={index}>{renderItem(item)}</div>
            ))}
        </div>
    );
}