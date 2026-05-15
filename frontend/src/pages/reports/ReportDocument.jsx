import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
const ReportDocument = ({ expenses, startDate, endDate }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#fff",
      padding: 20,
    },
    header: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
    },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      marginBottom: 20,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableColHeader: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      backgroundColor: "#f0f0f0",
      padding: 5,
      fontWeight: "bold",
    },
    tableCol: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
    },
  });


return (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Expense Report</Text>
      <Text style={{ marginBottom: 10 }}>
        {startDate} to {endDate}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Title</Text>
          <Text style={styles.tableColHeader}>Amount (₹)</Text>
          <Text style={styles.tableColHeader}>Category</Text>
          <Text style={styles.tableColHeader}>Date</Text>
          <Text style={styles.tableColHeader}>Notes</Text>
        </View>
        {expenses.map((expense, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCol}>{expense.title}</Text>
            <Text style={styles.tableCol}>₹{expense.amount.toFixed(2)}</Text>
            <Text style={styles.tableCol}>{expense.category}</Text>
            <Text style={styles.tableCol}>{expense.date}</Text>
            <Text style={styles.tableCol}>{expense.notes}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
}

export default ReportDocument;
