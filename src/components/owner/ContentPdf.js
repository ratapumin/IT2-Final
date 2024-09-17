import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

function ContentPdf() {


    return (
        <Document>
            <Page
                size={"A4"}
            >
                <Text> Khathong Coffee Shop</Text>
                <Text> Sales Report</Text>
                <Text> On 17-9-2024</Text>
                <Text> *** Sales ***</Text>
                <Text> *** Sales ***</Text>
                <Text> Gross</Text>
                <Text> 20000</Text>
                <Text> Discount</Text>
                <Text> 2400</Text>
                <Text> Cash</Text>
                <Text> 5700</Text>
                <Text> Promtpay</Text>
                <Text> 4300</Text>
           


            </Page>

        </Document>
    )


}

export default ContentPdf