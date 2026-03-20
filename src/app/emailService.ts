import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_vfd8zl2";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_3xd7qtj";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "Sdun5oxhy_EIo4gXd";

export async function sendAdminOrderNotification(orderData: {
  order_id: string;
  customer_name: string;
  total_price: string;
  product_name: string;
}) {
  try {
    const templateParams = {
      name: "Admin", // {{name}}
      time: new Date().toLocaleString(), // {{time}}
      order_id: orderData.order_id,
      customer_name: orderData.customer_name,
      product_name: orderData.product_name,
      total_price: orderData.total_price,
      admin_link: window.location.origin + "/#admin-weldarab", // {{admin_link}}
      // On peut aussi ajouter les autres champs s'ils sont dans le template
      admin_email: "welad.darb@admin.com", 
      admin_password: "Ctrl + Shift + A" 
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("✅ Email de notification envoyé !", response.status, response.text);
    return response;
  } catch (error) {
    console.error("❌ Échec de l'envoi de l'email:", error);
    throw error;
  }
}

export async function sendAdminPasswordReminder(targetEmail: string, code: string) {
  try {
    const templateParams = {
      name: "Admin",
      time: new Date().toLocaleString(),
      order_id: "REQ_PWD",
      customer_name: "Demande de Code Accès",
      product_name: "CLEF DASHBOARD",
      total_price: "SECURE",
      admin_email: targetEmail,
      admin_password: code, // Reçoit le code dynamique
      admin_link: window.location.origin + "/#admin-weldarab"
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("✅ Code envoyé à " + targetEmail);
    return response;
  } catch (error) {
    console.error("❌ Échec de l'envoi du code:", error);
    throw error;
  }
}
