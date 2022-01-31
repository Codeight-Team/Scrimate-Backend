const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : 'SB-Mid-server-41M6ioekupI5A6k4dCfM_0py'
    });
 
let parameter = {
    "transaction_details": {
        "order_id": "YOUR-ORDERID-123456",
        "gross_amount": 10000
    }
};

exports.getSnapToken = async (req, res) => {

    let parameter = {
        "transaction_details": {
            "order_id": "YOUR-ORDERID-123456",
            "gross_amount": 10000
        }
    };

    snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction token
        res.send(transaction)
    })
    
}