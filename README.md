#### Envirnoment variables

##### For React App

- STRIPE_PUB_KEY

##### For Express App

- STRIPE_PRIV_KEY
- PLAN_ID

### Steps to genereate the credentials

1. Create the stripe account.
2. Confirm the email address. (Note the public and private key from developer's tab)
3. Create a product. (https://dashboard.stripe.com/test/products)
4. Create the plan/price for the product by using dashboard or by using.

```
curl https://api.stripe.com/v1/plans \
>   -u SECRET KEY: \
>   -d amount=100 \
>   -d currency=inr \
>   -d interval=month \
>   -d product=PRODUCT_ID
```

### Prcoess

1. The react App initiat the payment and generate the payment token.
2. The payment token is then send to express app.
3. The express app then creates the stripe customer and subcribe it to the plan.
4. The react app then confirms the payment and displays the message in the console.
