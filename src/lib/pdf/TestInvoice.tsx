import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from '@react-pdf/renderer';

export type InvoiceItem = {
    id: string;
    description: string;
    unitCost: number;
    quantity: number;
};

export type InvoiceData = {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    purchaseOrder: string;
    billedTo: string;
    from: string;
    items: InvoiceItem[];
    taxRate: number; 
    shipping: number;
    currency: string;
    bankDetails: string;
};

type TestInvoiceProps = {
    data: InvoiceData;
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 38,
        paddingHorizontal: 40,
        paddingBottom: 35,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#111111',
    },

    header: {
        marginBottom: 38,
    },

    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#5D727D',
        marginBottom: 42,
    },

    metaRow: {
        flexDirection: 'row',
    },

    metaColumn: {
        width: '33.333%',
    },

    label: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#5D727D',
        marginBottom: 10,
    },

    value: {
        fontSize: 10,
        color: '#111111',
    },

    billingRow: {
        flexDirection: 'row',
        marginBottom: 52,
    },

    billingColumn: {
        width: '33.333%',
        paddingRight: 20,
    },

    billingText: {
        fontSize: 10,
        lineHeight: 1.35,
    },

    invoiceBody: {
        backgroundColor: '#F0F3F5',
        marginHorizontal: -40,
        paddingHorizontal: 40,
        paddingTop: 38,
        paddingBottom: 30,
        minHeight: 400,
    },

    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 16,
    },

    tableHeaderText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#5D727D',
    },

    descriptionColumn: {
        width: '52%',
    },

    unitCostColumn: {
        width: '16%',
        textAlign: 'right',
    },

    qtyColumn: {
        width: '14%',
        textAlign: 'right',
    },

    amountColumn: {
        width: '18%',
        textAlign: 'right',
    },

    itemRow: {
        flexDirection: 'row',
        paddingBottom: 25,
        marginBottom: 15,
        borderBottom: '1px solid #5D727D',
    },

    itemText: {
        fontSize: 10,
    },

    totalsContainer: {
        marginTop: 25,
        marginLeft: '64%',
        width: '36%',
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    totalLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#5D727D',
    },

    totalValue: {
        fontSize: 10,
        textAlign: 'right',
    },

    invoiceTotalContainer: {
        marginTop: 70,
        alignItems: 'flex-end',
    },

    invoiceTotalLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#5D727D',
        marginBottom: 8,
    },

    invoiceTotal: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    footer: {
        marginTop: 26,
    },

    footerTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#5D727D',
        marginBottom: 10,
    },

    footerText: {
        fontSize: 10,
        lineHeight: 1.35,
    },
});

function formatMoney(
    value: number,
    currency: string,
) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function TestInvoice({ data }: TestInvoiceProps) {
    const subtotal = data.items.reduce(
        (sum, item) => sum + item.unitCost * item.quantity,
        0,
    );

    const tax = subtotal * (data.taxRate / 100);

    const total = subtotal + tax + data.shipping;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}

                <View style={styles.header}>
                    <Text style={styles.title}>
                        Invoice
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaColumn}>
                            <Text style={styles.label}>
                                INVOICE NUMBER
                            </Text>

                            <Text style={styles.value}>
                                {data.invoiceNumber}
                            </Text>
                        </View>

                        <View style={styles.metaColumn}>
                            <Text style={styles.label}>
                                DATE OF ISSUE
                            </Text>

                            <Text style={styles.value}>
                                {data.invoiceDate}
                            </Text>
                        </View>

                        <View style={styles.metaColumn}>
                            <Text style={styles.label}>
                                DUE DATE
                            </Text>

                            <Text style={styles.value}>
                                {data.dueDate}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* BILLING */}

                <View style={styles.billingRow}>

                    <View style={styles.billingColumn}>
                        <Text style={styles.label}>
                            BILLED TO
                        </Text>

                        <Text style={styles.billingText}>
                            {data.billedTo}
                        </Text>

                    </View>

                    <View style={styles.billingColumn}>
                        <Text style={styles.label}>
                            FROM
                        </Text>

                        <Text style={styles.billingText}>
                            {data.from}
                        </Text>
                    </View>

                    <View style={styles.billingColumn}>
                        <Text style={styles.label}>
                            PURCHASE ORDER
                        </Text>

                        <Text style={styles.billingText}>
                            {data.purchaseOrder || '-'}
                        </Text>
                    </View>

                </View>

                {/* ITEMS + TOTALS */}

                <View style={styles.invoiceBody}>

                    <View style={styles.tableHeader}>
                        <View style={styles.descriptionColumn}>
                            <Text style={styles.tableHeaderText}>
                                Description
                            </Text>
                        </View>

                        <View style={styles.unitCostColumn}>
                            <Text style={styles.tableHeaderText}>
                                Unit cost
                            </Text>
                        </View>

                        <View style={styles.qtyColumn}>
                            <Text style={styles.tableHeaderText}>
                                QTY
                            </Text>
                        </View>

                        <View style={styles.amountColumn}>
                            <Text style={styles.tableHeaderText}>
                                Amount
                            </Text>
                        </View>
                    </View>

                    {data.items.map((item) => {
                        const amount =
                            item.unitCost * item.quantity;

                        return (
                            <View
                                key={item.id}
                                style={styles.itemRow}
                            >
                                <View style={styles.descriptionColumn}>
                                    <Text style={styles.itemText}>
                                        {item.description}
                                    </Text>
                                </View>

                                <View style={styles.unitCostColumn}>
                                    <Text style={styles.itemText}>
                                        {formatMoney(
                                            item.unitCost,
                                            data.currency,
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.qtyColumn}>
                                    <Text style={styles.itemText}>
                                        {item.quantity}
                                    </Text>
                                </View>

                                <View style={styles.amountColumn}>
                                    <Text style={styles.itemText}>
                                        {formatMoney(
                                            amount,
                                            data.currency,
                                        )}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                    {/* TOTALS */}

                    <View style={styles.totalsContainer}>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                SUBTOTAL
                            </Text>

                            <Text style={styles.totalValue}>
                                {formatMoney(
                                    subtotal,
                                    data.currency,
                                )}
                            </Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                TAX RATE
                            </Text>

                            <Text style={styles.totalValue}>
                                {data.taxRate}%
                            </Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                TAX
                            </Text>

                            <Text style={styles.totalValue}>
                                {formatMoney(
                                    tax,
                                    data.currency,
                                )}
                            </Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                SHIPPING
                            </Text>

                            <Text style={styles.totalValue}>
                                {formatMoney(
                                    data.shipping,
                                    data.currency,
                                )}
                            </Text>
                        </View>

                    </View>

                    {/* INVOICE TOTAL */}

                    <View style={styles.invoiceTotalContainer}>
                        <Text style={styles.invoiceTotalLabel}>
                            INVOICE TOTAL
                        </Text>

                        <Text style={styles.invoiceTotal}>
                            {formatMoney(
                                total,
                                data.currency,
                            )}
                        </Text>
                    </View>

                </View>

                {/* BANK DETAILS */}

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        BANK ACCOUNT DETAILS
                    </Text>

                    <Text style={styles.footerText}>
                        {data.bankDetails || '-'}
                    </Text>
                </View>

            </Page>
        </Document>
    );
}