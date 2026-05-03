import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';
import apiClient from '../services/api';

export default function RazorpayWebView({ route, navigation }) {
  const { rzpOrder, cartItems, totalAmount } = route.params;

  const RAZORPAY_KEY_ID = "rzp_test_SiiaT0kKksa2fs"; 

  const razorpayHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <script>
          var options = {
            "key": "${RAZORPAY_KEY_ID}",
            "amount": "${rzpOrder.amount}",
            "currency": "INR",
            "name": "Kisan Marg",
            "order_id": "${rzpOrder.id}",
            "handler": function (response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: 'success',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }));
            },
            "modal": { "ondismiss": function() { window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'cancelled' })); } },
            "theme": { "color": "#6aaa49" }
          };
          var rzp = new Razorpay(options);
          rzp.open();
        </script>
      </body>
    </html>
  `;

  const onMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.status === 'success') {
      try {
        // Send payment details AND the full cartItems array to split the orders
        const res = await apiClient.post('/orders/verify', {
          ...data,
          cartItems: cartItems
        });
        if (res.data.success) {
          navigation.replace('OrderSuccess');
        }
      } catch (err) {
        alert("Verification failed");
        navigation.goBack();
      }
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ html: razorpayHtml }} onMessage={onMessage} />
    </View>
  );
}