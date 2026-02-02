import Stripe from 'stripe';

// if (!process.env.STRIPE_SECRET_KEY) {
//     throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your .env.local file.');
// }

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy', {
    appInfo: {
        name: 'RAG Chatbot SaaS',
        version: '0.1.0'
    },
    typescript: true,
});
