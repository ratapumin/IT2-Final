import { QRCode } from "antd";
import { useEffect, useState } from "react";
const generatePayload = require('promptpay-qr')

function Promtpay() {
    const [phoneNumber, setPhoneNumber] = useState('0621645650')
    const [amount, setAmount] = useState(20)
    const [qrcode, setQrcode] = useState()


    const handleSetQrcode = () => {
        const playload = generatePayload(phoneNumber, { amount: amount })
        setQrcode(playload)
    }
    useEffect(() => {
        handleSetQrcode()
    }, [amount])
    return (
        <QRCode
            errorLevel="Q"
            value={qrcode}
            icon="/logo-kathong.png"
            iconSize={100}
            size={300}
        />

    )


}

export default Promtpay