import { QRCode } from "antd";
import { useEffect, useState } from "react";
const generatePayload = require('promptpay-qr')

function Promtpay({ sumCash }) {
    const [phoneNumber, setPhoneNumber] = useState('0621645650')
    const [amount, setAmount] = useState(20)
    const [qrcode, setQrcode] = useState(null)

    // useEffect(() => {
    //     console.log('sumCash', sumCash)
    // }, [sumCash])
    
    const handleSetQrcode = () => {
        if (sumCash) {
            setAmount(sumCash)
            const playload = generatePayload(phoneNumber, { amount: amount })
            setQrcode(playload)
        } else {
            console.log('no sumcash')
        }
        console.log('amount', amount)
    }
    useEffect(() => {
        handleSetQrcode()
    }, [amount])
    return (
        <div className="promtpay"> {/* จัดตำแหน่งตรงกลาง */}
            {qrcode && (
                <QRCode
                    errorLevel="Q"
                    value={qrcode}
                    icon="/logo-kathong.png"
                    iconSize={100}
                    size={300}
                />
            )}
        </div>
    );

}

export default Promtpay