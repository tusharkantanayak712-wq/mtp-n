import nodemailer from "nodemailer";

/**
 * Retrieves all configured Gmail accounts from environment variables.
 * Supports GMAIL_USER, GMAIL_USER2, GMAIL_USER3, etc.
 */
export function getMailAccounts() {
  const accounts = [];
  
  // Check main account
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    accounts.push({
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    });
  }
  
  // Check numbered accounts (GMAIL_USER2, GMAIL_USER3, etc.)
  let i = 2;
  while (process.env[`GMAIL_USER${i}`] && process.env[`GMAIL_APP_PASSWORD${i}`]) {
    accounts.push({
      user: process.env[`GMAIL_USER${i}`],
      pass: process.env[`GMAIL_APP_PASSWORD${i}`]
    });
    i++;
  }
  
  return accounts;
}

let cachedTransporters = null;

/**
 * Creates and caches nodemailer transporters for all configured accounts.
 */
export function getTransporters() {
  if (cachedTransporters) {
    return cachedTransporters;
  }

  const accounts = getMailAccounts();
  cachedTransporters = accounts.map(acc => ({
    account: acc,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: acc,
    })
  }));

  return cachedTransporters;
}

// Global variable to keep track of the next transporter to use (for round-robin)
let nextTransporterIndex = 0;

/**
 * Gets the next transporter in a round-robin fashion.
 * Useful for single emails like OTP or Purchase confirmations.
 */
export function getNextTransporter() {
  const transporters = getTransporters();
  if (transporters.length === 0) return null;
  
  const selected = transporters[nextTransporterIndex % transporters.length];
  nextTransporterIndex = (nextTransporterIndex + 1) % transporters.length;
  return selected;
}
