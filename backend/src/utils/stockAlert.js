// Stock alert notification utility
const stockAlerts = [];

/**
 * Send low stock notification
 * @param {Object} product - Product object with name, stock, stockAlertNumber
 * @returns {Object} Alert object
 */
export const sendLowStockNotification = (product) => {
  if (!product || product.stock >= product.stockAlertNumber) {
    return null;
  }

  const alert = {
    productId: product._id,
    productName: product.name,
    currentStock: product.stock,
    stockAlertNumber: product.stockAlertNumber,
    timestamp: new Date(),
    severity: product.stock === 0 ? 'critical' : 'warning'
  };

  // Store alert in array (in production, save to DB)
  stockAlerts.push(alert);

  // Log the alert
  console.log(
    `🚨 LOW STOCK ALERT: ${product.name} | Current: ${product.stock} | Alert Threshold: ${product.stockAlertNumber}`
  );

  // TODO: Implement actual notification methods:
  // - Send email notification
  // - Send SMS notification
  // - Trigger webhook
  // - Create notification in DB

  return alert;
};

/**
 * Get all active stock alerts
 */
export const getActiveStockAlerts = () => {
  return stockAlerts;
};

/**
 * Clear stock alerts
 */
export const clearStockAlerts = () => {
  stockAlerts.length = 0;
};

/**
 * Check if product is low on stock
 */
export const isLowOnStock = (stock, alertNumber) => {
  return stock < alertNumber;
};
