import corn from 'node-cron'
import { userOrderModel } from '../models/userOrder.model.js'


corn.schedule("*/5 * * * *", async () => {
    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

        const result = await userOrderModel.updateMany(
            {
                paymentStatus: 'Pending',
                orderTime: {$lt: thirtyMinutesAgo}
            },
            {
                paymentStatus: 'Cancle',
                orderStatus: 'Cancle'
            }
        )

        if (result.modifiedCount > 0) {
      console.log(`Auto-cancelled ${result.modifiedCount} pending orders`);
    }
    } catch (error) {
        console.log('Auto cancelcorn error:', error)
    }
})